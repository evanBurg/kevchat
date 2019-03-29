import React from "react";
import { Typography, ListItem, Collapse } from "@material-ui/core";
import isImageUrl from "is-image-url";
import WebsitePreview from "./websitepreview";
class Msg extends React.Component {
  state = {
    open: false,
    imageExpanded: false
  };

  linkify = text => {
    let { message, mine, last, final } = this.props;
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    let matches = [];
    if (urlRegex.test(text)) matches = [...text.match(urlRegex)];

    matches = matches.map(url => {
      if (!isImageUrl(url)) {
        return (
          <React.Fragment key={"preview-url-" + url + "-" + new Date()}>
            <br />
            <WebsitePreview url={url} />
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment key={"preview-image-url-" + url + "-" + new Date()}>
            <br />
            <img
              onClick={() =>
                this.setState({ imageExpanded: !this.state.imageExpanded })
              }
              style={{ clear: "both" }}
              width={this.state.imageExpanded ? "100%" : "450px"}
              src={url}
            />
          </React.Fragment>
        );
      }
    });

    text = (
      <Typography
        key={"message-text-" + JSON.stringify(message) + "-" + new Date()}
        onClick={() => this.setState({ open: !this.state.open })}
        variant="body1"
        style={{ color: "white" }}
      >
        {message.from === "admin" ? <i>{message.message}</i> : text}
        {message.invite && (
          <i>
            {" "}
            <a style={{ color: "white" }} href={`/?room=${message.room}`}>
              Copy this!
            </a>
          </i>
        )}
      </Typography>
    );

    return [text, ...matches];
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
        <div
          className={
            (mine ? "mine " : "yours ") +
            "message" +
            (last ? " last" : "") +
            (final ? " final-message" : "")
          }
          style={{
            background: message.color
          }}
        >
          {this.linkify(message.message)}
        </div>

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
