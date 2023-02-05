#ifndef SHARED_H
#define SHARED_H
/*
#include "shared.h"
*/
#include <jni.h>
#include <nlohmann/json.hpp>
#include <filesystem>
#include <android/log.h>
#include "httplib.h"
#include "sqlite3.h"
#include "java_interop.h"

#define LOGI(...) \
  ((void)__android_log_print(ANDROID_LOG_INFO, "B5aOx2::", __VA_ARGS__))
#define LOGE(...) \
  ((void)__android_log_print(ANDROID_LOG_ERROR, "B5aOx2::", __VA_ARGS__))

#define WRITE_LOG(s, ...) do { \
FILE *f = fopen("/data/local/tmp/log.txt", "a+"); \
  fprintf(f, s, __VA_ARGS__); \
  fflush(f); \
  fclose(f); \
} while (0)

inline unsigned fromHex(char c) {
    if (c >= '0' && c <= '9') return (c - '0');
    if (c >= 'A' && c <= 'F') return (c - 'A' + 10);
    throw std::runtime_error("Incorrect character after % sign");
}

std::string decodeString(const std::string &s);
std::string encode_url(const std::string &s);
std::string readPreference(JNIEnv *env, jobject context, jmethodID getString, const char *key);
std::string substring(const std::string &s, const std::string &start, const std::string &end);
std::string getDirectory(JNIEnv *env, jobject context);
long long getUnixTimeStamp();
bool fileExists(const std::string &filename);

#endif
