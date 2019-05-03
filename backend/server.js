let express = require("express");
let multer = require("multer");
let cors = require("cors");
let cookieParser = require("cookie-parser");
let fs = require("fs");
let upload = multer({
  dest: __dirname + "/uploads/"
});
let app = express();
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use("/images", express.static(__dirname + "/uploads/"));

messages = [];
passwords = {};
sessions = {};
activeUsers = {};
let generateId = () => {
  return "" + Math.floor(Math.random() * 1000000);
};

app.post("/signup", upload.none(), (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (passwords[username] !== undefined) {
    res.send(JSON.stringify({ success: false }));
    return;
  }
  passwords[username] = password;
  let sessionId = generateId();
  sessions[sessionId] = username;
  res.cookie("sid", sessionId);
  let today = new Date();
  let time = today.getHours() + ":" + today.getMinutes();
  if (today.getMinutes() < 10) {
    time = today.getHours() + ":0" + today.getMinutes();
  }
  let logNotif = {
    username: username,
    message: " has logged in",
    time: time + " "
  };
  messages = messages.concat(logNotif);
  res.send(JSON.stringify({ success: true }));
});

app.post("/login", upload.none(), (req, res) => {
  let username = req.body.username;
  let enteredPassword = req.body.password;
  let expectedPassword = passwords[username];
  if (enteredPassword === expectedPassword) {
    let sessionId = generateId();
    sessions[sessionId] = username;
    res.cookie("sid", sessionId);
    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes();
    if (today.getMinutes() < 10) {
      time = today.getHours() + ":0" + today.getMinutes();
    }
    let logNotif = {
      username: username,
      message: " has logged in",
      time: time + " "
    };
    messages = messages.concat(logNotif);
    res.send(JSON.stringify({ success: true }));
    return;
  }
  res.send(JSON.stringify({ success: false }));
});

app.post("/newmessage", upload.single("image"), (req, res) => {
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  let message = req.body.message;
  activeUsers[username] = new Date() / 1;

  let today = new Date();
  let time = today.getHours() + ":" + today.getMinutes();
  if (today.getMinutes() < 10) {
    time = today.getHours() + ":0" + today.getMinutes();
  }

  let file = req.file;
  let newMessage = "";
  if (file === undefined) {
    newMessage = {
      username: username + ": ",
      message: message,
      time: time + " "
    };
    messages = messages.concat(newMessage);
    res.send(JSON.stringify({ success: true }));
    return;
  }

  let frontEndPath = "http://localhost:4000/images/" + file.filename;

  newMessage = {
    username: username + ": ",
    message: message,
    time: time + " ",
    image: frontEndPath
  };
  messages = messages.concat(newMessage);
  res.send(JSON.stringify({ success: true }));
});

app.get("/messages", (req, res) => {
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  messages = messages.slice(-20);

  let usernames = Object.keys(activeUsers);
  let actives = usernames.filter(username => {
    let timestamp = activeUsers[username];
    let now = new Date() / 1;
    return timestamp > now - 300000;
  });

  if (username === undefined) {
    res.send(
      JSON.stringify({ success: false, message: "You are not logged in!" })
    );
    return;
  }
  res.send(JSON.stringify({ success: true, messages, actives }));
});

app.get("/delete", (req, res) => {
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  messages = messages.filter(message => {
    return message.username !== username + ": ";
  });
  res.send(JSON.stringify({ success: true }));
});

app.get("/login-check", (req, res) => {
  let sessionId = req.cookies.sid;
  if (sessions[sessionId] !== undefined) {
    res.send(JSON.stringify({ success: true }));
    return;
  }
  res.send(JSON.stringify({ success: false }));
});

app.get("/logout", (req, res) => {
  let sessionId = req.cookies.sid;
  sessions[sessionId] = undefined;
  res.send(JSON.stringify({ success: true }));
});

app.post("/kick-out", upload.none(), (req, res) => {
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  let userKick = req.body.user;
  if (username !== "Admin") {
    res.send(
      JSON.stringify({ success: false, message: "You are not an Admin!" })
    );
    return;
  }
  let kickNotif = {
    username: userKick,
    message: " has been kicked out of the chat"
  };
  messages = messages.concat(kickNotif);

  let ids = Object.keys(sessions);
  ids.forEach(id => {
    if (sessions[id] === userKick) {
      sessions[id] = undefined;
    }
  });

  res.send(JSON.stringify({ success: true }));
});

app.get("/admin", (req, res) => {
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  console.log("username", username);
  if (username === "Admin") {
    res.send(JSON.stringify({ success: true }));
    return;
  }
  res.send(JSON.stringify({ success: false }));
});

app.listen(4000, "0.0.0.0");
