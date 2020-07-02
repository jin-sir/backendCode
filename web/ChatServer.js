const socketIO = require("socket.io");
const chatfriendDao = require("../dao/ChatFriendDao");
const chatInfoDao = require("../dao/ChatInfoDao");
const timeUtil = require("../util/TimeUtil");

let users = [];

async function findFriend(userid) {
    let friend = [];
    console.log(userid)
    await new Promise((res, rej)=> {
        chatfriendDao.selectFriend(userid, function (result) {
            result.forEach(item => {
                if (item.user) {
                    friend.push(item.user)
                } else {
                    friend.push(item.friend)
                }
            })
            // console.log(friend)
            res(friend);
        })
    });
    return users.filter(item => friend.includes(parseInt(item.userid)));
}
module.exports = function (server) {
    const io = socketIO(server);
    io.on("connection", socket => {
        let curUser = "";
        let curUserid = null;
        // 用户登录
        socket.on("login", async data => {
            const islogin = users.filter(item => item.userid == data.userid);
            if (islogin.length !== 0) {
                socket.emit("login", {
                    status: 0,
                    msg: "user already login",
                    data: null
                });
                return;
            }
            users.push({
                username: data.username,
                userid: data.userid,
                socket
            });
            curUser = data.username;
            curUserid = data.userid;
            const friend = await findFriend(data.userid);
            friend.forEach(item => {
                // 通知好友我上线了
                item.socket.emit('friend login', {
                    from: curUser,
                    content: 'login',
                    to: item.username
                })
            });
            // console.log(friend, users)
            socket.emit("login", {
                status: 1,
                msg: "succes",
                data: null
            })
        });
        // 用户给好友发送信息
        socket.on("sendFriend", async data => {
            const isLogin = users.filter(item => parseInt(item.userid) == parseInt(data.to));
            // console.log(isLogin)
            if (isLogin.length !== 0) {
                console.log(true)
                console.log( {
                    from: data.from,
                    content: data.content,
                    to: data.to
                })
                isLogin[0].socket.emit('friendMsg', {
                    from: data.from,
                    content: data.content,
                    to: data.to
                })
            }
            chatInfoDao.insertInfoByChatInfo(curUserid, data.to, data.content, timeUtil.getNow(), function () {
                socket.emit("sendMsg", {
                    status: 1,
                    msg: "success",
                    data: null
                });
            });
        })
        socket.on("disconnect", async () => {
            const friend = await findFriend(curUserid);
            console.log(friend)
            friend.forEach(item => {
                // 通知好友我下线了
                console.log(item.userid)
                item.socket.emit('userout', curUser)
            });
            users = users.filter((u) => u.userid !== curUserid);
        });
    })
}