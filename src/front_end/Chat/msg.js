import React from "react";
import { Typography, ListItem, Collapse } from "@material-ui/core";
import isImageUrl from "is-image-url";
class Msg extends React.Component {
  state = {
    open: false
  };

  linkify = text => {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    let matches = [...text.match(urlRegex)];
    
    debugger;
    matches = matches.map(url => {
      if (!isImageUrl(url)) {
        return <React.Fragment><br/><a target="_blank" style={{clear: "both", color: 'white'}} href={url}> {url} </a></React.Fragment>;
      } else {
        return <a target="_blank" href={url}> <img style={{clear: "both"}} width="80%" src={url}></img> </a>;
      }
    });
    return [text, ...matches]
  };

  render() {
    let { message, mine, last, final } = this.props;
    return (
      <ListItem
        style={{
          width: "unset",
          display: "unset",
          paddingTop: "unset",
          paddingBottom: "unset"
        }}
      >
        <Typography
          onClick={() => this.setState({ open: !this.state.open })}
          variant="body1"
          className={
            (mine ? "mine " : "yours ") +
            "message" +
            (last ? " last" : "") +
            (final ? " final-message" : "")
          }
          style={{ color: "white", background: message.color }}
        >
          {message.from === "admin" ? (
            <i>{message.message}</i>
          ) : (
            this.linkify(message.message)
          )}
          {message.invite && (
            <i>
              {" "}
              <a style={{ color: "white" }} href={`/?room=${message.room}`}>
                Copy this!
              </a>
            </i>
          )}
        </Typography>
        <div className={mine ? "mine details" : "yours details"}>
          <Collapse in={this.state.open}>
            <Typography
              variant="caption"
              style={{ color: "rgba(0, 0, 0, 0.57)" }}
            >
              @{new Date(message.time).toLocaleTimeString("en-US")} | [Room:{" "}
              {message.room}] [User: {message.from}]
            </Typography>
          </Collapse>
        </div>
      </ListItem>
    );
  }
}
export default Msg;
