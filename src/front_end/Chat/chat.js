import React, { Component } from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Card,
  Typography,
  Grid,
  CardContent,
  Dialog,
  DialogTitle,
  Collapse,
  Input,
  List,
  Paper,
  DialogContent
} from "@material-ui/core";
import Face from "@material-ui/icons/Face";
import ArrowDown from "@material-ui/icons/ArrowDownward";
import Send from "@material-ui/icons/Send";
import theme from "../../../theme";
import "./chat.css";
import Message from "./msg";
import TopBar from "./topbar";
import SelectWrapped from "../Select/CreateSelectWrapped";

const defaultState = {
  messages: [],
  users: [],
  chatName: "",
  roomName: { label: "main", value: "main" },
  msg: "",
  isTyping: false,
  nameExists: false,
  hideJoinObjects: false,
  rooms: [],
  open: false,
  finalMessageNotInView: false
};

const cardStyleDesktop = {
  maxWidth: "58%",
  textAlign: "center",
  marginLeft: "auto",
  marginRight: "auto"
};

class Chat extends Component {
  constructor(props) {
    super(props);

    const socket = io.connect();
    socket.on("welcome", this.onWelcome);
    socket.on("someoneistyping", this.someoneTyping);
    socket.on("stoptyping", this.stopTyping);
    socket.on("nameexists", this.nameExists);
    socket.on("someonejoined", this.addMessage);
    socket.on("someoneleft", this.addMessage);
    socket.on("newmessage", this.newMessageReceived);
    socket.on("rooms", this.setRooms);
    socket.on("users", this.setUsers);
    socket.on("disconnect", this.leave);

    var urlParams = new URLSearchParams(window.location.search);

    this.state = {
      socket: socket,
      messages: [],
      users: [],
      chatName: "",
      roomName: urlParams.has("room")
        ? { label: urlParams.get("room"), value: urlParams.get("room") }
        : { label: "main", value: "main" },
      msg: "",
      isTyping: false,
      whoIsTyping: [],
      nameExists: false,
      hideJoinObjects: false,
      finalMessageNotInView: false,
      rooms: [],
      open: false
    };
  }

  // componentDidMount(){
  //   this.setState({
  //     onlineInterveral: setInterval(() => {
  //       fetch("/api/online").then((response) => {
  //         if(response != true){
  //           window.location = "/offline.html"
  //         }
  //       })
  //     }, 35000)
  //   })
  // }

  newMessageReceived = data => {
    this.addMessage(data);
    //this.setState({
    //  finalMessageNotInView: this.finalMessageNotInView()
    //});
    this.scrollToFinal();
  };

  someoneTyping = data => {
    let { whoIsTyping } = this.state;
    if (!this.state.whoIsTyping.includes()) {
      whoIsTyping.push(data);
      this.setState({
        whoIsTyping
      });
    }
  };

  stopTyping = data => {
    let { whoIsTyping } = this.state;
    whoIsTyping = whoIsTyping.filter(user => {
      if (data.from === user.from) {
        return false;
      } else {
        return true;
      }
    });
    this.setState({
      whoIsTyping
    });
  };

  leave = () => {
    this.state.socket.emit("leave");
    this.setState(defaultState);
  };

  setRooms = rooms => {
    this.setState({
      rooms: rooms.map(room => {
        return { label: room, value: room };
      })
    });
  };

  onMessageChange = e => {
    this.setState({ msg: e.target.value });
    if (this.state.isTyping === false) {
      this.state.socket.emit("typing", {
        name: this.state.chatName,
        room: this.state.roomName.value
      });
      this.setState({ isTyping: true });
    }
  };

  setUsers = dataFromServer => {
    this.setState({ users: dataFromServer });
  };

  addMessage = dataFromServer => {
    this.setState(previousState => {
      let messages = [...previousState.messages];
      messages.push(dataFromServer);
      return { messages };
    });
  };

  onWelcome = dataFromServer => {
    this.addMessage(dataFromServer);
    this.setState({ hideJoinObjects: true });
  };

  nameExists = () => {
    this.setState({
      nameExists: true
    });
  };

  // handler for Join button click
  handleJoin = () => {
    this.setState({
      nameExists: false
    });
    this.state.socket.emit("join", {
      name: this.state.chatName,
      room: this.state.roomName.value
    });
  };
  // handler for name TextField entry
  onNameChange = e => {
    this.setState({ chatName: e.target.value });
  };

  onRoomChange = room => {
    this.setState({ roomName: room });
  };

  // handler for send message button
  handleSendMessage = e => {
    e.preventDefault();
    if (this.state.msg.length > 0 && this.state.msg !== "") {
      this.state.socket.emit(
        "message",
        {
          name: this.state.chatName,
          room: this.state.roomName.value,
          msg: this.state.msg
        },
        err => {}
      );
      this.setState({ msg: "", isTyping: false });
    }
  };

  handleOpenDialog = () => {
    this.state.socket.emit("getusers");
    this.setState({ open: true });
  };
  handleCloseDialog = () => this.setState({ open: false });

  finalMessageNotInView = () => {
    let el = document.getElementsByClassName("final-message")[0];
    var topOfPage =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
    var heightOfPage =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    var elY = 0;
    var elH = 0;
    if (document.layers) {
      elY = el.y;
      elH = el.height;
    } else {
      for (var p = el; p && p.tagName != "BODY"; p = p.offsetParent) {
        elY += p.offsetTop;
      }
      elH = el.offsetHeight;
    }
    if (topOfPage + heightOfPage < elY + elH) {
      return true;
    } else if (elY < topOfPage) {
      return true;
    } else {
      return false;
    }
  };

  scrollToFinal = () => {
    var objDiv = document.getElementById("message-container");
    objDiv.scrollTop = objDiv.scrollHeight;
    document
      .getElementsByClassName("final-message")[0]
      .scrollIntoView({ behavior: "smooth" });
    this.setState({
      finalMessageNotInView: false
    });
  };

  newMessageComponent = () => {
    if (this.state.finalMessageNotInView) {
      return (
        <Typography
          onClick={this.scrollToFinal}
          style={{
            color: "white",
            borderRadius: 30,
            padding: 8,
            textAlign: "center",
            position: "fixed",
            display: "block",
            paddingBottom: "unset",
            bottom: 95,
            zIndex: 40,
            right: 10,
            backgroundColor: "rgb(38, 50, 56)"
          }}
          variant="subtitle2"
        >
          <ArrowDown />
        </Typography>
      );
    } else {
      return <React.Fragment />;
    }
  };

  render() {
    const { messages, chatName, hideJoinObjects, msg } = this.state;
    const width = window.innerWidth;
    return (
      <MuiThemeProvider theme={theme}>
        <TopBar viewDialog={this.handleOpenDialog} homeClick={this.leave} />
        <Dialog
          open={this.state.open}
          onClose={this.handleCloseDialog}
          style={{ margin: 20 }}
        >
          <DialogTitle style={{ textAlign: "center" }}>
            ONLINE USERS
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={24}>
              {this.state.users.map(user => {
                return (
                  <React.Fragment>
                    <Grid item xs={2}>
                      <Face style={{ color: user.color }} />
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant="overline">
                        {user.name}{" "}
                        {this.state.chatName === user.name ? "(You)" : ""} [
                        {user.room}]
                      </Typography>
                    </Grid>
                  </React.Fragment>
                );
              })}
            </Grid>
          </DialogContent>
        </Dialog>
        <div style={{ marginTop: 110 }}>
          {!hideJoinObjects && (
            <Card style={width > 768 ? cardStyleDesktop : undefined}>
              <Typography
                style={{ marginTop: 10, textAlign: "center" }}
                variant="h5"
                component="h2"
              >
                Join a Room
              </Typography>
              <CardContent>
                <Grid container spacing={24}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      style={{ marginTop: 16 }}
                      onChange={this.onNameChange}
                      placeholder="Enter unique name"
                      autoFocus={true}
                      required
                      error={chatName.length < 3 || this.state.nameExists}
                      helperText={
                        this.state.nameExists
                          ? "Name already exists"
                          : undefined
                      }
                      value={chatName}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Input
                      fullWidth
                      inputComponent={SelectWrapped}
                      value={this.state.roomName}
                      onChange={this.onRoomChange}
                      placeholder="Room"
                      error={
                        !this.state.roomName
                          ? true
                          : !this.state.roomName.value
                          ? true
                          : false
                      }
                      inputProps={{
                        options: this.state.rooms
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      onClick={this.handleJoin}
                      disabled={
                        chatName.length < 3 ||
                        (!this.state.roomName
                          ? true
                          : !this.state.roomName.value
                          ? true
                          : this.state.roomName.value.length < 3)
                      }
                      color="primary"
                      variant="contained"
                      style={{ marginTop: "1em" }}
                    >
                      Join
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
          {hideJoinObjects && (
            <Paper
              style={{
                position: "fixed",
                bottom: "-5px",
                left: "0px",
                right: "0px",
                padding: "15px",
                height: "50px",
                zIndex: 20,
                backgroundColor: "white"
              }}
            >
              <Grid container spacing={24}>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    onChange={this.onMessageChange}
                    onKeyPress={ev => {
                      if (ev.key === "Enter") {
                        this.handleSendMessage(ev);
                      }
                    }}
                    placeholder="Send a message..."
                    autoFocus={true}
                    required
                    helperText={
                      this.state.whoIsTyping.length > 0
                        ? this.state.whoIsTyping
                            .map(user => user.from)
                            .join(", ") +
                          (this.state.whoIsTyping.length > 1
                            ? " are typing"
                            : " is typing")
                        : undefined
                    }
                    value={msg}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    onClick={this.handleSendMessage}
                    color="primary"
                    variant="contained"
                    disabled={msg.length < 1}
                  >
                    Send <Send style={{ marginLeft: 5 }} />
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}
          {hideJoinObjects && (
            <Typography
              style={{ textAlign: "center", width: "100%" }}
              variant="h4"
            >
              {this.state.roomName.value.toUpperCase()}
            </Typography>
          )}

          <List
            id="message-container"
            className="scenario-container messages"
            style={{ marginBottom: 70 }}
          >
            {messages.map((message, index) => {
              return (
                <Message
                  message={message}
                  mine={chatName === message.from}
                  last={
                    index + 1 < messages.length
                      ? messages[index + 1].from !== messages[index].from
                      : true
                  }
                  key={index}
                  final={index === messages.length - 1}
                />
              );
            })}
          </List>
          {hideJoinObjects && this.newMessageComponent()}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Chat;
