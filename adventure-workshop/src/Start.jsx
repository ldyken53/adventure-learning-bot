import React, { Component } from "react";
import { GenreOptions } from "./GenreOptions.js";

class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <h1>
          Lets start with selecting what category this adventure will be under
        </h1>
        <h2>Please select one of the options below:</h2>
        <GenreOptions />
      </div>
    );
  }
}

export { Start };
