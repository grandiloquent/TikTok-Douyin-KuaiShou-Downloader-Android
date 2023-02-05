//
// Created by roy on 2021/9/25.
//

#ifndef DATABASE_DEFINITIONS_H_
#define DATABASE_DEFINITIONS_H_

#ifdef _MSC_VER
#  define FORCEINLINE  __forceinline                                //MSVC
#elif defined __GNUC__
#  define FORCEINLINE  __inline__ __attribute__((always_inline))    //Linux/AppOS X
#else
#  define FORCEINLINE  inline                                       //no match
#endif

#define SAFE_DELETE_PTR(PTR)    do { if (PTR) { delete  (PTR);  (PTR) = nullptr; } } while(0)
#define SAFE_DELETE_BUF(BUF)    do { if (BUF) { delete[](BUF);  (BUF) = nullptr; } } while(0)


#define SQL_CREATE_TABLE "create table if not exists video\r\n (\r\n _id          INTEGER PRIMARY KEY AUTOINCREMENT,\r\n title        TEXT,\r\n         url          TEXT,\r\n play         TEXT,\r\n        music_play   TEXT,\r\n music_title  TEXT,\r\n         music_author TEXT,\r\n cover        TEXT,\r\n  video_type INTEGER,\r\n create_at    INTEGER,\r\n         update_at    INTEGER\r\n )"







#endif//DATABASE_DEFINITIONS_H_
