
#ifndef NOTE_H
#define NOTE_H
/*
#include "handlers/note.h"
*/

#include "../shared.h"
#include "../database.h"

void
handleNote(const httplib::Request &request,
           httplib::Response &response,
           kp::database &db);

void
handleNote(const httplib::Request &request,
           httplib::Response &response,
           const httplib::ContentReader &content_reader,
           kp::database &db);

#endif

