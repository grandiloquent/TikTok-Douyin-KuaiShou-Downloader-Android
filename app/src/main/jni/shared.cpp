#include "shared.h"

std::string decodeString(const std::string &s) {
    std::string result;
    result.reserve(s.size());

    for (size_t i = 0; i < s.size(); i++) {
        if (s[i] == '\\' && i + 5 < s.size() && s[i + 1] == 'u') {

            unsigned int h1 = fromHex(s[i + 2]);
            unsigned int h2 = fromHex(s[i + 3]);
            unsigned int h3 = fromHex(s[i + 4]);
            unsigned int h4 = fromHex(s[i + 5]);
            if ((h1 | h2 | h3 | h4) != 0xFF) {   // valid 4 hex chars
                char ch = (char) ((h1 << 12) | (h2 << 8) | (h3 << 4) | h4);
                i += 5;
                result += ch;
                continue;
            }
        } else {
            result += s[i];
        }
    }

    return result;
}

std::string encode_url(const std::string &s) {
    std::string result;
    result.reserve(s.size());

    for (size_t i = 0; s[i]; i++) {
        switch (s[i]) {
            case ' ':
                result += "%20";
                break;
            case '+':
                result += "%2B";
                break;
            case '\r':
                result += "%0D";
                break;
            case '\n':
                result += "%0A";
                break;
            case '\'':
                result += "%27";
                break;
            case ',':
                result += "%2C";
                break;
                // case ':': result += "%3A"; break; // ok? probably...
            case ';':
                result += "%3B";
                break;
            default:
                auto c = static_cast<uint8_t>(s[i]);
                if (c >= 0x80) {
                    result += '%';
                    char hex[4];
                    auto len = snprintf(hex, sizeof(hex) - 1, "%02X", c);
                    assert(len == 2);
                    result.append(hex, static_cast<size_t>(len));
                } else {
                    result += s[i];
                }
                break;
        }
    }

    return result;
}

std::string readPreference(JNIEnv *env, jobject context, jmethodID getString, const char *key) {
    jstring jKey = env->NewStringUTF(key);
    auto jValue = env->CallObjectMethod(context, getString,
                                        jKey);
    const char *cValue = env->GetStringUTFChars(static_cast<jstring>(jValue),
                                                nullptr);
    std::string value(cValue);
    env->ReleaseStringUTFChars(static_cast<jstring>(jValue), cValue);
    return value;
}

std::string substring(const std::string &s, const std::string &start, const std::string &end) {
    auto startPos = s.find(start);
    if (startPos == std::string::npos) {
        return s;
    }
    auto length = start.length();
    auto endPos = s.find(end, startPos + length);
    if (endPos == std::string::npos) {
        return s;
    }
    return s.substr(startPos + length, endPos - (startPos + length));
}

std::string getDirectory(JNIEnv *env, jobject context) {
    jclass clazz = env->GetObjectClass(context);
    jmethodID getString = env->GetMethodID(clazz,
                                           "getString",
                                           "(Ljava/lang/String;)Ljava/lang/String;");
    jstring key_directory = env->NewStringUTF("key_directory");
    auto j_directory = env->CallObjectMethod(context, getString,
                                             key_directory);

    const char *directory = env->GetStringUTFChars(static_cast<jstring>(j_directory), nullptr);
    std::string ret(directory);
    env->ReleaseStringUTFChars(static_cast<jstring>(j_directory), directory);
    return ret;
}

long long getUnixTimeStamp() {
    const auto p1 = std::chrono::system_clock::now();
    return std::chrono::duration_cast<std::chrono::seconds>(
            p1.time_since_epoch()).count();
}

bool fileExists(const std::string &filename) {
    struct stat buffer;
    return stat(filename.c_str(), &buffer) == 0;
}