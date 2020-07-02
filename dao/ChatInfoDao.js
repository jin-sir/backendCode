const dbutil = require("./DBUtil");

function queryChatInfo(userid, friendid, success) {
    const selectSql = "select user, content, isread, ctime from chatinfo where (user = ? and friend = ?) or (user = ? and friend = ?) order by ctime asc";
    const params = [userid, friendid, friendid, userid];
    const connection = dbutil.createConnection();
    connection.connect();
    connection.query(selectSql, params, function (error, result) {
        if (error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function insertInfoByChatInfo(userid, friendid, content, ctime, success) {
    const insertSql = "insert into chatinfo (`user`, `friend`, `content`, `isread`, `ctime`) values (?, ?, ?, ?, ?);";
    const params = [userid, friendid, content, false, ctime];
    const connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql, params, function (error, result) {
        if (error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function insertNowChatByNewlyChat(userid, friendid, ctime, success) {
    const insertSql = "insert into newlychat (`user`, `friend`, `ctime`) values (?, ?, ?);";
    const params = [userid, friendid, ctime];
    const connection = dbutil.createConnection();
    connection.connect();
    connection.query(insertSql, params, function (error, result) {
        if (error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function queryNowChatByNewlyChat(userid, success) {
    const selectSql = "select b.id, c.nickname, c.signature, d.avatarpath from newlychat a, user b, userinfo c, useravatar d where a.user = ? and a.friend = b.id and b.userinfoid = c.id and c.avatarid = d.id;";
    const params = [userid];
    const connection = dbutil.createConnection();
    connection.connect();
    connection.query(selectSql, params, function (error, result) {
        if (error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function isNowChatByNewlyChat(userid, friendid, success) {
    const selectSql = "select id from newlychat where user = ? and friend = ?";
    const params = [userid, friendid];
    const connection = dbutil.createConnection();
    connection.connect();
    connection.query(selectSql, params, function (error, result) {
        if (error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

module.exports = {
    queryChatInfo,
    insertInfoByChatInfo,
    insertNowChatByNewlyChat,
    queryNowChatByNewlyChat,
    isNowChatByNewlyChat
}