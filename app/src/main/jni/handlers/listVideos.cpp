
#include "listVideos.h"

/*
handlers/listVideos.cpp
*/

void
handleListVideos(const httplib::Request &request, httplib::Response &response,std::string &directory) {
    const std::__fs::filesystem::path sandbox{directory  };
    nlohmann::json j = nlohmann::json::array();

    for (auto const &dir_entry: std::__fs::filesystem::directory_iterator{sandbox}) {
        if (dir_entry.is_regular_file()) {
            auto extension = dir_entry.path().extension().string();
            if (extension == ".mp4" || extension == ".mp3") {
                j.push_back({
                                    {
                                            "path", dir_entry.path()
                                    },
                                    {
                                            "update_at",
                                                    std::chrono::duration_cast<std::chrono::seconds>(
                                                            dir_entry.last_write_time().time_since_epoch()).count()
                                    }
                            });
            }
        }
    }
    response.set_content(j.dump(), "application/json");
}

