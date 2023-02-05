
#include "tiktok.h"

/*
handlers/tiktok.cpp
*/

static std::string process(const std::string &q) {
    httplib::SSLClient cli("www.tikwm.com", 443);
    cli.enable_server_certificate_verification(false);
    if (auto res = cli.Get(
            "/api/?count=12&cursor=0&web=1&hd=1&url=" + encode_url(q),
            {{"Accept",       "application/json, text/javascript, */*; q=0.01"},
             {"Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"},
             {"sec-ch-ua",
                              R"("Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104")"},
             {"User-Agent",
                              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                              "(KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"}})) {

        return res->body;
    } else {
        return {};
    }
}

static std::string bindStmt(const std::string &body, std::string &q,
                            sqlite3_stmt *stmt) {
    auto doc = nlohmann::json::parse(body);

    auto title = doc["data"]["title"].get<std::string>();
    auto hdplay = doc["data"]["hdplay"].get<std::string>();
    auto music_play = doc["data"]["music_info"]["play"].get<std::string>();
    auto music_title = doc["data"]["music_info"]["title"].get<std::string>();
    auto music_author = doc["data"]["music_info"]["author"].get<std::string>();
    auto cover = doc["data"]["cover"].get<std::string>();
    auto seconds = getUnixTimeStamp();

    sqlite3_reset(stmt);
    sqlite3_bind_text(stmt, 1, title.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 2, q.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 3, hdplay.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 4, music_play.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 5, music_title.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 6, music_author.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 7, cover.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_int(stmt, 8, 1);
    sqlite3_bind_int64(stmt, 9, seconds);
    sqlite3_bind_int64(stmt, 10, seconds);

    return {};
}

void handleTiktok(const httplib::Request &request, httplib::Response &response,
                  kp::database &db) {
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

void handleListVideos(const httplib::Request &request,
                      httplib::Response &response, kp::database &db) {
    auto s = request.get_param_value("s");
    auto t = request.get_param_value("t");
    auto l = request.get_param_value("l");
    auto o = request.get_param_value("o");

    auto str = db.listVideos(s.empty(), [=](sqlite3_stmt *stmt) {
        sqlite3_reset(stmt);
        sqlite3_bind_int(stmt, 1, std::atoi(t.c_str()));
        sqlite3_bind_int(stmt, 2, std::atoi(l.c_str()));
        sqlite3_bind_int(stmt, 3, std::atoi(o.c_str()));
        return std::string{};
    });
    response.set_content(str, "application/json");
}

void handleQueryVideo(const httplib::Request &request,
                      httplib::Response &response, kp::database &db) {
    auto id = request.get_param_value("id");
    auto str = db.queryVideo([&id](sqlite3_stmt *stmt) {
        sqlite3_reset(stmt);
        sqlite3_bind_text(stmt, 1, id.c_str(), -1, SQLITE_TRANSIENT);
        return std::string{};
    });
    response.set_content(str, "application/json");
}

void handleDeleteVideo(const httplib::Request &request,
                       httplib::Response &response, kp::database &db) {
    auto id = request.get_param_value("id");

    auto str = db.deleteVideo([&id](sqlite3_stmt *stmt) {
        sqlite3_reset(stmt);
        // https://www.sqlite.org/c3ref/bind_blob.html
        int ret = sqlite3_bind_text(stmt, 1, id.c_str(), -1, SQLITE_TRANSIENT);
        if (ret != SQLITE_OK) {
            LOGE("%s", sqlite3_errstr(ret));
        }
        return std::string{};
    });
    response.set_content("Ok", "text/plain");
}

void handleUpdateVideo(const httplib::Request &request,
                       httplib::Response &response, kp::database &db) {
    auto t = request.get_param_value("t");
    auto id = request.get_param_value("id");
    auto str = db.updateVideo([&t, &id](sqlite3_stmt *stmt) {
        sqlite3_reset(stmt);
        sqlite3_bind_text(stmt, 1, t.c_str(), -1, SQLITE_TRANSIENT);
        auto seconds = getUnixTimeStamp();
        sqlite3_bind_int64(stmt, 2, seconds);
        sqlite3_bind_text(stmt, 3, id.c_str(), -1, SQLITE_TRANSIENT);
        return std::string{};
    });
    response.set_content(str, "application/json");
}