import React, { Component, useContext } from "react";
import { v4 as uuid4 } from "uuid";
import { Selector } from "../Selector.jsx";
// import { Link } from "react-router-dom";

// const STORY_TEMPLATE = {
//   genre_id: "uuid",
//   name: "",
//   description: "",
//   creator: "",
//   paths: {},
// };

const PATH_TEMPLATE = {
  text: "",
  embeds: {},
  options: [],
};

const LINK_TEMPLATE = {
  text: "",
  dest: "",
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

  removeLink = (key, index) => {
    const newPaths = { ...this.state.paths };
    const relavantPath = newPaths[key];
    relavantPath.options.splice(index, 1);
    newPaths[key] = relavantPath;
    this.setState({ paths: newPaths });
  };

  updatePath = (path, key) => {
    const newPaths = { ...this.state.paths };
    newPaths[key] = path;
    console.log(path);
    console.log(key)
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
              setPath={(path) => {
                this.updatePath(path, obj_key);
              }}
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
    <div className="bg-blue-300 p-2 my-2 rounded-xl flex flex-col">
      <h2>Story Card {obj_key}</h2>
      <div className="p-1 w-max flex-row">
        <label className="p-1">Message</label>
        <input
          className="text-black"
          value={path.text}
          onChange={(e) => setPath({ ...path, text: e.target.value }, obj_key)}
        />
      </div>
      <div className="p-1 flex-row">
        <label className="text-grey p-1">Embeds (Coming Soon)</label>
        <input
          disabled
          onChange={(e) =>
            setPath({ ...path, embeds: e.target.value }, obj_key)
          }
        />
      </div>
      <div className="p-1 flex-col">
        {path.options.map((option, i) => (
          <PathLink
            key={i}
            index={i}
            link={option}
            setLink={(link) => {
              const newOptions = [...path.options];
              newOptions.splice(i, 1, link);
              setPath({ ...path, options: newOptions });
            }}
            delLink={() => {
              const newOptions = [...path.options];
              newOptions.splice(i, 1);
              setPath({ ...path, options: newOptions });
            }}
          />
        ))}
        <button
          className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          onClick={() =>
            setPath({ ...path, options: [...path.options, LINK_TEMPLATE] })
          }
        >
          Add Link
        </button>
      </div>
    </div>
  );
};

const PathLink = ({ index, link, setLink, delLink }) => {
  const existingPaths = useContext(PathCardsContext);
  return (
    <div className="flex flex-row p-2 bg-blue-500 rounded">
      <div className="flex-column w-1/2">
        <label>Text:</label>
        <div className="md:w-auto">
          <input
            className="text-black"
            value={link.text}
            onChange={(e) => setLink({ ...link, text: e.target.value })}
          />
        </div>
      </div>
      <div className="flex-column w-1/2">
        <label>Goes to:</label>
        <div className="md:w-auto">
          <Selector
            selected={link.dest === "" ? "Choose Route..." : link.dest}
            options={existingPaths}
            update={(e) => setLink({ ...link, dest: e })}
          />
        </div>
      </div>
      <button onClick={() => delLink()}>Remove Link</button>
    </div>
  );
};

export { StoryBuilder };
