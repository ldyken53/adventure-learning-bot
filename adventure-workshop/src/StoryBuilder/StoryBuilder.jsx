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

  exportStory() {
    const { name, description, genre } = this.props;
    return {
      genre_id: genre,
      name: name,
      description: description,
      paths: this.state.paths,
    };
  }

  postStory() {
    fetch("https://adventure-api-57rkjmf5la-uc.a.run.app/add-adventure", {
      method: "POST",
      body: JSON.stringify(this.exportStory()),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(console.log);
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
    const relevantPath = newPaths[key];
    relevantPath.options.splice(index, 1);
    newPaths[key] = relevantPath;
    this.setState({ paths: newPaths });
  };

  updatePath = (path, key) => {
    const newPaths = { ...this.state.paths };
    newPaths[key] = path;
    this.setState({ paths: newPaths });
  };

  render() {
    return (
      <div className="w-3/4 text-black">
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
          className="shadow p-1 m-1 text-2xl bg-indigo-600 hover:bg-indigo-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          onClick={() => this.addPath({ ...PATH_TEMPLATE })}
        >
          Add Path Card
        </button>

        <button
          className="shadow p-1 m-1 text-2xl bg-indigo-600 hover:bg-indigo-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          onClick={() => console.log(this.exportStory())}
        >
          Dump Story to Console
        </button>
        <button
          className="shadow p-1 m-1 text-2xl bg-indigo-600 hover:bg-indigo-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          onClick={() => this.postStory()}
        >
          POST Story
        </button>
      </div>
    );
  }
}

const PathCard = ({ obj_key, path, setPath, delSelf }) => {
  return (
    <div className="bg-white p-2 my-2 rounded-xl flex flex-col">
      <div className="flex flex-row justify-between">
        <h2>Story Card</h2>
        {obj_key !== START_PATH_CARD_ID ? (
          <button className="rounded px-2" onClick={() => delSelf()}>
            <FaRegTrashAlt />
          </button>
        ) : null}
      </div>
      <div className="p-1 grid grid-cols-4 gap-2">
        <label className="p-1 place-self-center">Message</label>
        <textarea
          className="text-black bg-mint-green resize-none border rounded-md w-full col-span-3 place-self-center"
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
          className="shadow text-2xl bg-indigo-600 hover:bg-indigo-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
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
    <div className="grid grid-cols-10 gap-1 p-2 my-1 bg-gray-300 rounded-md">
      <textarea
        placeholder="Fancy transition message to the next story element..."
        className="col-span-6 text-black resize-none border rounded-md w-full min-h-0 h-14 align-middle"
        value={link.text}
        onChange={(e) => setLink({ ...link, text: e.target.value })}
      />
      <div className="col-span-3 h-0">
        <Selector
          selected={link.dest === "" ? "Choose Route..." : link.dest}
          options={existingPaths}
          update={(e) => setLink({ ...link, dest: e })}
        />
      </div>
      <button
        className=" rounded p-1 place-self-center"
        onClick={() => delLink()}
      >
        <FaRegTrashAlt />
      </button>
    </div>
  );
};

export { StoryBuilder };
