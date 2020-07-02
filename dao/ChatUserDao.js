const dbutil = require("./DBUtil");

function insertUser(username, openid, userinfoid,ctime, success) {
    const insertSql = "insert into user (`username`, `openid`, `userinfoid`, `ctime`) values (?, ?, ?, ?);";
    const params = [username, openid, userinfoid, ctime];
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

function insertUserInfo(nickname, college, signature,avatarid, success) {
    const insertSql = "insert into userinfo (`nickname`, `college`, `signature`, `avatarid`) values (?, ?, ?, ?);";
    const params = [nickname, college, signature,avatarid];
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

function insertUserAvatar(avatarpath, success) {
    const insertSql = "insert into useravatar (`avatarpath`) values (?);";
    const params = [avatarpath];
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

function queryUserByUserId(username, success) {
    const querySql = "select id from user where username = ?"
    const params= [username];
    const connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql, params, function (error, result) {
        if (error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function  queryUser(openid, success) {
    const querySql = "select id,userinfoid from user where openid = ?"
    const params= [openid];
    const connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql, params, function (error, result) {
        if (error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function queryUserByUserInfoId(userid, success) {
    const querySql = "select userinfoid from user where id = ?"
    const params= [userid];
    const connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql, params, function (error, result) {
        if (error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function queryUserInfoByInfo(infoid, success) {
    const querySql = "select * from userinfo where id = ?"
    const params= [infoid];
    const connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql, params, function (error, result) {
        if (error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function queryUserAvatarByAvatarPath(userid, success) {
    const querySql = "select avatarpath from useravatar where id = ?"
    const params= [userid];
    const connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql, params, function (error, result) {
        if (error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function alterNoAvatarIdByAvatarPath(userid, key, success) {
    queryUserByUserInfoId(userid, function (result) {
        console.log(result)
        const userinfoid = result[0].userinfoid
        queryUserInfoByInfo(userinfoid, function (result) {
            const avatarid = result[0].avatarid;
            alterAvatarByUserAvatar(avatarid, key, function (result) {
                success(result);
            })
        })
    })
}

function alterAvatarByUserAvatar(avatarid, key, success) {
    const querySql = "update useravatar set avatarpath = ? where id = ?"
    const params= [key, avatarid];
    const connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql, params, function (error, result) {
        if (error == null) {
            success(result);
        } else {
            console.log(error);
        }
    });
    connection.end();
}

function alterDataByUserInfo(userid, nickname, college, signature, success) {
    queryUserByUserInfoId(userid, function (result) {
        if (result.length === 1) {
            const updateSql = "update userinfo set nickname = ?, college = ?, signature = ? where id = ?;"
            const params= [nickname, college, signature, result[0].userinfoid];
            const connection = dbutil.createConnection();
            connection.connect();
            connection.query(updateSql, params, function (error, result) {
                if (error == null) {
                    success(result);
                } else {
                    console.log(error);
                }
            });
            connection.end();
        }
    })

}
// alterDataByUserInfo(6, 'xfr', '城建学院', '今天图书馆一点也不凉快', function (result) {
//     console.log(result, "OK");
// });
module.exports = {
    insertUser,
    insertUserAvatar,
    insertUserInfo,
    queryUserAvatarByAvatarPath,
    queryUser,
    queryUserByUserId,
    queryUserByUserInfoId,
    alterNoAvatarIdByAvatarPath,
    alterAvatarByUserAvatar,
    queryUserInfoByInfo,
    alterDataByUserInfo
}