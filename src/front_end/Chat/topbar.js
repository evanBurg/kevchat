import React from "react";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
const TopBar = props => {
  const onIconClicked = () => props.viewDialog(); // notify the parent
  return (
    <AppBar position="fixed" style={{marginBottom: 25}}>
      <Toolbar color="primary" title="Sample Toolbar">
        <Typography variant="h6" color="inherit" onClick={props.homeClick}>
          Kev Chat
        </Typography>
        <section style={{ height: 90, width: 90, marginLeft: "auto" }}>
          <IconButton onClick={onIconClicked}>
            <AccountCircle style={{ color: "white", height: 70, width: 70 }} />
          </IconButton>
        </section>
      </Toolbar>
    </AppBar>
  );
};
export default TopBar;
