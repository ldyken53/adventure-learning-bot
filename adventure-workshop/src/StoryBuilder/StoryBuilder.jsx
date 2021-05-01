import React, { Component, useContext } from "react";
// import { Link } from "react-router-dom";

const STORY_TEMPLATE = {
  genre_id: "uuid",
  name: "",
  description: "",
  creator: "",
  paths: [],
};

const PATH_TEMPLATE = {
  text: "",
  embeds: {},
  options: [],
};

const START_PATH_CARD_ID = "00000000-0000-0000-0000-000000000000";

const PathCardsContext = React.createContext([]);

class StoryBuilder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paths: { [START_PATH_CARD_ID]: { ...PATH_TEMPLATE } },
    };
  }

  addPath = (path) => {
    this.setState({ paths: [...this.state.paths, path] });
  };

  removePath = (index) => {
    const newPaths = [...this.state.paths];
    newPaths.splice(index, 1);
    this.setState({ paths: newPaths });
  };

  updatePath = (path, index) => {
    const newPaths = [...this.state.paths];
    newPaths.splice(index, 1, path);
    this.setState({ paths: newPaths });
  };

  render() {
    return (
      <div>
        Howdy
        <PathCardsContext.Provider value={this.state.paths}>
          {Object.entries(this.state.paths).map(([id, path], i) => (
            <PathCard
              index={i}
              path={path}
              setPath={(path) => this.updatePath(path, i)}
            />
          ))}
        </PathCardsContext.Provider>
        <button onClick={() => this.addPath({ ...PATH_TEMPLATE })}>
          Add Path Card
        </button>
      </div>
    );
  }
}

const PathCard = ({ index, path, updatePath, removeSelf }) => {
  return (
    <div className="bg-blue-300 p-2 my-2 rounded-xl">
      <h2>Story Card {index}</h2>
      <label>Message</label>
      <input
        value={path.text}
        onChange={(e) => updatePath({ ...path, text: e.target.value })}
      />
      <label className="text-grey">Embeds (Coming Soon)</label>
      <input
        disabled
        onChange={(e) => updatePath({ ...path, embeds: e.target.value })}
      />
      {path.options.map((option, i) => (
        <PathLink
          index={i}
          link={option}
          setLink={(link) => {
            const newOptions = [...path.options];
            newOptions.splice(i, 1, link);
            updatePath({ ...path, options: newOptions });
          }}
        />
      ))}
    </div>
  );
};

const PathLink = ({ index, link, setLink }) => {
  const existingPaths = useContext(PathCardsContext);

  return (
    <div className="flex-row">
      <label>Text:</label>
      <input
        value={link.text}
        onChange={(e) => setLink({ ...link, text: e.target.value })}
      />
      <label>Goes to:</label>
      {/* TODO: select component from all the existing path indexes */}
      <input type="select">{/* {()} */}</input>
    </div>
  );
};

export { StoryBuilder };
