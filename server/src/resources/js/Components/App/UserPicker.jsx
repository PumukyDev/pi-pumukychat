import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function UserPicker({ value, options, onSelect }) {
    // Local state for selected users and search query
    const [selected, setSelected] = useState(value);
    const [query, setQuery] = useState("");

    // Filter users based on search query
    const filteredPeople =
        query === ""
            ? options
            : options.filter((person) =>
                  person.name
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .includes(query.toLowerCase().replace(/\s+/g, ""))
              );

    // Update selection and notify parent component
    const onSelected = (persons) => {
        setSelected(persons);
        onSelect(persons);
    };

    return (
        <>
            {/* Combobox allows multiple user selection */}
            <Combobox value={selected} onChange={onSelected} multiple>
                <div className="relative mt-1">
                    {/* Input field with dropdown icon */}
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:text-sm">
                        <Combobox.Input
                            className="border border-base-300 bg-base-300 text-base-content focus:border-primary focus:ring-primary rounded-md shadow-sm mt-1 block w-full"
                            displayValue={(persons) =>
                                persons.length
                                    ? `${persons.length} users selected`
                                    : ""
                            }
                            placeholder="Select users..."
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-base-content/60"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>

                    {/* Dropdown with filtered users */}
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}
                    >
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-base-200 text-base-content py-1 shadow-lg ring-1 ring-base-300 focus:outline-none sm:text-sm">
                            {/* Show fallback if no match */}
                            {filteredPeople.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none px-4 py-2 text-base-content opacity-60">
                                    Nothing found.
                                </div>
                            ) : (
                                // Render filtered user list
                                filteredPeople.map((person) => (
                                    <Combobox.Option
                                        key={person.id}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                active
                                                    ? "bg-base-300 text-base-content"
                                                    : "text-base-content"
                                            }`
                                        }
                                        value={person}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                {/* User name with highlight if selected */}
                                                <span
                                                    className={`block truncate ${
                                                        selected
                                                            ? "font-medium"
                                                            : "font-normal"
                                                    }`}
                                                >
                                                    {person.name}
                                                </span>
                                                {/* Check icon for selected users */}
                                                {selected ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                                        <CheckIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>

            {/* Badge list showing selected users */}
            {selected && selected.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {selected.map((person) => (
                        <div
                            key={person.id}
                            className="badge badge-primary gap-2"
                        >
                            {person.name}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
