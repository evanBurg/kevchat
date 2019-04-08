import React from "react";
import { Grid } from "@material-ui/core";

export default props => {
  if (props.show) {
    return (
      <Grid container spacing={24} justify="center" alignItems="center">
        <Grid item xs={2} style={{ textAlign: "center" }}>
          <img src="/img/logo.png" style={{ width: "50%" }} />
        </Grid>
      </Grid>
    );
  } else {
      return <React.Fragment/>
  }
};
