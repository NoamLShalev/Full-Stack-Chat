app.post("/kick", (req, res) => {
  let sessionId = req.cookies.sid; // 22
  let username = sessions[sessionId]; // 22
  if (username !== "admin") {
    res.send("nice try bucko!");
    return;
  }
  let kickee = req.body.kickee;
  let allSessionIds = Object.keys(sessions);
  let candidates = allSessionIds.filter(id => {
    let user = sessions[id];
    return user === kickee;
  });
  let kickeeSessionId = candidates[0];
  delete sessions[kickeeSessionId];
  messages = messages.concat({
    username: "admin",
    msg: "I just kicked " + kickee + " was kicked out"
  });
  res.send("success");
});
