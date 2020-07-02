const chatFriendDao = require("../dao/ChatFriendDao");
const timeUtil =  require("../util/TimeUtil");
const respUtil = require("../util/RespUtil");

const path = new Map();
const headers = {
    "content-type": "text/html; charset=utf-8",
    // "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type, x-requested-with",
    "Access-Control-Allow-Credentials": true
};

function addFriend(request, response) {
    const { userid, friendid } = request.body;
    if (!userid || !friendid) {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("error", "0", null));
        response.end();
        return;
    }
    chatFriendDao.insertFriendByAddFriend(userid, friendid, timeUtil.getNow(),function (result) {
        if (result) {
            response.writeHead(200, headers);
            response.write(respUtil.writeResult("success", "1", null));
            response.end();
        } else {
            response.writeHead(200, headers);
            response.write(respUtil.writeResult("exist", "2", null));
            response.end();
        }

    })
}
path.set("/addfriend", addFriend);

function getReqFriend(request, response) {
    const { userid } = request.body;
    if (!userid) {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("error", "0", null));
        response.end();
        return;
    }
    chatFriendDao.queryFriendReqByAddFriend(userid,function (result) {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("success", "1", result));
        response.end();
    })
}
path.set("/getReqFriend", getReqFriend);

function pastFriendReq(request, response) {
    const { userid, friendid } = request.body;
    if (!userid || !friendid) {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("error", "0", null));
        response.end();
        return;
    }
    chatFriendDao.pastFriendReq(userid, friendid, timeUtil.getNow(),function (result) {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("success", "1", null));
        response.end();
    })
}
path.set("/pastFriendReq", pastFriendReq);

module.exports.path = path;
