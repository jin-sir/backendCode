const userShareDao = require("../dao/UserShareDao");
const timeUtil =  require("../util/TimeUtil");
const respUtil = require("../util/RespUtil");
const qiniu = require("../util/qiniu");
const headers = {
    "content-type": "text/html; charset=utf-8",
    // "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type, x-requested-with",
    "Access-Control-Allow-Credentials": true
};

const path = new Map();
// 发布用户动态
async function addUserShare(request, response) {
    const { userid, content } = request.body;
    if (!userid || !content) {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("error", "0", null));
        response.end();
        return;
    }
    const shareId = await  new Promise((res, rej)=> {
        userShareDao.insertShareByUserShare(userid, content, timeUtil.getNow(), function (result) {
            res(result.insertId);
        })
    })
    if (request.file) {
        qiniu.qiniuUpload(request.file, function (key) {
            console.log(key)
            userShareDao.insertPicBySharePicture(key, shareId, timeUtil.getNow(), function (result) {
                response.writeHead(200, headers);
                response.write(respUtil.writeResult("success", "1", null));
                response.end();
            })
        }, function () {
            response.writeHead(200, headers);
            response.write(respUtil.writeResult("error", "0", null));
            response.end();
        });
    } else {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("success", "1", null));
        response.end();
    }

}
path.set("/addUserShare", addUserShare);
// 查找用户动态
function getUserShare(request, response) {
    const { userid, offset=0, limit=10 } = request.body;
    if (!userid) {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("error", "0", null));
        response.end();
        return;
    }
    userShareDao.queryFriendShare(userid, offset, limit, function (result) {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("success", "1", result));
        response.end();
        return;
    });

}
path.set("/getUserShare", getUserShare);
// 评论
function addComment(request, response) {
    const { shareid, userid, content } = request.body;
    if (!userid) {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("error", "0", null));
        response.end();
        return;
    }
    userShareDao.insertShareComment(userid, shareid, content, timeUtil.getNow(), function (result) {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("success", "1", result));
        response.end();
    })
}
path.set("/addComment", addComment);
// 获取用户评论
function getComment(request, response) {
    const { shareid } = request.body;
    if (!shareid) {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("error", "0", null));
        response.end();
        return;
    }
    userShareDao.queryshareComment(shareid, function (result) {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("success", "1", result));
        response.end();
    });
}
path.set("/getComment", getComment);
module.exports.path = path;