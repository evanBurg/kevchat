import React, { Component } from "react";
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
import theme from "../../../theme";
import "./chat.css";
import Message from "./msg";
import TopBar from "./topbar";
import SelectWrapped from "../Select/CreateSelectWrapped";

const defaultState = {
  messages: [],
  users: [],
  chatName: "",
  roomName: "",
  msg: "",
  isTyping: false,
  nameExists: false,
  hideJoinObjects: false,
  rooms: [],
  open: false
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
    socket.on("newmessage", this.addMessage);
    socket.on("rooms", this.setRooms);
    socket.on("users", this.setUsers);

    this.state = {
      socket: socket,
      messages: [],
      users: [],
      chatName: "",
      roomName: "",
      msg: "",
      isTyping: false,
      whoIsTyping: [],
      nameExists: false,
      hideJoinObjects: false,
      rooms: [],
      open: false
    };
  }

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

  isScrolledIntoView = (el) => {
    let rect = el.getBoundingClientRect();
    let elemTop = rect.top;
    let elemBottom = rect.bottom;

    let isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);

    return isVisible;
}

  // handler for send message button
  handleSendMessage = e => {
    e.preventDefault();
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
  };

  handleOpenDialog = () => {
    this.state.socket.emit("getusers");
    this.setState({ open: true });
  };
  handleCloseDialog = () => this.setState({ open: false });
  scrollToFinal = () => {
    let userDOM = ReactDOM.findDOMNode(document.getElementsByClassName("final")[0]);
    userDOM.scrollIntoView({ alignToTop: false, scrollIntoViewOptions: {block: "end", inline: "nearest"} });
    userDOM.blur();
  }

  newMessageComponent = () => {
    return <Typography onClick={this.scrollToFinal} style={{color: 'white', padding: 25, borderRadius: 30, position: "fixed", display: 'block', width: "93%", top: 95, height: 50, backgroundColor: "rgb(38, 50, 56)" }} variant="subtitle2">
      New Message <ArrowDown/>
    </Typography>
  }

  render() {
    const { messages, chatName, hideJoinObjects, msg } = this.state;
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
            <Card>
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
                bottom: -5,
                left: 0,
                width: "100%",
                padding: 10,
                height: 60,
                zIndex: 20,
                backgroundColor: "white"
              }}
            >
              <Grid container spacing={24}>
                <Grid item xs={8}>
                  <TextField
                    onChange={this.onMessageChange}
                    placeholder="type something here"
                    autoFocus={true}
                    required
                    helperText={
                      this.state.whoIsTyping.length > 0
                        ? this.state.whoIsTyping.map(user => user.from).join(", ") + (this.state.whoIsTyping.length > 1 ? " are typing" : " is typing")
                        : undefined
                    }
                    value={msg}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button
                    style={{ marginTop: 12 }}
                    onClick={this.handleSendMessage}
                    color="primary"
                    variant="contained"
                    disabled={msg.length < 1}
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}

          <List
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
          {this.isScrolledIntoView(document.getElementsByClassName("final-message"[0])) ? this.newMessageComponent() : "" }
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Chat;
