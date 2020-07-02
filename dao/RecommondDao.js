const dbutil = require("./DBUtil");

function queryRandomUserByUser(offset, limit, success) {
    const selectSql = "select b.nickname, b.college, b.signature, c.avatarpath  from user a, userinfo b, useravatar c where a.userinfoid = b.id and b.avatarid = c.id order by a.ctime desc limit ?, ?;"
    const params = [offset, limit];
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
    queryRandomUserByUser
}