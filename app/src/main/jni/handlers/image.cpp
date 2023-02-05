
#include "image.h"

/*
handlers/image.cpp
*/

void
handleImage(const httplib::Request &request, httplib::Response &response, std::string &directory) {
    auto q = request.get_param_value("q");

    auto path = directory + "/.images/" + q;
    if (!fileExists(path)) {
        response.status = 404;
        return;
    }
    std::shared_ptr<std::ifstream> fs = std::make_shared<std::ifstream>();

    fs->open(path, std::ios_base::binary);
    fs->seekg(0, std::ios_base::end);
    auto end = fs->tellg();
    if (end == 0)return;
    fs->seekg(0);
    std::map<std::string, std::string> file_extension_and_mimetype_map;
    response.set_content_provider(static_cast<size_t>(end),
                                  "image/*",
                                  [fs](uint64_t offset,
                                       uint64_t length,
                                       httplib::DataSink &sink) {
                                      if (fs->fail()) {
                                          return false;
                                      }

                                      fs->seekg(offset, std::ios_base::beg);

                                      size_t bufSize = 81920;
                                      char buffer[bufSize];

                                      fs->read(buffer, bufSize);

                                      sink.write(buffer,
                                                 static_cast<size_t>(fs->gcount()));
                                      return true;
                                  });
}

