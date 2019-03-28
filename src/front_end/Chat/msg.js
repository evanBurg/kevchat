import React from "react";
import ReactDOM from "react-dom";
import { Typography, ListItem, Collapse } from "@material-ui/core";
class Msg extends React.Component {
  state = {
    open: false
  };
  componentDidMount = () => {
    let userDOM = ReactDOM.findDOMNode(this);
    userDOM.scrollIntoView({ block: "end", behavior: "smooth" });
    userDOM.blur();
  };
  render() {
    let { message, mine, last } = this.props;
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
            (mine ? "mine " : "yours ") + "message" + (last ? " last" : "")
          }
          style={{ color: "white", background: message.color }}
        >
          {message.message}
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
