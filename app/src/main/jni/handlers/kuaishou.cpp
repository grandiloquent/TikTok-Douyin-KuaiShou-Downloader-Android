
#include "kuaishou.h"

/*
handlers/kuaishou.cpp
*/
std::string getKuaishouLocation(const std::string &uri) {
    httplib::SSLClient cli("v.kuaishou.com", 443);
    cli.enable_server_certificate_verification(false);
    httplib::Headers headers = {{
                                        "User-Agent",
                                        "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.56 Mobile Safari/537.36"
                                }};
    if (auto res = cli.Get(uri, headers)) {
        return res->get_header_value("location");
    } else {
        return {};
    }
}
static std::string process(const std::string &q, const std::string &cookie) {
    auto location = getKuaishouLocation(q);
    if (location.empty()) {
        return {};
    }
    auto id = substring(location, "/photo/", "?");
    httplib::SSLClient cli("www.kuaishou.com", 443);
    cli.enable_server_certificate_verification(false);
    httplib::Headers headers = {{
                                        "User-Agent",
                                                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
                                },
                                {
                                        "Accept", "*/*"
                                },
                                {
                                        "Cookie", cookie
                                },
    };
    if (auto res = cli.Get(
            "/short-video/" + id, headers)) {
        return res->body;
    } else {

        return {};
    }
}

static std::string bindStmt(const std::string &body, std::string &q, sqlite3_stmt *stmt) {
    auto doc = nlohmann::json::parse(body);
    if (doc["state"] == "error") {
        return doc["error_message"];
    }
    auto videos = doc["videos"];
    int j = 0;
    int size = 0;
    for (int i = 0; i < videos.size(); i++) {
        auto s = videos[i]["size"].get<int>();
        if (s > size) {
            size = s;
            j = i;
        }
    }
    auto title = videos[j]["text"].get<std::string>();
    auto hdplay = videos[j]["url"].get<std::string>();

    auto cover = videos[j]["thumb"].get<std::string>();
    auto seconds = getUnixTimeStamp();

    sqlite3_reset(stmt);
    sqlite3_bind_text(stmt, 1, title.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 2, q.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 3, hdplay.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 4, "", -1,
                      SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 5, "", -1,
                      SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 6, "", -1,
                      SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 7, cover.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_int(stmt, 8, 2);
    sqlite3_bind_int64(stmt, 9, seconds);
    sqlite3_bind_int64(stmt, 10, seconds);
    return {};
}





std::string getKuaishouV1(const std::string &uri, const std::string &cookie) {
    auto location = getKuaishouLocation(uri);
    if (location.empty()) {
        return {};
    }
    auto id = substring(location, "/photo/", "/");
    httplib::SSLClient cli("www.kuaishou.com", 443);
    cli.enable_server_certificate_verification(false);
    httplib::Headers headers = {{
                                        "User-Agent",
                                                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
                                },
                                {
                                        "Cookie", cookie
                                },
                                {
                                        "Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
                                }
    };
    // +"&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333"

    if (auto res = cli.Get(
            "/short-video/" + id, headers)) {
        auto body = res->body;
        return decodeString(substring(body, R"("photoUrl":")", "\""));
    } else {

        return {};
    }
}


void
handleKuaishou(const httplib::Request &request, httplib::Response &response,
               const std::string &cookie, kp::database &db) {
    response.set_header("Access-Control-Allow-Origin", "*");
    if (cookie.empty()) {
        response.status = 404;
        return;
    }
    auto q = request.get_param_value("q");
    auto action = request.get_param_value("action");
    if (action == "1") {
        response.set_content(getKuaishouV1(q, cookie), "text/plain");
        return;
    }
    auto body = process(q,cookie);
    if (body.empty()) {
        response.status = 500;
        response.set_content("Empty body.", "text/plain");
        return;
    }
    auto message = db.insertVideo([&body, &q](sqlite3_stmt *stmt) {
        auto ret = bindStmt(body, q, stmt);
        if (!ret.empty()) {
            return ret;
        }
        int err = sqlite3_step(stmt);
        if (err != SQLITE_DONE) {
            return std::string{sqlite3_errmsg(sqlite3_db_handle(stmt))};
        }
        return std::string{};
    });
    if (!message.empty()) {
        response.status = 500;
        response.set_content(message, "text/plain");
        return;
    }
}