const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('1.db');
const db1 = new sqlite3.Database('videos.db');

db.serialize(() => {


    const stmt = db1.prepare("INSERT INTO video(title,url,play,music_play,music_title,music_author,cover,video_type,create_at,update_at) VALUES (?,?,?,?,?,?,?,?,?,?)");
    // for (let i = 0; i < 10; i++) {
    //     stmt.run("Ipsum " + i);
    // }
    // stmt.finalize();

    db.each("SELECT * FROM video", (err, row) => {
        if (row.url.startsWith('https://www.tiktok.com')) {
             stmt.run( row.title, row.url, row.play.substr(22), row.music_play, row.music_title, row.music_author, row.cover.substr(22), 1, row.create_at/1000|0, row.update_at/1000|0);
            return;
        } if (row.url.startsWith('https://twitter.com')) {
            stmt.run(row.title, row.url, row.play, row.music_play, row.music_title, row.music_author, row.cover, 2, row.create_at/1000|0, row.update_at/1000|0);
            return;
        } if (row.url.startsWith('https://www.xvideos.com')) {
            stmt.run(row.title, row.url, row.play, row.music_play, row.music_title, row.music_author, row.cover, -1, row.create_at/1000|0, row.update_at/1000|0);
             return;
         }else {
            console.log(row.url);
        }
    }, () => {
        stmt.finalize();
    });
    //
});

db.close();