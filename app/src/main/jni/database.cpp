
#include "database.h"
#include "shared.h"

kp::database::database(std::string &directory) {
    int ret = sqlite3_open((directory + "/videos.db").c_str(), &video);
    if (ret != SQLITE_OK) {
        // sqlite3_errmsg
    }
    sqlite3_exec(video,
                 "create table if not exists video\r\n (\r\n _id          INTEGER PRIMARY KEY AUTOINCREMENT,\r\n title        TEXT,\r\n         url          TEXT,\r\n play         TEXT,\r\n        music_play   TEXT,\r\n music_title  TEXT,\r\n         music_author TEXT,\r\n cover        TEXT,\r\n  video_type INTEGER,\r\n create_at    INTEGER,\r\n         update_at    INTEGER\r\n )",
                 nullptr, nullptr, nullptr);
    // https://www.sqlite.org/capi3ref.html#sqlite3_open
    ret = sqlite3_open((directory + "/notes.db").c_str(), &note);
    if (ret != SQLITE_OK) {
        // sqlite3_errmsg
    }
    //sqlite3_exec(note,"delete from tag where name=\"|After Effects\"",nullptr, nullptr, nullptr);
    sqlite3_exec(note,R"(DELETE from tag where _id in (select t._id FROM tag t
left join note_tag nt on nt.tag_id =t._id
left join notes n on n._id=nt.note_id
group by n._id
HAVING (count(n._id)==0));)", nullptr, nullptr, nullptr);
}

std::string kp::database::insertVideo(
        const std::function<std::string(sqlite3_stmt *)> &handler) {
    if (insertVideoStmt == nullptr) {
        // https://www.sqlite.org/capi3ref.html#sqlite3_prepare
        sqlite3_prepare_v2(
                video,
                "insert into video (title, url, play, music_play, music_title, "
                "music_author, cover, video_type, create_at, update_at) VALUES (?, ?, "
                "?, ?, ?, ?, ?, ?, ?,?)",
                -1, &insertVideoStmt, nullptr);
    }
    sqlite3_reset(insertVideoStmt);
    auto ret = handler(insertVideoStmt);
    if (!ret.empty()) {
        return ret;
    }
    return {};
}

std::string kp::database::listVideos(
        bool desc, const std::function<std::string(sqlite3_stmt *)> &handler) {
    if (listVideosDescStmt == nullptr) {
        sqlite3_prepare_v2(
                video,
                "select _id,title,cover,update_at from video where video_type = ? "
                "order by update_at desc limit ? offset ?",
                -1, &listVideosDescStmt, nullptr);
    }
    if (listVideosAscStmt == nullptr) {
        sqlite3_prepare_v2(video,
                           "select _id,title,cover,update_at from video where "
                           "video_type = ? order by create_at limit ? offset ?",
                           -1, &listVideosAscStmt, nullptr);
    }
    sqlite3_stmt *stmt;
    if (desc) {
        handler(listVideosDescStmt);
        stmt = listVideosDescStmt;
    } else {
        handler(listVideosAscStmt);
        stmt = listVideosAscStmt;
    }
    nlohmann::json doc = nlohmann::json::array();

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        nlohmann::json j = {

                {"_id",       sqlite3_column_int(stmt, 0)},
                {"title",     reinterpret_cast<const char *>(sqlite3_column_text(stmt, 1))},
                {"cover",     reinterpret_cast<const char *>(sqlite3_column_text(stmt, 2))},
                {"update_at", sqlite3_column_int(stmt, 3)}};
        doc.push_back(j);
    }
    return doc.dump();
}

std::string kp::database::queryVideo(
        const std::function<std::string(sqlite3_stmt *)> &handler) {
    if (queryVideoStmt == nullptr) {
        sqlite3_prepare_v2(video,
                           "select title,url, play, music_play,video_type from "
                           "video where _id = ?",
                           -1, &queryVideoStmt, nullptr);
    }
    handler(queryVideoStmt);
    int ret = sqlite3_step(queryVideoStmt);
    if (ret == SQLITE_ROW) {
        nlohmann::json j = {
                {"title",      reinterpret_cast<const char *>(
                                       sqlite3_column_text(queryVideoStmt, 0))},
                {"url",        reinterpret_cast<const char *>(
                                       sqlite3_column_text(queryVideoStmt, 1))},
                {"play",       reinterpret_cast<const char *>(
                                       sqlite3_column_text(queryVideoStmt, 2))},
                {"music_play", reinterpret_cast<const char *>(
                                       sqlite3_column_text(queryVideoStmt, 3))},
                {"video_type", reinterpret_cast<const char *>(
                                       sqlite3_column_text(queryVideoStmt, 4))}};
        return j.dump();
    }
    return {};
}

std::string kp::database::deleteVideo(
        const std::function<std::string(sqlite3_stmt *)> &handler) {
    if (deleteVideoStmt == nullptr) {
        // https://www.sqlite.org/c3ref/prepare.html
        // The preferred routine to use is sqlite3_prepare_v2().
        int ret = sqlite3_prepare_v2(video, "delete from video where _id = ?", -1,
                                     &deleteVideoStmt, nullptr);
        if (ret == SQLITE_OK) {
        }
    }
    handler(deleteVideoStmt);
// https://www.sqlite.org/c3ref/step.html
// The SQLITE_ROW result code returned by sqlite3_step() indicates that another row of output is available.
// The SQLITE_DONE result code indicates that an operation has completed.
    int ret = sqlite3_step(deleteVideoStmt);
    LOGE("%d", ret);
    return {};
}

std::string kp::database::updateVideo(
        const std::function<std::string(sqlite3_stmt *)> &handler) {
    if (updateVideoStmt == nullptr) {
        sqlite3_prepare_v2(
                video, "update video set video_type = ?, update_at = ? where _id = ?",
                -1, &updateVideoStmt, nullptr);
    }
    handler(updateVideoStmt);
    int ret = sqlite3_step(updateVideoStmt);
    if (ret == SQLITE_ROW) {
        nlohmann::json j = {
                {"title",      reinterpret_cast<const char *>(
                                       sqlite3_column_text(updateVideoStmt, 0))},
                {"url",        reinterpret_cast<const char *>(
                                       sqlite3_column_text(updateVideoStmt, 1))},
                {"play",       reinterpret_cast<const char *>(
                                       sqlite3_column_text(updateVideoStmt, 2))},
                {"music_play", reinterpret_cast<const char *>(
                                       sqlite3_column_text(updateVideoStmt, 3))},
                {"video_type", reinterpret_cast<const char *>(
                                       sqlite3_column_text(updateVideoStmt, 4))}};
        return j.dump();
    }
    return {};
}

std::string kp::database::listNotes(
        const std::function<std::string(sqlite3_stmt *)> &handler) {
    if (listNotesStmt == nullptr) {
        sqlite3_prepare_v2(
                note,
                "select notes._id,notes.title,notes.update_at from notes "
                "JOIN note_tag on note_tag.note_id=notes._id "
                "JOIN tag on tag._id=note_tag.tag_id "
                "where tag.name= ? or tag.name is null order by notes.update_at desc",
                -1, &listNotesStmt, nullptr);
    }
    auto ret = handler(listNotesStmt);
    if (!ret.empty()) {
        nlohmann::json err = {{"error", ret}};
        return err.dump();
    }
    nlohmann::json doc = nlohmann::json::array();
    while (sqlite3_step(listNotesStmt) == SQLITE_ROW) {
        nlohmann::json j = {{"id",        sqlite3_column_int(listNotesStmt, 0)},
                            {"title",     reinterpret_cast<const char *>(
                                                  sqlite3_column_text(listNotesStmt, 1))},
                            {"update_at", sqlite3_column_int64(listNotesStmt, 2)}};
        doc.push_back(j);
    }
    return doc.dump();
}

std::string kp::database::searchNotes(
        const std::string &words,int mode) {
    if (searchNotesStmt == nullptr) {
        sqlite3_prepare_v2(
                note,
                "select notes._id,notes.title,notes.update_at,notes.content,tag.name from notes "
                "JOIN note_tag on note_tag.note_id=notes._id "
                "JOIN tag on tag._id=note_tag.tag_id "
                "order by notes.update_at desc",
                -1, &searchNotesStmt, nullptr);
    }
    std::regex reg(words);
    std::smatch base_match;
    nlohmann::json doc = nlohmann::json::array();
    while (sqlite3_step(searchNotesStmt) == SQLITE_ROW) {
        auto title = reinterpret_cast<const char *>(
                sqlite3_column_text(searchNotesStmt, 1));
        auto content = reinterpret_cast<const char *>(
                sqlite3_column_text(searchNotesStmt, 3));
        auto matched=mode==1?std::regex_search(std::string{title},
                                               base_match, reg):
                     std::regex_search(std::string{title},
                                       base_match, reg) || std::regex_search(std::string{content},
                                                                             base_match, reg);
        if (matched ) {
            nlohmann::json j = {{"id",        sqlite3_column_int(searchNotesStmt, 0)},
                                {"title",     title},
                                {"update_at", sqlite3_column_int64(searchNotesStmt, 2)},
                                {"tag",      reinterpret_cast<const char *>(
                                                     sqlite3_column_text(searchNotesStmt, 4))}
        };
        doc.push_back(j);
    }

}

return doc.

dump();

}

std::string kp::database::insertNote(
        const std::function<std::string(sqlite3_stmt *)> &handler) {
    if (insertNoteStmt == nullptr) {
        // https://www.sqlite.org/capi3ref.html#sqlite3_prepare
        sqlite3_prepare_v2(
                note,
                "insert into note (title, content, create_at, update_at) VALUES (?, ?, ?,?)",
                -1, &insertNoteStmt, nullptr);
    }

    sqlite3_reset(insertNoteStmt);
    auto ret = handler(insertNoteStmt);
    if (!ret.empty()) {
        return ret;
    }
    return {};
}

std::string
kp::database::listNoteTags(const std::function<std::string(sqlite3_stmt *)> &handler) {
    if (listNoteTagsStmt == nullptr) {
        sqlite3_prepare_v2(
                note,
                "select * from tag",
                -1, &listNoteTagsStmt, nullptr);
    }
    nlohmann::json doc = nlohmann::json::array();
    while (sqlite3_step(listNoteTagsStmt) == SQLITE_ROW) {
        nlohmann::json j = {{"id",    sqlite3_column_int(listNoteTagsStmt, 0)},
                            {"title", reinterpret_cast<const char *>(
                                              sqlite3_column_text(listNoteTagsStmt, 1))}
        };
        doc.push_back(j);
    }
    return doc.dump();
}

sqlite3 *kp::database::getNoteDatabase() {
    return note;
}
