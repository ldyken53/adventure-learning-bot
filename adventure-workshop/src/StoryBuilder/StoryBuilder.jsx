import React, { Component, useContext } from "react";
import { v4 as uuid4 } from "uuid";
import { Selector } from "../Selector.jsx";
import { FaRegTrashAlt } from "react-icons/fa";
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
    console.log(key);
    this.setState({ paths: newPaths });
  };

  render() {
    return (
      <div className="w-3/4">
        <PathCardsContext.Provider value={this.state.paths}>
          {Object.entries(this.state.paths).map(([obj_key, path], i) => (
            <PathCard
              key={i}
              obj_key={obj_key}
              path={path}
              setPath={(path) => {
                this.updatePath(path, obj_key);
              }}
              delSelf={() => this.removePath(obj_key)}
            />
          ))}
        </PathCardsContext.Provider>
        <button
          className="shadow bg-blue-700 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          onClick={() => this.addPath({ ...PATH_TEMPLATE })}
        >
          Add Path Card
        </button>
      </div>
    );
  }
}

const PathCard = ({ obj_key, path, setPath, delSelf }) => {
  return (
    <div className="bg-indigo-800 p-2 my-2 rounded-xl flex flex-col">
      <div className="flex flex-row justify-between">
        <h2>
          Story Card <label className="text-sm">{obj_key}</label>
        </h2>
        {obj_key !== START_PATH_CARD_ID ? (
          <button className="bg-red-600 rounded px-2" onClick={() => delSelf()}>
            <FaRegTrashAlt />
          </button>
        ) : null}
      </div>
      <div className="p-1 grid grid-cols-4 gap-2">
        <label className="p-1 place-self-center">Message</label>
        <textarea
          className="text-black resize-none border rounded-md w-full col-span-3 place-self-center"
          value={path.text}
          onChange={(e) => setPath({ ...path, text: e.target.value }, obj_key)}
        />
      </div>
      <div className="p-1 grid grid-cols-4 gap-2">
        <label className="text-grey p-1 text-base">Embeds (Coming Soon)</label>
        <textarea
          className="text-black h-6 bg-gray-300 resize-none border rounded-md w-full col-span-3 place-self-center"
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
    <div className="grid grid-cols-10 gap-1 px-2 py-1 my-1 bg-blue-500 rounded">
      <div className="col-span-6 place-self-stretch">
        <div className="h-full">
          <textarea
            placeholder="Fancy transition message to the next story element..."
            className="text-black resize-none border rounded-md w-full h-full"
            value={link.text}
            onChange={(e) => setLink({ ...link, text: e.target.value })}
          />
        </div>
      </div>
      <div className="col-span-3">
        <div className="">
          <Selector
            selected={link.dest === "" ? "Choose Route..." : link.dest}
            options={existingPaths}
            update={(e) => setLink({ ...link, dest: e })}
          />
        </div>
      </div>
      <button
        className="bg-red-600 rounded p-1 place-self-center"
        onClick={() => delLink()}
      >
        <FaRegTrashAlt />
      </button>
    </div>
  );
};

export { StoryBuilder };
