#ifndef TOUTIAO_H
#define TOUTIAO_H

/*
#include "toutiao.h"
*/


std::string getToutiaoLocation(const std::string &uri) {
    httplib::SSLClient cli("m.toutiao.com", 443);
    cli.enable_server_certificate_verification(false);
    httplib::Headers headers = {{
                                        "User-Agent",
                                        "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.56 Mobile Safari/537.36"
                                }};
    if (auto res = cli.Get(uri, headers)) {
        return res->get_header_value("location");
    } else {
        return std::string();
    }
}
// https://m.toutiao.com/video/7187727505476977210/?app=news_article&timestamp=1673581345&share_token=fded8b43-055f-4725-9c8a-11b031f70754&tt_from=copy_link&utm_source=copy_link&utm_medium=toutiao_android&utm_campaign=client_share


std::string getToutiao(const std::string &uri) {
    auto location = getToutiaoLocation(uri);
    if (location.empty()) {
        return std::string();
    }
    auto id = substring(location, "/video/", "/");
    httplib::SSLClient cli("www.ixigua.com", 443);
    cli.enable_server_certificate_verification(false);
    httplib::Headers headers = {{
                                        "User-Agent",
                                                  "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
                                },
                                {
                                        "Accept", "*/*"
                                },
    };
    // +"&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333"

    if (auto res = cli.Get(
            "/api/public/videov2/brief/details?group_id=" + id, headers)) {
        return res->body;
    } else {

        return std::string();
    }
}


bool processToutiao(const std::string &data, sqlite3_stmt *stmt, const std::string &uri) {

    nlohmann::json j =  nlohmann::json::parse(data);

    auto title = j["data"]["title"].get<std::string>();
    auto hdplay = std::string();
    auto music_play = std::string();
    auto music_title = std::string();
    auto music_author = std::string();
    auto cover = j["data"]["posterUrl"].get<std::string>();
    auto seconds = getUnixTimeStamp();

    /* LOGE("title = %s; \n hdplay = %s; \n music_play = %s; \n music_title = %s; \n music_author = %s; \n cover = %s; \n seconds = %lld; \n",
          title.c_str(), hdplay.c_str(), music_play.c_str(), music_title.c_str(),
          music_author.c_str(), cover.c_str(), seconds);*/

    sqlite3_reset(stmt);

    sqlite3_bind_text(stmt, 1, title.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 2, uri.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 3, hdplay.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 4, music_play.c_str(), -1,
                      SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 5, music_title.c_str(), -1,
                      SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 6, music_author.c_str(), -1,
                      SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 7, cover.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_int(stmt, 8, 4);
    sqlite3_bind_int64(stmt, 9, seconds);
    sqlite3_bind_int64(stmt, 10, seconds);

    int ret = sqlite3_step(stmt);
    if (ret == SQLITE_DONE) {
        return true;
    } else {
        return false;
    }
}


std::string getToutiaoV1(const std::string &uri, const std::string &cookie) {
    auto location = getToutiaoLocation(uri);
    if (location.empty()) {
        return std::string();
    }
    auto id = substring(location, "/video/", "/");
    httplib::SSLClient cli("www.toutiao.com", 443);
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
            "/video/" + id, headers)) {
        auto body = res->body;
        return substring(body, "%22main_url%22%3A%22", "%22");
    } else {

        return std::string();
    }
}

#endif