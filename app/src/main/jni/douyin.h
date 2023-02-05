#ifndef DOUYIN_H
#define DOUYIN_H

/*#include "douyin.h"*/

/*
 * https://www.iesdouyin.com/share/video/7187276185376804128/?region=US&mid=7187276262254119736&u_code=26abeii3mbl6&did=MS4wLjABAAAAFwUpFpqnmgJvSRmygW8Lxl-q0SW3qPV2vN_fVhKff-1lByKJjf5DHCP3bPALZgeG&iid=MS4wLjABAAAAgYivNtFx7ukVr7m1r577LyOjtMz-a4621R7XHbxmgJdQWZqWvzwYl4D5MDUZjmAX&with_sec_did=1&titleType=title&from_ssr=1&utm_source=copy&utm_campaign=client_share&utm_medium=android&app=aweme
 * */
#include "httplib.h"
#include "shared.h"
std::string getDouyinLocation(const std::string &uri) {
    httplib::SSLClient cli("v.douyin.com", 443);
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

std::string getDouyin(const std::string &uri) {
    auto location = getDouyinLocation(uri);
    if (location.empty()) {
        return std::string();
    }
    auto id = substring(location, "/video/", "/");

    httplib::SSLClient cli("www.iesdouyin.com", 443);
    cli.enable_server_certificate_verification(false);
    httplib::Headers headers = {{
                                        "User-Agent",
                                                  "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
                                },
                                {
                                        "Accept", "*/*"
                                },
                                {
                                        "cookie",
                                                  "s_v_web_id=verify_lcth0kqh_PHUxhwMM_OjUP_4zNE_9xNb_HOZnD85SvscZ"
                                }};
    // +"&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333"

    if (auto res = cli.Get(
            "/aweme/v1/web/aweme/detail/?aweme_id=" + id +
            "&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333", headers)) {
        return res->body;
    } else {

        return std::string();
    }
}

bool processDouYin(const std::string &data, sqlite3_stmt *stmt, const std::string &uri) {

    nlohmann::json j =  nlohmann::json::parse(data);

    auto title = j["aweme_detail"]["preview_title"].get<std::string>();
    auto hdplay = j["aweme_detail"]["video"]["play_addr"]["url_list"][0].get<std::string>();
    auto music_play = j["aweme_detail"]["music"]["play_url"]["url_list"][0].get<std::string>();
    auto music_title = j["aweme_detail"]["music"]["title"].get<std::string>();
    auto music_author = j["aweme_detail"]["music"]["author"].get<std::string>();
    auto cover = j["aweme_detail"]["video"]["cover"]["url_list"][0].get<std::string>();
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
    sqlite3_bind_int(stmt, 8, 3);
    sqlite3_bind_int64(stmt, 9, seconds);
    sqlite3_bind_int64(stmt, 10, seconds);

    int ret = sqlite3_step(stmt);
    if (ret == SQLITE_DONE) {
        return true;
    } else {
        return false;
    }
}


#endif
