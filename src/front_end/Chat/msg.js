import React from "react";
import { Typography, ListItem, Collapse } from "@material-ui/core";
import PriorityHigh from "@material-ui/icons/PriorityHigh";
class Msg extends React.Component {
  state = {
    open: false
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
            (mine ? "mine " : "yours ") + "message" + (last ? " last" : "") + (final ? " final-message" : "")
          }
          style={{ color: "white", background: message.color }}
        >
          {message.message} {" "} {message.from == "admin" ? <PriorityHigh/> : ""}
        </Typography>
        <div className={mine ? "mine details" : "yours details"}>
          <Collapse in={this.state.open}>
            <Typography variant="caption" style={{color: 'rgba(0, 0, 0, 0.57)'}}>
              @{new Date(message.time).toLocaleTimeString("en-US")} | [Room: {message.room}] [User: {message.from}]
            </Typography>
          </Collapse>
        </div>
      </ListItem>
    );
  }
}
export default Msg;
