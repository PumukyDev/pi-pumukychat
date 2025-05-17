import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function UserPicker({ value, options, onSelect }) {
    const [selected, setSelected] = useState(value);
    const [query, setQuery] = useState("");

    const filteredPeople =
        query === ""
            ? options
            : options.filter((person) =>
                  person.name
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .includes(query.toLowerCase().replace(/\s+/g, ""))
              );

    const onSelected = (persons) => {
        setSelected(persons);
        onSelect(persons);
    };

    return (
        <>
            <Combobox value={selected} onChange={onSelected} multiple>
                <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:text-sm">
                        <Combobox.Input
                            className="input input-bordered w-full bg-base-300 text-base-content border-base-300 focus:border-primary focus:ring-primary"
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

                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}
                    >
                        <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-base-200 text-base-content py-1 shadow-lg ring-1 ring-base-300 focus:outline-none sm:text-sm">
                            {filteredPeople.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none px-4 py-2 text-base-content/60">
                                    Nothing found.
                                </div>
                            ) : (
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
                                                <span
                                                    className={`block truncate ${
                                                        selected
                                                            ? "font-medium"
                                                            : "font-normal"
                                                    }`}
                                                >
                                                    {person.name}
                                                </span>
                                                {selected && (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                                        <CheckIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>

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
