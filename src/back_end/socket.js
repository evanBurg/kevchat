let matColours = require("./matdes100colours.json").colours;
getRandomColour = del => {
  let coloridx = Math.floor(Math.random() * matColours.length) + 1;
  let color = matColours[coloridx];
  if (del) matColours = matColours.filter(clr => clr !== color);
  return color;
};
const systemColor = getRandomColour(true);

let currentUsers = [];

exports.canJoinRoom = client => {
  let currentNames = currentUsers.map(user => user.name);
  if (!currentNames.includes(client.name)) {
    return true;
  } else {
    return false;
  }
};

exports.joinRoom = (client, socket) => {
  return new Promise((resolve, reject) => {
    socket.name = client.name;
    client.color = socket.color = getRandomColour(true);
    currentUsers.push(client);
    resolve(socket.join(client.room));
  });
};

exports.leaveRoom = socket => {
  return new Promise((resolve, reject) => {
    let leavingUser;
    currentUsers = currentUsers.filter((user, index) => {
      if (user.name !== socket.name) {
        return true;
      } else {
        leavingUser = user;
        return false;
      }
    });

    if (leavingUser)
      socket.to(leavingUser.room).emit("someoneleft", {
        from: "admin",
        time: new Date(),
        room: leavingUser.room,
        color: systemColor,
        message: `User ${leavingUser.name} left room ${leavingUser.room}`
      });

    resolve(leavingUser);
  });
};

exports.welcome = (client, socket) => {
  return new Promise((resolve, reject) => {
    resolve(
      socket.emit("welcome", {
        from: "admin",
        time: new Date(),
        room: client.room,
        color: systemColor,
        message: `Welcome ${client.name}! (Joined room ${client.room})`
      })
    );
  });
};

exports.getUsers = () => {
  return currentUsers;
};

exports.rooms = () => {
  return currentUsers.map(user => user.room);
};

exports.nameExists = (client, socket) => {
  return new Promise((resolve, reject) => {
    resolve(
      socket.emit("nameexists", {
        from: "admin",
        time: new Date(),
        room: client.room,
        color: systemColor,
        message: `${client.name} attempted join room ${
          client.room
        }, however that name already exists`
      })
    );
  });
};

exports.someoneJoined = (client, socket) => {
  return new Promise((resolve, reject) => {
    resolve(
      socket.to(client.room).emit("someonejoined", {
        from: "admin",
        time: new Date(),
        room: client.room,
        user: client,
        color: systemColor,
        message: `${client.name} joined room ${client.room}`
      })
    );
  });
};

exports.someoneTyping = (client, socket) => {
  return new Promise((resolve, reject) => {
    resolve(
      socket.to(client.room).emit("someoneistyping", {
        from: socket.name,
        room: client.room,
        color: socket.color
      })
    );
  });
};

exports.broadcastMessage = (client, io, socket) => {
  return new Promise((resolve, reject) => {
    socket.to(client.room).emit("stoptyping", {
      from: socket.name,
      room: client.room,
      color: socket.color
    });
    resolve(
      io.in(client.room).emit("newmessage", {
        from: socket.name,
        time: new Date(),
        room: client.room,
        color: socket.color,
        message: `${client.name} says: "${client.msg}"`
      })
    );
  });
};
