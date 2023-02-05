
#include "note.h"

/*
handlers/note.cpp
*/


static int queryId(sqlite3 *db, const char *zSql, std::string &value) {
    sqlite3_stmt *stmt;
    int result = 0;
    // https://www.sqlite.org/c3ref/prepare.html
    int ret = sqlite3_prepare_v2(db, zSql, -1, &stmt, nullptr);
    if (ret != SQLITE_OK) {
        return result;
    }
    // https://www.sqlite.org/c3ref/bind_blob.html
    ret = sqlite3_bind_text(stmt, 1, value.c_str(), -1, SQLITE_TRANSIENT);
    if (ret != SQLITE_OK) {
        goto end;
    }
    ret = sqlite3_step(stmt);
    if (ret == SQLITE_ROW) {
        result = sqlite3_column_int(stmt, 0);
    }
    end:
    // https://www.sqlite.org/c3ref/finalize.html
    ret = sqlite3_finalize(stmt);
    if (ret != SQLITE_OK) {
        return result;
    }
    return result;
}

static int queryTagId(sqlite3 *db, std::string &tag) {
    return queryId(db, "select _id from tag where name=?", tag);
}

static int insertTag(sqlite3 *db, std::string &tag) {
    sqlite3_stmt *stmt;
    int result = 0;
    // https://www.sqlite.org/c3ref/prepare.html
    int ret = sqlite3_prepare_v2(db, "insert into tag (name) values (?)", -1, &stmt, nullptr);
    if (ret != SQLITE_OK) {
        return result;
    }
    // https://www.sqlite.org/c3ref/bind_blob.html
    ret = sqlite3_bind_text(stmt, 1, tag.c_str(), -1, SQLITE_TRANSIENT);
    if (ret != SQLITE_OK) {
        goto end;
    }
    ret = sqlite3_step(stmt);
    if (ret != SQLITE_DONE) {
        goto end;
    }
    result = sqlite3_last_insert_rowid(db);
    end:
    // https://www.sqlite.org/c3ref/finalize.html
    ret = sqlite3_finalize(stmt);
    if (ret != SQLITE_OK) {
        return result;
    }
    return result;
}

static int insertNote(sqlite3 *db, std::string &title, std::string &content) {
    auto seconds = getUnixTimeStamp();
    sqlite3_stmt *stmt;
    int result = 0;
    // https://www.sqlite.org/c3ref/prepare.html
    int ret = sqlite3_prepare_v2(db,
                                 "insert into notes (title,content,create_at,update_at) values (?,?,?,?)",
                                 -1, &stmt, nullptr);
    if (ret != SQLITE_OK) {
        return result;
    }
    // https://www.sqlite.org/c3ref/bind_blob.html
    ret = sqlite3_bind_text(stmt, 1, title.c_str(), -1, SQLITE_TRANSIENT);
    if (ret != SQLITE_OK) {
        goto end;
    }
    ret = sqlite3_bind_text(stmt, 2, content.c_str(), -1, SQLITE_TRANSIENT);
    if (ret != SQLITE_OK) {
        goto end;
    }
    ret = sqlite3_bind_int64(stmt, 3, seconds);
    if (ret != SQLITE_OK) {
        goto end;
    }
    ret = sqlite3_bind_int64(stmt, 4, seconds);
    if (ret != SQLITE_OK) {
        goto end;
    }
    ret = sqlite3_step(stmt);
    if (ret != SQLITE_DONE) {
        goto end;
    }
    result = sqlite3_last_insert_rowid(db);
    end:
    // https://www.sqlite.org/c3ref/finalize.html
    ret = sqlite3_finalize(stmt);
    if (ret != SQLITE_OK) {
        return result;
    }
    return result;
}

static int updateNote(sqlite3 *db, int id, std::string &title, std::string &content) {
    auto seconds = getUnixTimeStamp();
    sqlite3_stmt *stmt;
    int result = 0;
    // https://www.sqlite.org/c3ref/prepare.html
    int ret = sqlite3_prepare_v2(db,
                                 R"(update notes set title=?,
    content=?,
    update_at = ?
    where _id=?)",
                                 -1, &stmt, nullptr);
    if (ret != SQLITE_OK) {
        return result;
    }
    // https://www.sqlite.org/c3ref/bind_blob.html
    ret = sqlite3_bind_text(stmt, 1, title.c_str(), -1, SQLITE_TRANSIENT);
    if (ret != SQLITE_OK) {
        goto end;
    }
    ret = sqlite3_bind_text(stmt, 2, content.c_str(), -1, SQLITE_TRANSIENT);
    if (ret != SQLITE_OK) {
        goto end;
    }
    ret = sqlite3_bind_int64(stmt, 3, seconds);
    if (ret != SQLITE_OK) {
        goto end;
    }
    ret = sqlite3_bind_int(stmt, 4, id);
    if (ret != SQLITE_OK) {
        goto end;
    }
    ret = sqlite3_step(stmt);
    if (ret != SQLITE_DONE) {
        goto end;
    }
    result = sqlite3_changes(db);
    end:
    // https://www.sqlite.org/c3ref/finalize.html
    ret = sqlite3_finalize(stmt);
    if (ret != SQLITE_OK) {
        return result;
    }
    return result;
}

static std::string queryNote(sqlite3 *db, std::string &id) {
    sqlite3_stmt *stmt;
    std::string result{};
    // https://www.sqlite.org/c3ref/prepare.html
    int ret = sqlite3_prepare_v2(db,
                                 R"(select title,content,update_at,name from notes
LEFT JOIN note_tag on note_tag.note_id=notes._id
LEFT JOIN tag on tag._id=note_tag.tag_id
where notes._id=?)",
                                 -1, &stmt, nullptr);
    if (ret != SQLITE_OK) {
        return {};
    }
    // https://www.sqlite.org/c3ref/bind_blob.html
    ret = sqlite3_bind_text(stmt, 1, id.c_str(), -1, SQLITE_TRANSIENT);
    if (ret != SQLITE_OK) {
        goto end;
    }

    ret = sqlite3_step(stmt);
    if (ret == SQLITE_ROW) {
        auto tag = sqlite3_column_text(stmt, 3);
        nlohmann::json d = {
                {"title",     reinterpret_cast<const char *>(sqlite3_column_text(stmt, 0))},
                {"content",   reinterpret_cast<const char *>(sqlite3_column_text(stmt, 1))},
                {"update_at", sqlite3_column_int64(stmt, 2)},
                {"tag",       tag == nullptr ? "" : reinterpret_cast<const char *>(tag)},
        };
        result = d.dump();
    }

    end:
    // https://www.sqlite.org/c3ref/finalize.html
    ret = sqlite3_finalize(stmt);
    if (ret != SQLITE_OK) {
        return {};
    }
    return result;
}

static int deleteNoteTag(sqlite3 *db, int id) {
    sqlite3_stmt *stmt;
    int result = 0;
    // https://www.sqlite.org/c3ref/prepare.html
    int ret = sqlite3_prepare_v2(db, "delete from note_tag where note_id=?", -1, &stmt, nullptr);
    if (ret != SQLITE_OK) {
        return result;
    }
    // https://www.sqlite.org/c3ref/bind_blob.html
    ret = sqlite3_bind_int(stmt, 1, id);
    if (ret != SQLITE_OK) {
        goto end;
    }
    ret = sqlite3_step(stmt);
    if (ret != SQLITE_DONE) {
        goto end;
    }
    result = sqlite3_changes(db);
    end:
    // https://www.sqlite.org/c3ref/finalize.html
    ret = sqlite3_finalize(stmt);
    if (ret != SQLITE_OK) {
        return result;
    }
    return result;
}

static int insertNoteTag(sqlite3 *db, int noteId, int tagId) {
    sqlite3_stmt *stmt;
    int result = 0;
    // https://www.sqlite.org/c3ref/prepare.html
    int ret = sqlite3_prepare_v2(db,
                                 "insert into note_tag(note_id,tag_id)values(?,?)",
                                 -1, &stmt, nullptr);
    if (ret != SQLITE_OK) {
        return result;
    }
    // https://www.sqlite.org/c3ref/bind_blob.html
    ret = sqlite3_bind_int(stmt, 1, noteId);
    if (ret != SQLITE_OK) {
        goto end;
    }
    ret = sqlite3_bind_int(stmt, 2, tagId);
    if (ret != SQLITE_OK) {
        goto end;
    }
    ret = sqlite3_step(stmt);
    if (ret != SQLITE_DONE) {
        goto end;
    }
    result = sqlite3_last_insert_rowid(db);
    end:
    // https://www.sqlite.org/c3ref/finalize.html
    ret = sqlite3_finalize(stmt);
    if (ret != SQLITE_OK) {
        return result;
    }
    return result;
}


static std::string bindStmt(const std::string &body, std::string &q,
                            sqlite3_stmt *stmt) {
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
    sqlite3_bind_text(stmt, 4, "", -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 5, "", -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 6, "", -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 7, cover.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_int(stmt, 8, 2);
    sqlite3_bind_int64(stmt, 9, seconds);
    sqlite3_bind_int64(stmt, 10, seconds);
    return {};
}

void handleNote(const httplib::Request &request, httplib::Response &response,
                kp::database &db) {
    response.set_header("Access-Control-Allow-Origin", "*");

    auto action = request.get_param_value("action");
    if (action.empty()) {
        auto tag = httplib::detail::decode_url(request.get_param_value("tag"), true);
        auto ret = db.listNotes([&tag](sqlite3_stmt *stmt) {
            // https://www.sqlite.org/c3ref/reset.html
            sqlite3_reset(stmt);
            // https://www.sqlite.org/c3ref/bind_blob.html
            // https://www.sqlite.org/rescode.html
            int code = sqlite3_bind_text(stmt, 1, tag.c_str(), -1, SQLITE_TRANSIENT);
            if (code != SQLITE_OK) {
                return std::string{sqlite3_errstr(code)};
            }
            return std::string{};
        });

        response.set_content(ret, "application/json");
    } else if (action == "1") {
        auto id = request.get_param_value("id");
        auto ret = queryNote(db.getNoteDatabase(), id);
        response.set_content(ret, "application/json");
    } else if (action == "2") {
        auto ret = db.listNoteTags(nullptr);
        response.set_content(ret, "application/json");
    }

}

void handleNote(const httplib::Request &request, httplib::Response &response,
                const httplib::ContentReader &content_reader,
                kp::database &db) {
    response.set_header("Access-Control-Allow-Origin", "*");
    std::string body;
    content_reader([&](const char *data, size_t data_length) {
        body.append(data, data_length);
        return true;
    });
    nlohmann::json js = nlohmann::json::parse(body);
    auto title = js["title"].get<std::string>();
    auto content = js["content"].get<std::string>();
    auto tag = js["tag"].get<std::string>();
    auto tagId = queryTagId(db.getNoteDatabase(), tag);
    if (tagId == 0) {
        tagId = insertTag(db.getNoteDatabase(), tag);
    }

    if (js.contains("_id")) {
        auto id = js["_id"].get<int>();
        updateNote(db.getNoteDatabase(),
                   id,
                   title, content);
        deleteNoteTag(db.getNoteDatabase(), id);
        insertNoteTag(db.getNoteDatabase(), id, tagId);
    } else {
        auto ret = insertNote(db.getNoteDatabase(), title, content);
        nlohmann::json d = {
                {"id", ret}
        };
        insertNoteTag(db.getNoteDatabase(), ret, tagId);
        response.set_content(d.dump(), "application/json");
    }

}

