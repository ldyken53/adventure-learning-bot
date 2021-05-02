import React, { Component } from "react";
import { GenreOptions } from "./GenreOptions.jsx";
import { Link } from "react-router-dom";

class Start extends Component {
  render() {
    return (
      <div>
        <h1>
          Lets start with selecting what category this adventure will be under
        </h1>
        <h2>Please select one of the options below:</h2>
        <GenreOptions
          genre={this.props.genre}
          genres={this.props.genres}
          update={this.props.updateGenre}
        />
        <br />
        {this.props.genre !== "Pick A Genre..." ? (
          <Link
            className="bg-indigo-600 p-2 rounded-md"
            id="intro"
            to={"/intro"}
          >
            Go onto intro!
          </Link>
        ) : null}
      </div>
    );
  }
}

export { Start };
