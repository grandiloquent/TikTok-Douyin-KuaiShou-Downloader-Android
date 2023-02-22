#ifndef DATABASE_H
#define DATABASE_H

#include "sqlite3.h"
#include <functional>
#include <string>

namespace kp {
    class noncopyable {
    protected:
        noncopyable() = default;

        ~noncopyable() = default;

        noncopyable(noncopyable &&) = default;

        noncopyable &operator=(noncopyable &&) = default;

        noncopyable(noncopyable const &) = delete;

        noncopyable &operator=(noncopyable const &) = delete;
    };

    class database : noncopyable {
    public:
        explicit database(std::string &directory);

        std::string
        insertVideo(const std::function<std::string(sqlite3_stmt *)> &handler);

        std::string
        listVideos(bool desc,
                   const std::function<std::string(sqlite3_stmt *)> &handler);

        std::string
        queryVideo(const std::function<std::string(sqlite3_stmt *)> &handler);

        std::string
        deleteVideo(const std::function<std::string(sqlite3_stmt *)> &handler);

        std::string
        updateVideo(const std::function<std::string(sqlite3_stmt *)> &handler);

        std::string
        listNotes(const std::function<std::string(sqlite3_stmt *)> &handler);

        std::string
        searchNotes(const std::string &words);

        std::string
        insertNote(const std::function<std::string(sqlite3_stmt *)> &handler);

        std::string
        listNoteTags(const std::function<std::string(sqlite3_stmt *)> &handler);

        sqlite3 *getNoteDatabase();

    private:
        sqlite3 *video{};
        sqlite3 *note{};
        sqlite3_stmt *insertVideoStmt = nullptr;
        sqlite3_stmt *listVideosDescStmt = nullptr;
        sqlite3_stmt *listVideosAscStmt = nullptr;
        sqlite3_stmt *queryVideoStmt = nullptr;
        sqlite3_stmt *deleteVideoStmt = nullptr;
        sqlite3_stmt *updateVideoStmt = nullptr;
        sqlite3_stmt *listNotesStmt = nullptr;
        sqlite3_stmt *searchNotesStmt = nullptr;
        sqlite3_stmt *insertNoteStmt = nullptr;
        sqlite3_stmt *listNoteTagsStmt = nullptr;
    };

} // namespace kp

#endif
