import React from "react";
import ReactDOM from "react-dom";
import Chat from "./Chat/chat";
require("babel-polyfill"); //Needed for async await for webpack/babel

ReactDOM.render(<Chat />, document.getElementById("react-root"));
