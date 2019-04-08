import React from "react";
import { Grid } from "@material-ui/core";

export default props => {
  if (props.show) {
    const width = window.innerWidth;
    return (
        <div style={{ textAlign: "center" }}>
          <img src="/img/logo.png" style={{ width: width > 768 ? "50%" : '100%' }} />
        </div>
    );
  } else {
      return <React.Fragment/>
  }
};
