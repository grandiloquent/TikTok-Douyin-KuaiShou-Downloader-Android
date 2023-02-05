
#ifndef TIKTOK_H
#define TIKTOK_H
/*
#include "handlers/tiktok.h"
*/

#include "../database.h"
#include "../shared.h"


void handleTiktok(const httplib::Request &request, httplib::Response &response,
                  kp::database &db);

void handleListVideos(const httplib::Request &request,
                      httplib::Response &response, kp::database &db);
void handleQueryVideo(const httplib::Request &request,
                      httplib::Response &response, kp::database &db);
void handleDeleteVideo(const httplib::Request &request,
                       httplib::Response &response, kp::database &db);
void handleUpdateVideo(const httplib::Request &request,
                      httplib::Response &response, kp::database &db);
#endif
