import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { Start } from "./Start.jsx";
import { Intro } from "./Intro.jsx";
import { StoryBuilder } from "./StoryBuilder/StoryBuilder.jsx";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genre: "Pick A Genre...",
      name: "",
      description: "",
    };
    this.updateGenre = this.updateGenre.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.updateDesc = this.updateDesc.bind(this);
  }

  updateGenre(g) {
    this.setState({ genre: g.name });
  }

  updateTitle(event) {
    this.setState({ name: event.target.value });
  }
  updateDesc(event) {
    this.setState({ description: event.target.value });
  }

  render() {
    const { genre, name } = this.state;
    return (
      <Router basename="/">
        <div className="App">
          <header className="App-header">
            <div className="grid grid-rows-2">
              {genre !== "Pick A Genre..." ? (
                <label>{"Genre: " + genre}</label>
              ) : null}
              {name !== "" ? <label>{"Title: " + name}</label> : null}
            </div>
            <Switch>
              <Route
                exact
                key="home"
                path="/home"
                render={() => (
                  <>
                    <p>Welcome to Learn-A-Bot's Adventure Workshop!</p>
                    <Link
                      className="bg-indigo-600 p-2 rounded-md"
                      id="start-button"
                      to={"/start"}
                    >
                      Begin Creating Your New Adventure
                    </Link>
                  </>
                )}
              />
              <Route
                exact
                key="start"
                path="/start"
                render={(props) => (
                  <Start
                    updateGenre={this.updateGenre}
                    genre={this.state.genre}
                  />
                )}
              />
              <Route
                exact
                key="intro"
                path="/intro"
                render={(props) => (
                  <Intro
                    genre={this.state.genre}
                    name={this.state.name}
                    description={this.state.description}
                    updateTitle={this.updateTitle}
                    updateDesc={this.updateDesc}
                  />
                )}
              />
              <Route
                exact
                key="story-builder"
                path="/story-builder"
                render={(props) => <StoryBuilder />}
              />
              <Redirect to="/home" />
            </Switch>
          </header>
        </div>
      </Router>
    );
  }
}

export { App };
