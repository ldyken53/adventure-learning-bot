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
      genre: null,
      genres: [],
      name: "",
      description: "",
      creator: "",
    };
    this.updateGenre = this.updateGenre.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.updateDesc = this.updateDesc.bind(this);
    this.updateCreator = this.updateCreator.bind(this);
  }

  updateGenre(g) {
    this.setState({ genre: g });
  }
  updateCreator(event) {
    this.setState({ creator: event.target.value });
  }
  updateTitle(event) {
    this.setState({ name: event.target.value });
  }
  updateDesc(event) {
    this.setState({ description: event.target.value });
  }

  componentDidMount() {
    fetch("https://adventure-api-57rkjmf5la-uc.a.run.app/get-genres")
      .then((res) => res.json())
      .then((json) => this.setState({ genres: json }));
  }

  render() {
    const {
      genre,
      name,
      description,
      genres,
      creator,
    } = this.state;
    return (
      <Router basename="/">
        <div className="App">
          <header className="App-header">
            <div className="grid grid-rows-2">
              {genre ? <label>{"Genre: " + genre.name}</label> : null}
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
                    genre={genre}
                    genres={genres}
                  />
                )}
              />
              <Route
                exact
                key="intro"
                path="/intro"
                render={(props) => (
                  <Intro
                    genre={genre}
                    name={name}
                    description={description}
                    creator={creator}
                    updateTitle={this.updateTitle}
                    updateDesc={this.updateDesc}
                    updateCreator={this.updateCreator}
                  />
                )}
              />
              <Route
                exact
                key="story-builder"
                path="/story-builder"
                render={(props) => (
                  <StoryBuilder
                    name={name}
                    description={description}
                    genre={genre.id}
                    creator={creator}
                  />
                )}
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
