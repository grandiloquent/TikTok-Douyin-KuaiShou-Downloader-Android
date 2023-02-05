
#ifndef KUAISHOU_H
#define KUAISHOU_H
/*
#include "handlers/kuaishou.h"
*/

#include "../shared.h"
#include "../database.h"

void
handleKuaishou(const httplib::Request &request, httplib::Response &response, const std::string &cookie,kp::database& db);

#endif

