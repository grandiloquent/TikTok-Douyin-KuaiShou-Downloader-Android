(() => {
    const strings = `const char *title = doc["data"]["title"];
    const char *hdplay = doc["data"]["hdplay"];
    const char *music_play = doc["data"]["music_info"]["play"];
    const char *music_title = doc["data"]["music_info"]["title"];
    const char *music_author = doc["data"]["music_info"]["author"];
    const char *cover = doc["data"]["cover"];`;
    console.log([...strings.matchAll(/(?<=\*)[a-z_]+(?= \=)/g)]
        .map(x => `${x} = %s,\\n `).join('').replace("\\\\", "\\"))
    console.log([...strings.matchAll(/(?<=\*)[a-z_]+(?= \=)/g)]
        .map(x => x).join(','))
})();

(() => {
    const strings = `<< title
    << q.c_str()
    << hdplay
    << music_play
    << music_title
    << music_author
    << cover
    << 1
    << seconds
    << seconds`;

    console.log([...strings.matchAll(/(?<=<< )[a-z_0-9]+/g)]
        .map((x, v) => `sqlite3_bind_text(statement, ${v + 1}, ${x}, -1, SQLITE_TRANSIENT);`).join('\n'))
})();

(() => {
    const strings = `_id,title,url,play,music_play,music_title,music_author,cover,create_at,update_at`;
    console.log(strings.split(',')
        .map((x, v) => `obj["${x}"]=sqlite3_column_text(listVideos, ${v});`)
        .join('\n'));
})();
(() => {
    const strings = `_id,title,cover,update_at`;
    console.log(strings.split(',')
        .map((x, v) => `{"${x}",reinterpret_cast<const char*>(sqlite3_column_text(listVideos, ${v}))},`)
        .join('\n'));
})();

(() => {
    const strings = `_id,title,url,play,music_play,music_title,music_author,cover,create_at,update_at`;
    console.log(strings.split(',')
        .map((x, v) => `auto ${x} = sqlite3_column_text(listVideos, ${v});
        LOGI("%s\\n",${x});
        `)
        .join('\n'));
})();



(() => {
    const strings = `#01 pc 000000000009daf0  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libnativelib.so (offset 0x786000) (std::__ndk1::char_traits<char>::length(char const*)+20) (BuildId: 84b2da715c9941040aa62d15dc91bcbcff49f481)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #02 pc 0000000000091ecc  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libnativelib.so (offset 0x786000) (std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >::basic_string<std::nullptr_t>(char const*)+64) (BuildId: 84b2da715c9941040aa62d15dc91bcbcff49f481)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #03 pc 00000000000a1ed0  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libnativelib.so (offset 0x786000) (void std::__ndk1::allocator<std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> > >::construct<std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >, char const* const&>(std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >*, char const* const&)+52) (BuildId: 84b2da715c9941040aa62d15dc91bcbcff49f481)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #04 pc 00000000000a1e8c  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libnativelib.so (offset 0x786000) (void std::__ndk1::allocator_traits<std::__ndk1::allocator<std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> > > >::__construct<std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >, char const* const&>(std::__ndk1::integral_constant<bool, true>, std::__ndk1::allocator<std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> > >&, std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >*, char const* const&)+64) (BuildId: 84b2da715c9941040aa62d15dc91bcbcff49f481)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #05 pc 00000000000a1cb8  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libnativelib.so (offset 0x786000) (void std::__ndk1::allocator_traits<std::__ndk1::allocator<std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> > > >::construct<std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >, char const* const&>(std::__ndk1::allocator<std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> > >&, std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >*, char const* const&)+64) (BuildId: 84b2da715c9941040aa62d15dc91bcbcff49f481)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #06 pc 00000000000a1b68  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libnativelib.so (offset 0x786000) (std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >* nlohmann::json_abi_v3_11_2::basic_json<std::__ndk1::map, std::__ndk1::vector, std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >, bool, long, unsigned long, double, std::__ndk1::allocator, nlohmann::json_abi_v3_11_2::adl_serializer, std::__ndk1::vector<unsigned char, std::__ndk1::allocator<unsigned char> >, void>::create<std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >, char const* const&>(char const* const&)+112) (BuildId: 84b2da715c9941040aa62d15dc91bcbcff49f481)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #07 pc 00000000000a1ad0  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libnativelib.so (offset 0x786000) (void nlohmann::json_abi_v3_11_2::detail::external_constructor<(nlohmann::json_abi_v3_11_2::detail::value_t)3>::construct<nlohmann::json_abi_v3_11_2::basic_json<std::__ndk1::map, std::__ndk1::vector, std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >, bool, long, unsigned long, double, std::__ndk1::allocator, nlohmann::json_abi_v3_11_2::adl_serializer, std::__ndk1::vector<unsigned char, std::__ndk1::allocator<unsigned char> >, void>, char const*, 0>(nlohmann::json_abi_v3_11_2::basic_json<std::__ndk1::map, std::__ndk1::vector, std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >, bool, long, unsigned long, double, std::__ndk1::allocator, nlohmann::json_abi_v3_11_2::adl_serializer, std::__ndk1::vector<unsigned char, std::__ndk1::allocator<unsigned char> >, void>&, char const* const&)+56) (BuildId: 84b2da715c9941040aa62d15dc91bcbcff49f481)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #08 pc 00000000000a1a88  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libnativelib.so (offset 0x786000) (void nlohmann::json_abi_v3_11_2::detail::to_json<nlohmann::json_abi_v3_11_2::basic_json<std::__ndk1::map, std::__ndk1::vector, std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >, bool, long, unsigned long, double, std::__ndk1::allocator, nlohmann::json_abi_v3_11_2::adl_serializer, std::__ndk1::vector<unsigned char, std::__ndk1::allocator<unsigned char> >, void>, char const*, 0>(nlohmann::json_abi_v3_11_2::basic_json<std::__ndk1::map, std::__ndk1::vector, std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >, bool, long, unsigned long, double, std::__ndk1::allocator, nlohmann::json_abi_v3_11_2::adl_serializer, std::__ndk1::vector<unsigned char, std::__ndk1::allocator<unsigned char> >, void>&, char const* const&)+28) (BuildId: 84b2da715c9941040aa62d15dc91bcbcff49f481)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #09 pc 00000000000a1a5c  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libnativelib.so (offset 0x786000) (decltype((to_json(fp, std::forward<char const*>(fp0))) , ((void)())) nlohmann::json_abi_v3_11_2::detail::to_json_fn::operator()<nlohmann::json_abi_v3_11_2::basic_json<std::__ndk1::map, std::__ndk1::vector, std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >, bool, long, unsigned long, double, std::__ndk1::allocator, nlohmann::json_abi_v3_11_2::adl_serializer, std::__ndk1::vector<unsigned char, std::__ndk1::allocator<unsigned char> >, void>, char const*>(nlohmann::json_abi_v3_11_2::basic_json<std::__ndk1::map, std::__ndk1::vector, std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >, bool, long, unsigned long, double, std::__ndk1::allocator, nlohmann::json_abi_v3_11_2::adl_serializer, std::__ndk1::vector<unsigned char, std::__ndk1::allocator<unsigned char> >, void>&, char const*&&) const+48) (BuildId: 84b2da715c9941040aa62d15dc91bcbcff49f481)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #10 pc 00000000000a1a1c  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libnativelib.so (offset 0x786000) (decltype((nlohmann::json_abi_v3_11_2::(anonymous namespace)::to_json(fp, std::forward<char const*>(fp0))) , ((void)())) nlohmann::json_abi_v3_11_2::adl_serializer<char const*, void>::to_json<nlohmann::json_abi_v3_11_2::basic_json<std::__ndk1::map, std::__ndk1::vector, std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >, bool, long, unsigned long, double, std::__ndk1::allocator, nlohmann::json_abi_v3_11_2::adl_serializer, std::__ndk1::vector<unsigned char, std::__ndk1::allocator<unsigned char> >, void>, char const*>(nlohmann::json_abi_v3_11_2::basic_json<std::__ndk1::map, std::__ndk1::vector, std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >, bool, long, unsigned long, double, std::__ndk1::allocator, nlohmann::json_abi_v3_11_2::adl_serializer, std::__ndk1::vector<unsigned char, std::__ndk1::allocator<unsigned char> >, void>&, char const*&&)+52) (BuildId: 84b2da715c9941040aa62d15dc91bcbcff49f481)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #11 pc 00000000000a19c0  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libnativelib.so (offset 0x786000) (nlohmann::json_abi_v3_11_2::basic_json<std::__ndk1::map, std::__ndk1::vector, std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >, bool, long, unsigned long, double, std::__ndk1::allocator, nlohmann::json_abi_v3_11_2::adl_serializer, std::__ndk1::vector<unsigned char, std::__ndk1::allocator<unsigned char> >, void>::basic_json<char const*, char const*, 0>(char const*&&)+52) (BuildId: 84b2da715c9941040aa62d15dc91bcbcff49f481)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #12 pc 0000000000091f9c  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libnativelib.so (offset 0x786000) (nlohmann::json_abi_v3_11_2::detail::json_ref<nlohmann::json_abi_v3_11_2::basic_json<std::__ndk1::map, std::__ndk1::vector, std::__ndk1::basic_string<char, std::__ndk1::char_traits<char>, std::__ndk1::allocator<char> >, bool, long, unsigned long, double, std::__ndk1::allocator, nlohmann::json_abi_v3_11_2::adl_serializer, std::__ndk1::vector<unsigned char, std::__ndk1::allocator<unsigned char> >, void> >::json_ref<char const*, 0>(char const*&&)+44) (BuildId: 84b2da715c9941040aa62d15dc91bcbcff49f481)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #13 pc 0000000000092ab8  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libnativelib.so (offset 0x786000) (listVideos(httplib::Request const&, httplib::Response&, sqlite3_stmt*)+620) (BuildId: 84b2da715c9941040aa62d15dc91bcbcff49f481)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #14 pc 00000000000d50e8  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libnativelib.so (offset 0x786000) (BuildId: 84b2da715c9941040aa62d15dc91bcbcff49f481)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #15 pc 00000000000d4438  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libnativelib.so (offset 0x786000) (BuildId: 84b2da715c9941040aa62d15dc91bcbcff49f481)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #16 pc 00000000000d43c0  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libnativelib.so (offset 0x786000) (BuildId: 84b2da715c9941040aa62d15dc91bcbcff49f481)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #17 pc 00000000000d436c  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libnativelib.so (offset 0x786000) (BuildId: 84b2da715c9941040aa62d15dc91bcbcff49f481)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #18 pc 00000000000d33c4  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libnativelib.so (offset 0x786000) (BuildId: 84b2da715c9941040aa62d15dc91bcbcff49f481)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #19 pc 00000000001a3254  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #20 pc 000000000013b01c  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (std::__ndk1::function<void (httplib::Request const&, httplib::Response&)>::operator()(httplib::Request const&, httplib::Response&) const+64) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #21 pc 000000000013e430  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (httplib::Server::dispatch_request(httplib::Request&, httplib::Response&, std::__ndk1::vector<std::__ndk1::pair<std::__ndk1::basic_regex<char, std::__ndk1::regex_traits<char> >, std::__ndk1::function<void (httplib::Request const&, httplib::Response&)> >, std::__ndk1::allocator<std::__ndk1::pair<std::__ndk1::basic_regex<char, std::__ndk1::regex_traits<char> >, std::__ndk1::function<void (httplib::Request const&, httplib::Response&)> > > > const&)+172) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #22 pc 000000000013df28  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (httplib::Server::routing(httplib::Request&, httplib::Response&, httplib::Stream&)+1236) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #23 pc 000000000013f464  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (httplib::Server::process_request(httplib::Stream&, bool, bool&, std::__ndk1::function<void (httplib::Request&)> const&)+2632) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #24 pc 00000000001d1cd4  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.213 21702-21702 DEBUG                   pid-21702                            A        #25 pc 00000000001d1bf4  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.214 21702-21702 DEBUG                   pid-21702                            A        #26 pc 00000000001d1b08  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.214 21702-21702 DEBUG                   pid-21702                            A        #27 pc 0000000000140200  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.214 21702-21702 DEBUG                   pid-21702                            A        #28 pc 0000000000140144  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (httplib::Server::process_and_close_socket(int)+72) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.214 21702-21702 DEBUG                   pid-21702                            A        #29 pc 00000000001cbf30  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.214 21702-21702 DEBUG                   pid-21702                            A        #30 pc 00000000001cbee8  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.214 21702-21702 DEBUG                   pid-21702                            A        #31 pc 00000000001cbe9c  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.214 21702-21702 DEBUG                   pid-21702                            A        #32 pc 00000000001cbe74  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.214 21702-21702 DEBUG                   pid-21702                            A        #33 pc 00000000001cad50  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.214 21702-21702 DEBUG                   pid-21702                            A        #34 pc 0000000000197130  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.214 21702-21702 DEBUG                   pid-21702                            A        #35 pc 0000000000196c9c  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (std::__ndk1::function<void ()>::operator()() const+20) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.214 21702-21702 DEBUG                   pid-21702                            A        #36 pc 0000000000196998  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (httplib::ThreadPool::worker::operator()()+360) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.214 21702-21702 DEBUG                   pid-21702                            A        #37 pc 00000000001967e4  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.214 21702-21702 DEBUG                   pid-21702                            A        #38 pc 0000000000196744  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)
    2023-01-14 22:45:49.214 21702-21702 DEBUG                   pid-21702                            A        #39 pc 00000000001960ec  /data/app/~~_2VApbivRFEaGTHBZ3AzMQ==/cn.kpkpkp-CisWf448QtEwWeUSeboFNQ==/base.apk!libhttplib.so (offset 0x2b2000) (BuildId: a73f2004ed93a8baa2717053e639a4a3bf1385c3)`       
                     
    console.log(strings.split('\n').map((x,v) => {
        const a = /#[0-9]+ pc 00000000([0-9A-Za-z]{8})/.exec(x);
        return `C:\\Users\\Administrator\\AppData\\Local\\Android\\Sdk\\ndk\\23.1.7779620\\toolchains\\llvm\\prebuilt\\windows-x86_64\\bin\\llvm-addr2line.exe -Cfe C:\\Users\\Administrator\\Desktop\\Resources\\SourceCode\\Video\\app\\build\\intermediates\\cxx\\Debug\\6ew1b3x4\\obj\\arm64-v8a\\${/[a-z]+.so/.exec(x)[0]} `+((a && a[1])|| '')+` >${v}.txt` 
    }).join('\r\n\r\n'))
})();

(()=>{
const strings=`case 0:
await render(1, l, o);
window.history.replaceState(null, null, "?t=1");
break;
case 1:
 
await render(-2, l, o);
window.history.replaceState(null, null, "?t=-2");
break;
case 2:
await render(3, l, o);
window.history.replaceState(null, null, "?t=3");
break;
case 3:
await render(5, l, o);
window.history.replaceState(null, null, "?t=5");
break;
case 4:
await render(4, l, o);
window.history.replaceState(null, null, "?t=4");
break; 5
case 5:
await render(2, l, o);
window.history.replaceState(null, null, "?t=2");
break;
case 9:
await render(-1, l, o);
window.history.replaceState(null, null, "?t=-1");
break;`;
console.error([...strings.matchAll(/case (\d+)[^?]+\?t=([\d-]+)/g)]
.map(x=>{
    return `if (t === "${x[2]}") {
        customButtons.selected = ${x[1]};
      }`
}).join('\n'))
})()

(()=>{
    console.log([...$0.querySelectorAll('code')].map(x=>`@${x.textContent}="on${x.textContent.slice(0,1).toUpperCase()+x.textContent.slice(1)}Hanlder"`).join(' '));

    console.log([...$0.querySelectorAll('dt>a>code')].map(x=>`function on${x.textContent.slice(0,1).toUpperCase()+x.textContent.slice(1).trim()}Hanlder(){
console.log("${x.textContent}",\`video.videoWidth = \${video.videoWidth}\`,\`video.videoHeight = \${video.videoHeight}\`);

    }`).join('\n'));

    console.log([...$0.querySelectorAll('dt>a>code')].map(x=>`video.${x.textContent.substr(17)};`).join('\n'));

})();