#include "database.h"
#include "definitions.h"
#include "douyin.h"
#include "editor.h"
#include "notes.h"
#include "markdown.h"
#include "news.h"
#include "handlers/image.h"
#include "handlers/kuaishou.h"
#include "handlers/listVideos.h"
#include "handlers/mp4.h"
#include "handlers/tiktok.h"
#include "handlers/twitter.h"
#include "httplib.h"
#include "index.h"
#include "shared.h"
#include "sqlite3.h"
#include "toutiao.h"
#include "video.h"
#include "videos.h"


#include "handlers/kuaishou.h"
#include "handlers/note.h"
#include "handlers/xvideos.h"

static inline void WritePrefix(std::ostream *os, const char *prefix, bool odd) {
    if (prefix != nullptr) {
        *os << prefix;
    }
    *os << "  ";
    if (!odd) {
        *os << " ";
    }
}

static bool RunCommand(const std::string &cmd, std::ostream *os, const char *prefix) {
    FILE *stream = popen(cmd.c_str(), "r");
    if (stream) {
        if (os != nullptr) {
            bool odd_line = true;               // We indent them differently.
            bool wrote_prefix = false;          // Have we already written a prefix?
            constexpr size_t kMaxBuffer = 128;  // Relatively small buffer. Should be OK as we're on an
            // alt stack, but just to be sure...
            char buffer[kMaxBuffer];
            while (!feof(stream)) {
                if (fgets(buffer, kMaxBuffer, stream) != nullptr) {
                    // Split on newlines.
                    char *tmp = buffer;
                    for (;;) {
                        char *new_line = strchr(tmp, '\n');
                        if (new_line == nullptr) {
                            // Print the rest.
                            if (*tmp != 0) {
                                if (!wrote_prefix) {
                                    WritePrefix(os, prefix, odd_line);
                                }
                                wrote_prefix = true;
                                *os << tmp;
                            }
                            break;
                        }
                        if (!wrote_prefix) {
                            WritePrefix(os, prefix, odd_line);
                        }
                        char saved = *(new_line + 1);
                        *(new_line + 1) = 0;
                        *os << tmp;
                        *(new_line + 1) = saved;
                        tmp = new_line + 1;
                        odd_line = !odd_line;
                        wrote_prefix = false;
                    }
                }
            }
        }
        pclose(stream);
        return true;
    } else {
        return false;
    }
}

std::string GetNewsFeed(const std::string &from, const std::string &size) {
    httplib::SSLClient cli("api.newsfilter.io", 443);
    cli.enable_server_certificate_verification(false);
    httplib::Headers headers = {{
                                        "User-Agent",
                                        "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.56 Mobile Safari/537.36"
                                },
                                {
                                        "Content-Type",
                                        "application/json"
                                }};
    nlohmann::json js = {
            // zacks accesswire barrons globenewswire businesswire prNewswire  benzinga
            // seekingAlpha bloomberg cnbc
            // https://developers.newsfilter.io/docs/news-query-api-request-response-formats.html
            {"type", "filterArticles"},
            {
             "queryString",
                     "source.id: (reuters)"
            },
            {
             "from", from,
            },
            {
             "size",size
            }
    };
    auto body = js.dump();
    if (auto res = cli.Post(
            "/public/actions?token=vgkjaxk2tiebiudhkjirhnaozaeeoiw4ikdpsrolbeoeadfeph09sjfzsaog5bzi",
            headers, body, "application/json")) {
        return res->body;
    } else {
        return {};
    }
}

extern "C" JNICALL jboolean Java_cn_kpkpkp_ServerService_startServer(
        JNIEnv *env, jclass obj, jobject context, jstring ip, jint port) {
    const std::string host = jsonparse::jni::Convert<std::string>::from(env, ip);

    jclass clazz = env->GetObjectClass(context);
    jmethodID getString = env->GetMethodID(
            clazz, "getString", "(Ljava/lang/String;)Ljava/lang/String;");
    // ====================================
    auto directory = readPreference(env, context, getString, "key_directory");
    auto toutiaoCookie =
            readPreference(env, context, getString, "key_toutiao_cookie");
    auto kuaishouCookie =
            readPreference(env, context, getString, "key_kuaishou_cookie");
    auto xvideosCookie =
            readPreference(env, context, getString, "key_xvideos_cookie");

    auto videosDirectory =
            directory.substr(0, directory.find("/Android/")) + "/Download";
    // ====================================

    kp::database db1(directory);

    sqlite3 *db = nullptr;
    // ====================================
    sqlite3_stmt *insertStmt = nullptr;
    //    sqlite3_prepare_v2(db,
    //                       "insert into video (title, url, play, music_play,
    //                       music_title, music_author, cover, video_type,
    //                       create_at, update_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?,
    //                       ?,?)", -1, &insertStmt, nullptr);

    httplib::Server server;
    server.Get("/", [](const httplib::Request &req, httplib::Response &res) {
        res.set_content(INDEX, "text/html");
    });
    server.Get("/videos",
               [](const httplib::Request &req, httplib::Response &res) {
                   res.set_content(VIDEOS, "text/html");
               });
    server.Get("/video", [](const httplib::Request &req, httplib::Response &res) {
        res.set_content(VIDEO, "text/html");
    });
    server.Get("/editor",
               [](const httplib::Request &req, httplib::Response &res) {
                   res.set_content(EDITOR, "text/html");
               });
    server.Get("/notes", [](const httplib::Request &req, httplib::Response &res) {
        res.set_content(NOTES, "text/html");
    });
    server.Get("/markdown", [](const httplib::Request &req, httplib::Response &res) {
        res.set_content(MARKDOWN, "text/html");
    });
    server.Get("/news", [](const httplib::Request &req, httplib::Response &res) {
        res.set_content(NEWS, "text/html");
    });
    server.Get("/api/tiktok", [&db1](const httplib::Request &request,
                                     httplib::Response &response) {
        response.set_header("Access-Control-Allow-Origin", "*");
        auto action = request.get_param_value("action");
        if (action.empty()) {
            handleTiktok(request, response, db1);
        } else if (action == "1") {
            handleListVideos(request, response, db1);
        } else if (action == "2") {
            handleQueryVideo(request, response, db1);
        } else if (action == "3") {
            // 删除视频
            handleDeleteVideo(request, response, db1);
        }
    });
    server.Get("/api/twitter", [&db1](const httplib::Request &request,
                                      httplib::Response &response) {
        handleTwitter(request, response, db1);
    });

    server.Get("/api/douyin", [&insertStmt](const httplib::Request &request,
                                            httplib::Response &response) {
        response.set_header("Access-Control-Allow-Origin", "*");
        auto q = request.get_param_value("q");
        auto body = getDouyin(q);
        if (body.empty()) {
            response.status = 500;
            return;
        }
        if (!processDouYin(body, insertStmt, q)) {
            response.status = 500;
            return;
        }
    });
    server.Get("/api/toutiao", [&insertStmt,
            &toutiaoCookie](const httplib::Request &request,
                            httplib::Response &response) {
        response.set_header("Access-Control-Allow-Origin", "*");
        if (toutiaoCookie.empty()) {
            response.status = 404;
            return;
        }
        auto q = request.get_param_value("q");
        auto action = request.get_param_value("action");
        if (action == "1") {
            response.set_content(getToutiaoV1(q, toutiaoCookie), "text/plain");
            return;
        }
        auto body = getToutiao(q);
        if (body.empty()) {
            response.status = 500;
            return;
        }

        if (!processToutiao(body, insertStmt, q)) {
            response.status = 500;
            return;
        }
    });

    server.Get("/api/kuaishou",
               [&kuaishouCookie, &db1](const httplib::Request &request,
                                       httplib::Response &response) {
                   handleKuaishou(request, response, kuaishouCookie, db1);
               });
    server.Get("/api/xvideos",
               [&xvideosCookie, &db1](const httplib::Request &request,
                                      httplib::Response &response) {
                   handleXvideos(request, response, xvideosCookie, db1);
               });
    server.Get("/api/videos", [&videosDirectory](const httplib::Request &request,
                                                 httplib::Response &response) {
        response.set_header("Access-Control-Allow-Origin", "*");

        auto action = request.get_param_value("action");
        if (action == "1") {
            handleImage(request, response, videosDirectory);
        } else if (action == "2") {
            handleMp4(request, response);
        } else {
            handleListVideos(request, response, videosDirectory);
        }
    });
    server.Get("/api/video", [&db1](const httplib::Request &request,
                                    httplib::Response &response) {
        response.set_header("Access-Control-Allow-Origin", "*");
        handleUpdateVideo(request, response, db1);
    });
    server.Get("/api/note", [&db1](const httplib::Request &request,
                                   httplib::Response &response) {
        handleNote(request, response, db1);
    });
    server.Post("/api/note", [&db1](const httplib::Request &request,
                                    httplib::Response &response,
                                    const httplib::ContentReader &content_reader) {
        handleNote(request, response, content_reader, db1);
    });
    server.Options("/api/note", [](const httplib::Request &request,
                                   httplib::Response &response) {
        response.set_header("Access-Control-Allow-Origin", "*");
        response.set_header("Access-Control-Allow-Headers", "*");
    });
    server.Post("/post", [](const httplib::Request &req, httplib::Response &res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        auto image_file = req.get_file_value("file");
        {
            std::ofstream ofs("/storage/emulated/0/Download/" + image_file.filename,
                              std::ios::binary);
            ofs << image_file.content;
        }
        res.set_content("done", "text/plain");
    });
    server.Get("/api/cmd", [&db1](const httplib::Request &request,
                                  httplib::Response &response) {
        response.set_header("Access-Control-Allow-Origin", "*");
        auto cmd = httplib::detail::decode_url(request.get_param_value("q"), true);
        std::stringbuf buff;
        std::ostream out{&buff};

        RunCommand(cmd, &out, nullptr);
        std::ostringstream ss;
        ss << out.rdbuf();
        response.set_content(ss.str(), "text/plain");
    });
    server.Get("/api/boost", [](const httplib::Request &req, httplib::Response &res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        std::list<std::string> l{"com.android.camera",
                                 "com.tencent.soter.soterserver",
                                 "com.tencent.mm",
                                 "com.eg.android.AlipayGphone",
                                 "com.ss.android.ugc.trill",
                                 "com.miui.securitycenter",
                                 "com.miui.securityadd",
                                 "org.telegram.messenger",
                                 "com.smile.gifmaker",
                                 "com.lbe.security.miui",
                                 "com.miui.securitycenter.remote",
                                 "com.miui.securitycore.remote"};
        for (auto const &n: l) {
            system(("su -c am force-stop " + n).c_str());
        }
        res.set_content("OK", "text/plain");
    });
    server.Get("/api/news", [](const httplib::Request &req, httplib::Response &res) {
        res.set_header("Access-Control-Allow-Origin", "*");

        auto from = req.get_param_value("from");
        if (from.empty()) {
            from = "0";
        }
        auto size = req.get_param_value("size");
        if (size.empty()) {
            size = "50";
        }
        res.set_content(GetNewsFeed(from, size), "application/json");
    });
    server.listen(host, port);
    return false;
}
