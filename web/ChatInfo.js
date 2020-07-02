const chatInfoDao = require("../dao/ChatInfoDao");
const timeUtil = require("../util/TimeUtil");
const respUtil = require("../util/RespUtil");
const path = new Map();
const headers = {
    "content-type": "text/html; charset=utf-8",
    // "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type, x-requested-with",
    "Access-Control-Allow-Credentials": true
};

function sendInfo(request, response) {
    const { userid, friendid, content } = request.body;
    if (!userid || !friendid || !content) {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("error", "0", null));
        response.end();
        return;
    }
    response.writeHead(200, headers);
    response.write(respUtil.writeResult("success", "1", null));
    response.end();
    insertInfo(userid, friendid, content)
}
function insertInfo(userid, friendid, content) {
    chatInfoDao.insertInfoByChatInfo(userid, friendid, content, timeUtil.getNow(), function (result) {
        // console.log(result, "OK");
    })
}
path.set("/sendinfo", sendInfo);

function queryInfo(request, response) {
    const { userid, friendid } = request.body;
    if (!userid || !friendid) {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("error", "0", null));
        response.end();
        return;
    }
    getInfo(userid, friendid, response)
}
function getInfo(userid, friendid, response) {
    chatInfoDao.queryChatInfo(userid, friendid,function (result) {
        // console.log(result, "OK");
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("success", "1", result));
        response.end();
    })
}
path.set("/queryInfo", queryInfo);

function addNewlyChat(request, response) {
    const { userid, friendid } = request.body;
    if (!userid || !friendid) {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("error", "0", null));
        response.end();
        return;
    }
    chatInfoDao.isNowChatByNewlyChat(userid, friendid, function (result) {
        if (result.length === 0) {
            chatInfoDao.insertNowChatByNewlyChat(userid, friendid, timeUtil.getNow(),function (result) {
                response.writeHead(200, headers);
                response.write(respUtil.writeResult("success", "1", null));
                response.end();
            })
            return;
        }
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("error", "0", null));
        response.end();
    })
}
path.set("/addNewlyChat", addNewlyChat);

function getNewlyChat(request, response) {
    const { userid } = request.body;
    if (!userid) {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("error", "0", null));
        response.end();
        return;
    }
    chatInfoDao.queryNowChatByNewlyChat(userid, function (result) {
        const temp = {
            ...result
        };
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("success", "1", temp));
        response.end();
    })

}
path.set("/getNewlyChat", getNewlyChat);
module.exports.path = path;