const express = require('express');
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

// Serve the public folder statically
app.use(express.static('./public'));

app.use("/api/", routes);

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

io.on("connection", socket => {
    socket.emit('rooms', socketMethods.rooms());
    socket.on("join", async client => {
      if(socketMethods.canJoinRoom(client, socket)){
        await socketMethods.joinRoom(client, socket);
        socketMethods.welcome(client, socket)
        socketMethods.someoneJoined(client, socket);
        socket.emit('users', socketMethods.getUsers());
      }else{
        socketMethods.nameExists(client, socket)
      }
    });
    socket.on('getusers', async () => {
      socket.emit('users', socketMethods.getUsers());
    });
    socket.on('disconnect', async () => {
      socketMethods.leaveRoom(socket);
    });
    socket.on('leave', async () => {
      socketMethods.leaveRoom(socket);
    });
    socket.on("typing", async client => {
      socketMethods.someoneTyping(client, socket);
    });
    socket.on("message", async client => {
      socketMethods.broadcastMessage(client, io, socket);
    });
  });
  
  server.listen(port, () => console.log(`starting on port ${port}`));