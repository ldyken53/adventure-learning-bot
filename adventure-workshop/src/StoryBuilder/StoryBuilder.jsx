import React, { Component, useContext } from "react";
import { v4 as uuid4 } from "uuid";
import { Selector } from "../Selector.jsx";
// import { Link } from "react-router-dom";

const STORY_TEMPLATE = {
  genre_id: "uuid",
  name: "",
  description: "",
  creator: "",
  paths: {},
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
    this.setState({ paths: { ...this.state.paths, [uuid4()]: path } });
  };

  removePath = (key) => {
    const newPaths = { ...this.state.paths };
    delete newPaths[key];
    this.setState({ paths: newPaths });
  };

  updatePath = (path, key) => {
    const newPaths = { ...this.state.paths };
    newPaths[key] = path;
    this.setState({ paths: newPaths });
  };

  render() {
    return (
      <div>
        <PathCardsContext.Provider value={this.state.paths}>
          {Object.entries(this.state.paths).map(([obj_key, path], i) => (
            <PathCard
              key={i}
              obj_key={obj_key}
              path={path}
              setPath={(path) => this.updatePath(path, obj_key)}
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

const PathCard = ({ obj_key, path, setPath }) => {
  return (
    <div className="bg-blue-300 p-2 my-2 rounded-xl flex-row">
      <h2>Story Card {obj_key}</h2>
      <div className="p-1 flex-column w-max">
        <label className="p-1">Message</label>
        <input
          className="w-max text-black"
          value={path.text}
          onChange={(e) => setPath({ ...path, text: e.target.value }, obj_key)}
        />
      </div>
      <div className="p-1">
        <label className="text-grey p-1">Embeds (Coming Soon)</label>
        <input
          disabled
          onChange={(e) =>
            setPath({ ...path, embeds: e.target.value }, obj_key)
          }
        />
      </div>
      <div className="p-1">
        {path.options.map((option, i) => (
          <PathLink
            index={i}
            link={option}
            setLink={(link) => {
              const newOptions = [...path.options];
              newOptions.splice(i, 1, link);
              setPath({ ...path, options: newOptions });
            }}
          />
        ))}
      </div>
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
      {/* TODO: select component from all the existing path keys */}
      <input type="select">{/* {()} */}</input>
      <Selector
        selected="Choose Route..."
        options={existingPaths}
        update={(e) => setLink({ ...link, dest: e.value })}
      />
    </div>
  );
};

export { StoryBuilder };
