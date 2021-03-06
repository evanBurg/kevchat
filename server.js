const express = require("express");
const app = express();
const http = require("http");
const routes = require("./src/back_end/routes/routes");
const bodyParser = require("body-parser");
const socketIO = require("socket.io");
const socketMethods = require("./src/back_end/socket");
const port = process.env.PORT || 5000;
let server = http.createServer(app);
let io = socketIO(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See
// http://expressjs.com/api#app-settings for more details.
app.enable('trust proxy');
// Add a handler to inspect the req.secure flag (see
// http://expressjs.com/api#req.secure). This allows us
// to know whether the request was via http or https.
app.use(function (req, res, next) {
 if (req.secure) {
 // request was via https, so do no special handling
 next();
 } else {
 // request was via http, so redirect to https
 res.redirect('https://' + req.headers.host + req.url);
 }
});

// Serve the public folder statically
app.use(express.static("./public"));

app.use("/api/", routes);

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

io.on("connection", async socket => {
  io.emit("rooms", await socketMethods.rooms());
  socket.on("join", async client => {
    if (socketMethods.canJoinRoom(client, socket)) {
      await socketMethods.joinRoom(client, socket);
      socketMethods.welcome(client, socket);
      socketMethods.someoneJoined(client, socket);
      socket.emit("users", await socketMethods.getUsers());
      io.emit("rooms", await socketMethods.rooms());
    } else {
      socketMethods.nameExists(client, socket);
    }
  });
  socket.on("getusers", async () => {
    socket.emit("users", await socketMethods.getUsers());
  });
  socket.on("disconnect", async () => {
    socketMethods.leaveRoom(socket);
  });
  socket.on("leave", async () => {
    socketMethods.leaveRoom(socket);
  });
  socket.on("typing", async client => {
    socketMethods.someoneTyping(client, socket);
  });
  socket.on("message", async client => {
    socketMethods.broadcastMessage(client, io, socket);
  });
  socket.on("colours", async client => {
    socket.emit("availablecolours", await socketMethods.colours());
  });
  socket.on("changecolour", async client => {
    socketMethods.changeColour(client, socket);
    socket.emit("users", await socketMethods.getUsers());
  });
});

server.listen(port, () => console.log(`starting on port ${port}`));
