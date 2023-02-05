#ifndef TWITTER_H
#define TWITTER_H
/*
#include "handlers/twitter.h"
*/

#include "../shared.h"
#include "../database.h"

void
handleTwitter(const httplib::Request &request, httplib::Response &response, kp::database &db);



#endif
