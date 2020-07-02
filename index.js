const express = require("express");
const http = require("http");
const globalConfig = require("./config");
const loader = require("./loader");
const multer = require("multer");
const upload = multer({ dest: "./temp/" });
const app = express();
const server = http.createServer(app);
const path = require("path");
require("./web/ChatServer")(server);

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use(express.static(path.resolve(__dirname, "public")));

// 用户操作
app.post("/login", loader.get("/login"));
app.post("/alterAvatar", upload.single("file"), loader.get("/alterAvatar"))
app.post("/queryUserInfo", loader.get("/queryUserInfo"))
app.post("/alterData", loader.get("/alterData"))
// 查找历史聊天信息
// app.post("/sendinfo", loader.get("/sendinfo"))
app.post("/queryInfo", loader.get("/queryInfo"))
// 添加（获取）最新聊天
app.post("/addNewlyChat", loader.get("/addNewlyChat"))
app.post("/getNewlyChat", loader.get("/getNewlyChat"))
// 添加朋友
app.post("/addfriend", loader.get("/addfriend"))
// 获取请求列表
app.post("/getReqFriend", loader.get("/getReqFriend"))
// 通过好友请求
app.post("/pastFriendReq", loader.get("/pastFriendReq"))
// 获取推荐
app.get("/queryRecommond", loader.get("/queryRecommond"));
// 获取随机
app.get("/querysomeUser", loader.get("/querysomeUser"));

// 发布动态
app.post("/addUserShare", loader.get("/addUserShare"));
// 获取动态
app.post("/getUserShare", loader.get("/getUserShare"));
// 添加评论
app.post("/addComment", loader.get("/addComment"));
获取评论
app.post("/getComment", loader.get("/getComment"));


server.listen(globalConfig.port, function () {
    console.log("服务器已启动");
})