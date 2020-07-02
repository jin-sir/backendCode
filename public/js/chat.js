const socket = io.connect();

// 客户端发送消息给服务器
page.onLogin = function (username) {
  console.log(username)
  socket.emit("login", {username: 'jlf', userid: username});
};

page.onSendMsg = function (me, msg, to) {
  console.log("sendFriend")
  socket.emit("sendFriend", {
    from: me,
    to: me == 7 ? 8 : 7,
    content: msg,
  });
  page.addMsg(me, msg, to);
  page.clearInput();
};

// 客户端监听服务器消息
socket.on("login", (result) => {
  console.log(result);
  if (result) {
    page.intoChatRoom();
    socket.emit("users", "");
  } else {
    alert("昵称不可用，请更换昵称");
  }
});

socket.on("friend login", resuult => {
  console.log(resuult)
  page.addUser(resuult.to);
})

socket.on("users", (users) => {
  page.initChatRoom();
  for (const u of users) {
    page.addUser(u);
  }
});

socket.on("userin", (username) => {
  page.addUser(username);
});

socket.on("userout", (username) => {
  page.removeUser(username);
});

socket.on("new msg", (result) => {
  page.addMsg(result.from, result.content, result.to);
});
// socket.on("friendMsg", (result) => {
//   page.addMsg(result.from, result.content, result.to);
// });

socket.on("sendFriend", (result) => {
  console.log(result, "success")
});

socket.on("friendMsg", (result) => {
  console.log(result)
  page.addMsg(result.from, result.content, result.to);
});
