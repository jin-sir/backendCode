const chatUserDao = require("../dao/ChatUserDao");
const timeUtil =  require("../util/TimeUtil");
const respUtil = require("../util/RespUtil");
const req = require("request");
const globalConfig = require("../config");
const qiniu = require("../util/qiniu");


const path = new Map();
const headers = {
    "content-type": "text/html; charset=utf-8",
    // "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type, x-requested-with",
    "Access-Control-Allow-Credentials": true
};
// 登录接口
function login (request, response) {
    const data = request.body
    getUserOpenid(data,response);
}
function getUserOpenid(params,response) {
    req(
        `https://api.weixin.qq.com/sns/jscode2session?appid=${globalConfig["appid"]}&secret=${globalConfig["secret"]}&js_code=${params["code"]}&grant_type=authorization_code`,
        function (err, resp, body) {
            body = JSON.parse(body);
            const openid = body["openid"];
            const temp = {
                ...params,
                openid
            }
            isUser(temp,response)
        }
    )
}
function isUser(params,response) {
    chatUserDao.queryUser(params.openid, function (res) {
        if (res.length == 0) {
            insertUserAvatar(params,response);
        } else {
            getUserInfo(res[0].userinfoid, res[0].id,response)
        }
    })
}
function getUserInfo(infoid, userid, response) {
    chatUserDao.queryUserInfoByInfo(infoid, function (result) {
        result[0].id = userid;
        getAvatarPath(result[0], response)
    });
}
function getAvatarPath(data, response) {
    chatUserDao.queryUserAvatarByAvatarPath(data.avatarid, function (result) {
        const temp = {
            ...data,
            avatarPath: result[0].avatarpath
        }
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("success", "1", temp));
        response.end();
    })
}
function insertUserAvatar(params, response) {
    chatUserDao.insertUserAvatar(params.avatarUrl, function (result) {
        insertUserInfo(result.insertId, params, response);
    })
}
function insertUserInfo(id,params, response) {
    chatUserDao.insertUserInfo(params.nickName, "信息工程学院", "主人很烂，什么都没有留下",id, function (result) {
        insertUser(result.insertId, params, response)
    })
}
function insertUser(id, params, response) {
    chatUserDao.insertUser(params.nickName, params.openid, id,timeUtil.getNow(), function (result) {
        console.log(result, "OK")
        getUserInfoId(result.insertId, response);
    })
}
path.set("/login", login);

// 修改头像
function alterAvatar(request, response) {
    const userid = request.body.userid;
    const avatarid = request.body.avatarid;
    qiniu.qiniuUpload(request.file, function (key) {
        console.log(key)
        if (avatarid) {
            chatUserDao.alterAvatarByUserAvatar(avatarid, key, function (result) {
                const data = {
                    url: 'http://api.jinlingfei.top/' + key
                }
                response.writeHead(200, headers);
                response.write(respUtil.writeResult("success", "1", data));
                response.end();
            });
            return;
        }
        chatUserDao.alterNoAvatarIdByAvatarPath(userid, key, function (result) {
            console.log(result)
            const data = {
                url: 'http://api.jinlingfei.top/' + key
            }
            response.writeHead(200, headers);
            response.write(respUtil.writeResult("success", "1", data));
            response.end();
        })
    }, function () {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("error", "0", null));
        response.end();
    });

}
path.set("/alterAvatar", alterAvatar);

// 获取用户&好友信息
function queryUserInfo(request, response) {
    // response.writeHead(200, headers);
    // response.write(respUtil.writeResult("success", "1", null));
    // response.end();
    const userid = request.body.userid;
    getUserInfoId(userid, response);
}
function getUserInfoId(userid, response) {
    console.log(userid)
    chatUserDao.queryUserByUserInfoId(userid, function (result) {
        console.log(result)
        getUserInfo(result[0].userinfoid, response);
    })
}
path.set("/queryUserInfo", queryUserInfo);

// 修改基本资料
function alterData(request, response) {
    const { userid, nickname, college, signature } = request.body;
    if (!userid || !nickname || !college || !signature) {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("error", "0", null));
        response.end();
        return;
    }
    chatUserDao.alterDataByUserInfo(userid, nickname, college, signature, function (result) {
        if (result.affectedRows) {
            response.writeHead(200, headers);
            response.write(respUtil.writeResult("success", "1", null));
            response.end();
        } else {
            response.writeHead(200, headers);
            response.write(respUtil.writeResult("error", "0", null));
            response.end();
        }

    })
}
path.set("/alterData", alterData)
module.exports.path = path;
