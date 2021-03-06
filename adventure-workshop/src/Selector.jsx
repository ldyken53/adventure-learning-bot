/* This example requires Tailwind CSS v2.0+ */
import { Fragment, Component } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { SelectorIcon } from "@heroicons/react/solid";

class Selector extends Component {
  classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  render() {
    const { selected, update, options } = this.props;
    return (
      <Listbox value={selected} onChange={update}>
        {({ open }) => (
          <>
            <div className="relative h-0">
              <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <span className="flex items-center">
                  <span className="ml-3 block truncate text-black text-2xl">
                    {selected === "Choose Route..."
                      ? "Choose Route..."
                      : options[selected].text.substring(0, 50) + "..."}
                  </span>
                </span>
                <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  static
                  className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                >
                  {Object.entries(this.props.options).map(([key, val], i) => (
                    <Listbox.Option
                      key={key}
                      className={({ active }) =>
                        this.classNames(
                          active ? "text-white bg-indigo-600" : "text-gray-900",
                          "cursor-default select-none relative py-2 pl-3 pr-9"
                        )
                      }
                      value={key}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={this.classNames(
                                selected ? "font-semibold" : "font-normal",
                                "ml-3 block truncate text-2xl"
                              )}
                            >
                              {val.text.substring(0, 50) + "..."}
                            </span>
                          </div>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    );
  }
}

export { Selector };
