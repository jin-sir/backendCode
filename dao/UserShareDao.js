const dbUtil = require("./DBUtil");
const chatFriendDao = require("./ChatFriendDao");
function insertShareByUserShare(userid, content, ctime, success) {
    const insertSql = "insert into usershare (`user`, `content`, `ctime`) values (?, ?, ?);"
    const params = [userid, content, ctime];
    const connection = dbUtil.createConnection();
    connection.connect();
    connection.query(insertSql, params, function (err, result) {
        if (err == null) {
            success(result);
        } else {
            console.log(err);
        }

    })
}

function insertPicBySharePicture(path, shareid, ctime, success) {
    const insertSql = "insert into sharepicture (`path`, `shareid`, `ctime`) values (?, ?, ?);"
    const params = [path, shareid, ctime];
    const connection = dbUtil.createConnection();
    connection.connect();
    connection.query(insertSql, params, function (err, result) {
        if (err == null) {
            success(result)
        } else {
            console.log(err);
        }

    })
}
// insertShareByUserShare(10, '今天心情很好，感觉自己美美哒~~', parseInt(new Date().getTime()/1000), "https://wx.qlogo.cn/mmopen/vi_32/G3EnuK9tmE11iazvTjL4d1D2wg4CvsxRxGYyR7PNticFqYQ5BCDCWdT8fFSRIX4zicic1iadicOCG5ZFYxeZqVsIXnPA/132",
//     function (result){console.log(result)});


function queryFriendShare(userid, offset, limit, success) {
    chatFriendDao.selectFriend(userid, async function (result) {
        let temp = [];
        for (const prop of result) {
            await new Promise((res, rej) => {
                queryShareByUserShare(prop.friend, 0, 10, function (result) {
                    temp = [...temp, ...result]
                    res();
                })
            })
        }
        temp.sort(function (a, b) {
            return b.ctime - a.ctime;
        })
        temp = temp.slice(offset, limit);
        success(temp);
    })
}
// queryFriendShare(8, 0, 10,function (result) {
//     console.log(result)
// })

function queryShareByUserShare(userid, offset, limit, success) {
    const selectSql = "select a.content,a.id as shareid, a.ctime, c.nickname, d.avatarpath from usershare a, user b, userinfo c, useravatar d where user = ? and a.user = b.id and b.userinfoid = c.id and c.avatarid = d.id limit ?, ?;"
    const params = [userid, offset, limit];
    const connection = dbUtil.createConnection();
    connection.connect();
    connection.query(selectSql, params, async function (err, result) {
        if (err == null) {
            for (const prop of result) {
                await new Promise((res, rej) => {
                    queryPicBySharePicture(prop.shareid, function (picArr) {
                        // console.log(picArr)
                        prop.path = picArr;
                        res();
                    })
                })
            }
            success(result);
        } else {
            console.log(err);
        }

    })
}
function queryPicBySharePicture(id, success) {
    const selectSql = "select * from sharepicture where shareid = ?;"
    const params = [id];
    const connection = dbUtil.createConnection();
    connection.connect();
    connection.query(selectSql, params, function (err, result) {
        if (err == null) {
            success(result);
        } else {
            console.log(err);
        }

    })
}
// queryShareByUserShare(10, 0, 1,function (result) {
//     console.log(result)
// })

function insertShareComment(user, shareid, content, ctime, success) {
    const insertSql = "insert into sharecomment (`user`, `shareid`, `content`, `ctime`) values (?, ?, ?, ?);"
    const params = [user, shareid, content, ctime];
    const connection = dbUtil.createConnection();
    connection.connect();
    connection.query(insertSql, params, function (err, result) {
        if (err == null) {
            success(result)
        } else {
            console.log(err);
        }

    })
}

function queryshareComment(shareid, success) {
    const selectSql = "select a.content, a.ctime, c.nickname, d.avatarpath from sharecomment a, user b, userinfo c, useravatar d where" +
        " a.shareid = ? and" +
        " a.user = b.id and" +
        " b.userinfoid = c.id and" +
        " c.avatarid = d.id" +
        " order by a.ctime asc;"
    const params = [shareid];
    const connection = dbUtil.createConnection();
    connection.connect();
    connection.query(selectSql, params, function (err, result) {
        if (err == null) {
            success(result)
        } else {
            console.log(err);
        }

    })
}
// insertShareComment(6, 2, '你帮死了！', parseInt(new Date().getTime()/1000), function (result) {
//     console.log(result)
// });
// queryshareComment(2, function (result) {
//     console.log(result)
// })
module.exports = {
    insertShareByUserShare,
    insertPicBySharePicture,
    queryShareByUserShare,
    insertShareComment,
    queryshareComment,
    queryFriendShare
}