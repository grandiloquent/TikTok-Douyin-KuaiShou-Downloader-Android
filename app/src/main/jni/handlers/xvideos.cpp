
#include "xvideos.h"

/*
handlers/xvideos.cpp
*/

static std::string process(const std::string &uri, const std::string &cookie) {


    httplib::SSLClient cli("www.xvideos.com", 443);
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

    if (auto res = cli.Get(uri, headers)) {

        if (res->status == 302) {
            return process(res->get_header_value("location").substr(23), cookie);
        }
        return res->body;
    } else {

        return {};
    }
}

static std::string bindStmt(const std::string &body, std::string &q, sqlite3_stmt *stmt) {
    auto title = substring(body, ".setVideoTitle('", "');");


//    json j = json::parse(data);
//
//    auto title = j["data"]["title"].get<std::string>();
    auto hdplay = std::string();
    auto music_play = std::string();
    auto music_title = std::string();
    auto music_author = std::string();
    auto cover = substring(body, ".setThumbUrl('", "');");
    if (!cover.empty()) {
        cover = decodeString(cover);
    }
    auto seconds = getUnixTimeStamp();

//     LOGE("title = %s; \n hdplay = %s; \n music_play = %s; \n music_title = %s; \n music_author = %s; \n cover = %s; \n seconds = %lld; \n",
//          title.c_str(), hdplay.c_str(), music_play.c_str(), music_title.c_str(),
//          music_author.c_str(), cover.c_str(), seconds);

    sqlite3_reset(stmt);

    sqlite3_bind_text(stmt, 1, title.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 2, q.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 3, hdplay.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 4, music_play.c_str(), -1,
                      SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 5, music_title.c_str(), -1,
                      SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 6, music_author.c_str(), -1,
                      SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 7, cover.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_int(stmt, 8, -1);
    sqlite3_bind_int64(stmt, 9, seconds);
    sqlite3_bind_int64(stmt, 10, seconds);
    return {};
}

std::string getXvideosV1(const std::string &uri, const std::string &cookie) {
    httplib::SSLClient cli("www.xvideos.com", 443);
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

    if (auto res = cli.Get(uri, headers)) {
        if (res->status == 302) {
            return getXvideosV1(res->get_header_value("location").substr(23), cookie);
        }
        auto body = res->body;
        return decodeString(substring(body, ".setVideoUrlHigh('", "');"));
    } else {

        return {};
    }
}

void
handleXvideos(const httplib::Request &request, httplib::Response &response,
              const std::string &cookie, kp::database &db) {
    response.set_header("Access-Control-Allow-Origin", "*");
    if (cookie.empty()) {
        response.status = 404;
        return;
    }
    auto q = request.get_param_value("q");
    auto action = request.get_param_value("action");
    if (action == "1") {
        response.set_content(getXvideosV1(q, cookie), "text/plain");
        return;
    }
    auto body = process(q, cookie);

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

