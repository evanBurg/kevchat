import React, { Component } from "react";
import { Grid, Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import Colour from 'sc-color'
import color from "@material-ui/core/colors/amber";

class ColourPicker extends Component {
  constructor(props) {
    super(props);
  }

  chooseColour = colour => {
    this.props.chooseColour(colour);
  };
  

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.props.toggle}>
        <DialogTitle>Choose a Colour</DialogTitle>
        <DialogContent>
          <Grid container spacing={8}>
            {this.props.colours.sort((left, right) => Colour(left).hue() - Colour(right).hue()).map(colour => {
              return (
                <Grid key={colour} item xs={1}>
                  <div
                    onClick={() => this.chooseColour(colour)}
                    style={{
                      backgroundColor: colour,
                      height: 25,
                      width: 25,
                      borderRadius: 25 / 2
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
      </Dialog>
    );
  }
}

export default ColourPicker;
