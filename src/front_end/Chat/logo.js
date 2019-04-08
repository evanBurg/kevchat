import React from "react";
import { Grid } from "@material-ui/core";

export default props => {
  if (props.show) {
    const width = window.innerWidth;
    return (
      <Grid container spacing={24} justify="center" alignItems="center">
        <Grid item xs={2} style={{ textAlign: "center" }}>
          <img src="/img/logo.png" style={{ width: width > 768 ? "50%" : '100%' }} />
        </Grid>
      </Grid>
    );
  } else {
      return <React.Fragment/>
  }
};
