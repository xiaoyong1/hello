var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'root',
    database        : 'avio-spider'
});

var dao = {
    insert: (info) => {
        pool.query(
            'REPLACE INTO `info`(id, name, url, photo, local) VALUES(?, ?, ?, ?, ?)', 
            [info.id, info.name, info.url, info.photo, info.local], () => {
            // 失败就随它去吧
        });
    }
}

module.exports = dao;