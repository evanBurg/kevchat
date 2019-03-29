import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Collapse from "@material-ui/core/Collapse";

class WebsitePreview extends Component {
  state = {
    loading: true,
    title: "",
    description: "",
    show: false,
    image: false,
    url: "",
    key: "5c9e7e53b48c958f5494e7f958bdb46d4f26821bf1106"
  };

  getData = async () => {
    this.setState({ loading: true });
    let response = await fetch(
      `https://api.linkpreview.net/?key=${this.state.key}&q=${this.props.url}`
    );
    if (response.ok) {
      response = await response.json();
      this.setState(response);
      this.setState({ loading: false });
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.url !== this.props.url || this.state !== nextState;
  }

  getImg = () => {
    if (this.state.image != false && this.state.image != "") {
      return (
        <CardMedia
          style={{ height: 140 }}
          image={this.state.image.replace(/^http:\/\//i, "https://")}
          title={this.state.title}
        />
      );
    } else {
      return <React.Fragment />;
    }
  };

  render() {
    return (
      <React.Fragment>
        <Button variant="outline" onClick={async () => {
          let show = !this.state.show;
          this.setState({show})
          if(show){
            this.getData();
          }
        }} color="primary" style={{color: 'white'}} fullWidth>Link Preview</Button>
        <Collapse in={!this.state.loading && this.state.show}>
          <Card style={{ maxWidth: 440 }}>
            <CardActionArea>
              {this.getImg()}
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {this.state.title}
                </Typography>
                <Typography component="p">{this.state.description}</Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <a
                style={{ textDecoration: "none" }}
                target="_blank"
                href={this.props.url}
              >
                <Button size="small" color="primary">
                  Go
                </Button>
              </a>
            </CardActions>
          </Card>
        </Collapse>
      </React.Fragment>
    );
  }
}

export default WebsitePreview;
