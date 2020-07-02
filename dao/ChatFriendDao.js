const dbutil = require("./DBUtil");

function insertFriendByAddFriend(userid, friendid, ctime, success) {
    isFriendList(userid, friendid, function (result) {
        if (result.length === 0) {
            const insertSql = "insert into addfriend (`user`, `friend`, `ctime`) values (?, ?, ?);";
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
        } else {
            success();
        }
    })

}
function isFriendList(userid, friendid, success) {
    const selectSql = "select id from addfriend where user = ? and friend = ?;";
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

function queryFriendReqByAddFriend(userid, success) {
    const selectSql = "select a.user, c.nickname, c.signature, d.avatarpath from addfriend a, user b, userinfo c, useravatar d where friend = ? and a.friend = b.id and b.userinfoid = c.id and c.avatarid = d.id;";
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

function pastFriendReq(userid, friendid, ctime, success) {
    insertFriendByUserFriend(userid, friendid, ctime, function (result) {
        if (result.insertId) {
            deleteByAddFriend(userid, friendid, function (result) {
                success(result);
            })
        }

    })
}
// insertFriendByUserFriend(10, 8 , parseInt(new Date().getTime()/1000))
function insertFriendByUserFriend(userid, friendid, ctime, success) {
    const insertSql = "insert into userfriend (`user`, `friend`, `ctime`) values (?, ?, ?);";
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

function selectFriend(userid, success) {
    const selectSql = "select friend from userfriend where user = ?;";
    const params = [userid];
    const connection = dbutil.createConnection();
    connection.connect();
    connection.query(selectSql, params, function (error, result) {
        if (error == null) {
            const friendArr = result;
            findFriend(userid, function (result) {
                const data = [...result, ...friendArr];
                success(data);
            })
        } else {
            console.log(error);
        }
    });
    connection.end();
}
function findFriend(userid, success) {
    const selectSql = "select user as friend from userfriend where friend = ?;";
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
function deleteByAddFriend(userid, friendid, success) {
    const deleteSql = "delete from addfriend where friend = ? and user = ?;";
    const params = [userid, friendid];
    const connection = dbutil.createConnection();
    connection.connect();
    connection.query(deleteSql, params, function (error, result) {
        if (error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}
module.exports = {
    insertFriendByAddFriend,
    queryFriendReqByAddFriend,
    pastFriendReq,
    selectFriend
}