import React, { Component } from "react";
import { Link } from "react-router-dom";

class Intro extends Component {
  constructor(props) {
    super(props);
    this.displayForm = this.displayForm.bind(this);
    this.displayDesc = this.displayDesc.bind(this);
    this.displayLink = this.displayLink.bind(this);
  }

  displayForm() {
    const { genre, name, updateTitle } = this.props;
    return genre !== "" ? (
      <>
        <div className="py-2">
          <label
            htmlFor="name"
            className="block p-2 text-3xl font-medium text-white"
          >
            What's the catchy name for your adventure?:
          </label>
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={updateTitle}
              className="text-black text-3xl focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 border-gray-300 rounded-md"
              // eslint-disable-next-line
              placeholder={"The Greatest" + (" " + genre) + " Adventure"}
            />
          </div>
        </div>
        {this.displayDesc()}
      </>
    ) : (
      <div className="p-3">
        <h1 className="p-3">Missing Genre!</h1>
        <Link className="bg-indigo-600 p-2 rounded-md" id="start" to={"/start"}>
          Click here to choose a genre
        </Link>
      </div>
    );
  }
  displayDesc() {
    const { genre, name, description, updateDesc } = this.props;
    return name !== "" ? (
      <div className="py-1">
        <label
          htmlFor="desc"
          className="block p-2 text-3xl font-medium text-white"
        >
          What's a good description of your adventure?:
        </label>
        <div className="mb-8 relative rounded-md shadow-sm">
          <input
            type="text"
            name="desc"
            id="desc"
            value={description}
            onChange={updateDesc}
            className="text-black text-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 border-gray-300 rounded-md"
            placeholder={
              // eslint-disable-next-line
              "A guided tour into the field of" + (" " + genre) + " ..."
            }
          />
        </div>
        {this.displayLink()}
      </div>
    ) : null;
  }

  displayLink() {
    const { description } = this.props;
    return description !== "" ? (
      <Link
        className="p-3 bg-indigo-600 p-2 rounded-md"
        id="story-builder"
        to={"/story-builder"}
      >
        Let's Make a Story!
      </Link>
    ) : null;
  }

  render() {
    return <div>{this.displayForm()}</div>;
  }
}

export { Intro };
