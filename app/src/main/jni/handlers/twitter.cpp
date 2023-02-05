

#include "twitter.h"

/*
handlers/twitter.cpp
*/
/*
通过接口 https://twittervideodownloaderpro.com/twittervideodownloadv2/index.php 
获取 Twitter 视频真实地址
  */
static std::string process(const std::string &q) {
    httplib::SSLClient cli("twittervideodownloaderpro.com", 443);
    cli.enable_server_certificate_verification(false);
    httplib::Headers headers = {{
                                        "User-Agent",
                                        "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.56 Mobile Safari/537.36"
                                }};
    httplib::Params params = {{
                                      "id", q
                              }};
    if (auto res = cli.Post("/twittervideodownloadv2/index.php", headers,
                            params)) {
        /*
         获取状态 res->status
         */
        return res->body;
    } else {
/*
https://github.com/yhirose/cpp-httplib
获取错误信息 httplib::to_string(res.error()).c_str()
  */

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

void
handleTwitter(const httplib::Request &request, httplib::Response &response, kp::database &db) {
    response.set_header("Access-Control-Allow-Origin", "*");
    auto action = request.get_param_value("action");
    if (action.empty()) {
        auto q = request.get_param_value("q");
        auto body = process(q);
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
}
