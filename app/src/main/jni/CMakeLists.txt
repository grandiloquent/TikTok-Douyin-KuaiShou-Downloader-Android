cmake_minimum_required(VERSION 3.10.2)
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wall")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++2a -fno-rtti -fexceptions -Wall")

set(distribution_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../../../../distribution)


# ${ANDROID_ABI}

add_library(lib_crypto SHARED IMPORTED)
set_target_properties(lib_crypto PROPERTIES IMPORTED_LOCATION
        ${distribution_DIR}/openssl/lib/arm64-v8a/libcrypto.so)
add_library(lib_ssl SHARED IMPORTED)
set_target_properties(lib_ssl PROPERTIES IMPORTED_LOCATION
        ${distribution_DIR}/openssl/lib/arm64-v8a/libssl.so)

add_library(nativelib SHARED
        nativelib.cpp
        shared.cpp
        logging.cpp
        handlers/twitter.cpp
        handlers/mp4.cpp
        handlers/image.cpp
        handlers/listVideos.cpp
        handlers/tiktok.cpp
        database.cpp
        handlers/kuaishou.cpp
        handlers/note.cpp
        handlers/xvideos.cpp
        )
add_library(qrcode SHARED qrcode.c)


add_library(httplib SHARED httplib.cc)
target_include_directories(httplib PUBLIC
        ${distribution_DIR}/openssl/include/)
target_compile_definitions(httplib PUBLIC CPPHTTPLIB_OPENSSL_SUPPORT)
target_link_libraries(httplib
        lib_crypto
        lib_ssl)

add_subdirectory(ArduinoJson)
add_library(sqlite3 SHARED sqlite3.c)

add_subdirectory(nlohmann_json)
target_link_libraries(nativelib
        qrcode
        android
        ArduinoJson
        lib_crypto
        lib_ssl
        httplib
        nlohmann_json::nlohmann_json
        sqlite3
        log)
