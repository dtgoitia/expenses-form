import { unreachable } from "../lib/devex";
import { assessSetOverlap, intersect, union } from "../lib/setOperations";
import { useEffect, useRef, useState } from "react";

const EMPTY_STRING = "";
export type Choice = string;

interface Props {
  id?: string;
  /** Currently selected choices. */
  value: Choice[];
  placeholder?: string;
  /** All possible choices. */
  choices: Choice[];
  onChange: (selected: Choice[]) => void;
  /** If `true`, allow user to create a new choice when no choices match the query. */
  allowChoiceCreation?: boolean;
  className?: string;
}

export function MultipleChoice({
  id,
  value,
  placeholder,
  choices,
  onChange: handleChange,
  allowChoiceCreation: maybeAllowChoiceCreation,
  className,
}: Props) {
  const allowChoiceCreation =
    maybeAllowChoiceCreation === undefined ? true : maybeAllowChoiceCreation;

  const [searchValue, setSearchValue] = useState<string>(EMPTY_STRING);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const notChosen: Choice[] = choices.filter((choice) => !value.includes(choice));
  const toChoose: Choice[] = notChosen.filter((choice) =>
    choice.toLowerCase().includes(searchValue.toLowerCase())
  );

  const state = validateState({ chosen: value, notChosen, toChoose, all: choices });

  // the outermost DOM element of the component - used to determine if the user
  // has clicked outside of the component
  const ref = useRef(null);

  let containerCss =
    "relative" +
    " text-sm" +
    " text-gray-700  dark:text-gray-200" +
    "   bg-gray-100    dark:bg-gray-700" +
    " p-3" +
    " has-[input:focus]:border-t  border-t-blue-300  dark:has-[input:focus]:border-t-blue-300" +
    " has-[input:focus]:border-l  border-l-blue-300  dark:has-[input:focus]:border-l-blue-300" +
    " has-[input:focus]:border-r  border-r-blue-300  dark:has-[input:focus]:border-r-blue-300" +
    " group" + // child elements are linked so that other elements can style using the group focus, etc.
    " rounded" +
    " has-[input:focus]:rounded-b-none" +
    " appearance-none" +
    " leading-tight";

  if (className) {
    containerCss += ` ${className}`;
  }

  const searchBoxCss =
    " text-sm" +
    " text-gray-700  dark:text-gray-200" +
    "   bg-gray-100    dark:bg-gray-700" +
    " rounded" +
    " appearance-none" +
    " leading-tight focus:outline-none focus:shadow-outline";

  function unfoldDropdown(): void {
    setIsOpen(true);
  }

  function collapseDropdown(): void {
    setIsOpen(false);
  }

  /**
   * Collapse dropdown when user clicks outside the component.
   * https://stackoverflow.com/a/47558335/8038693
   *
   * onBlur was not an option because it collapsed if user switched
   * apps/windows
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      const clickInside = event
        .composedPath()
        .includes(ref.current as unknown as EventTarget);

      if (clickInside) {
        return; // do nothing
      }

      collapseDropdown();
    }

    document.addEventListener("mousedown", handleClickOutside);

    () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSearchChange(searchValue: string): void {
    setSearchValue(searchValue);
  }

  function handleCreateAndSelectChoice(): void {
    // Scenario: user typed a new value which is not amongst listed choices
    const newState = addAndSelectNonexistentChoice({ choice: searchValue, state });
    validateState(newState);
    handleChange([...newState.chosen]);
    setSearchValue(EMPTY_STRING);
  }

  function handleSelectChoice(choice: Choice): void {
    // Scenario: user chose a value which is amongst listed choices
    const newState = selectExistingChoice({ choice, state });
    validateState(newState);
    handleChange([...newState.chosen]);
    setSearchValue(EMPTY_STRING);
  }

  function handleUnselectChoice(choice: Choice): void {
    const newState = unselectChoice({ choice, state });
    validateState(newState);
    handleChange([...newState.chosen]);
    setSearchValue(EMPTY_STRING);
  }

  // does user search match any existing option? (case insensitive)

  const isSearching = ![EMPTY_STRING, undefined].includes(searchValue);
  const noChoicesMatched = isSearching && toChoose.length === 0;

  // hide input placeholder if any items are selected
  const smartPlaceholder = value.length > 0 ? undefined : placeholder;

  return (
    <div
      ref={ref}
      className={containerCss}
      role="multi-choice-dropdown"
      onFocus={unfoldDropdown}
    >
      <div
        className={"flex flex-row flex-wrap gap-2" + " overflow-x-hidden"}
        role="listbox-selected"
      >
        {value.map((choice, i) => (
          <div
            role="choice"
            key={`${i}-${choice}`}
            onClick={() => handleUnselectChoice(choice)}
            className={
              "px-3 py-2 rounded" +
              " text-gray-800 dark:text-gray-800" +
              "   bg-gray-300   dark:bg-gray-400" +
              " cursor-pointer"
            }
          >
            {choice} &nbsp; ❌
          </div>
        ))}
        <input
          id={id}
          type="search"
          className={searchBoxCss}
          value={searchValue === undefined ? EMPTY_STRING : searchValue}
          placeholder={smartPlaceholder === undefined ? EMPTY_STRING : smartPlaceholder}
          onChange={(event) => handleSearchChange(event.target.value)}
        />
      </div>

      {isOpen && (
        <div
          role="listbox-selectable"
          className={
            "absolute top-full inset-x-0" +
            " text-gray-700  dark:text-gray-200" +
            "   bg-gray-100    dark:bg-gray-700" +
            " group-focus-within:border-l  group-focus-within:border-l-blue-300  dark:group-focus-within:border-l-blue-300" +
            " group-focus-within:border-b  group-focus-within:border-b-blue-300  dark:group-focus-within:border-b-blue-300" +
            " group-focus-within:border-r  group-focus-within:border-r-blue-300  dark:group-focus-within:border-r-blue-300" +
            " rounded-b" +
            " -m-px" + // to perfectly align borders with parent
            " z-10 dark:z-10"
          }
        >
          {noChoicesMatched ? (
            allowChoiceCreation ? (
              <div
                role="create-choice"
                onClick={handleCreateAndSelectChoice}
                className={
                  "px-3 py-3" +
                  " hover:bg-gray-100 dark:hover:bg-gray-800" +
                  " truncate" + // snips long texts and shows an ellipsis
                  " cursor-pointer"
                }
              >
                Add &nbsp; <b>{searchValue}</b>
              </div>
            ) : (
              <div
                role="choices-not-found"
                className={
                  "px-3 py-3" +
                  " text-gray-800  dark:text-gray-200" +
                  "    bg-red-200     dark:bg-red-500"
                }
              >
                Not found
              </div>
            )
          ) : null}

          {notChosen
            .filter((choice) => choice.toLowerCase().includes(searchValue.toLowerCase()))
            .map((choice, i) => (
              <div
                role="choice"
                key={`${i}-${choice}`}
                onClick={() => handleSelectChoice(choice)}
                className={
                  "py-3 px-5" +
                  " hover:bg-gray-100 dark:hover:bg-gray-800" +
                  " truncate" + // snips long texts and shows an ellipsis
                  " cursor-pointer"
                }
              >
                {choice}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

interface State {
  chosen: Choice[]; // items selected by user
  notChosen: Choice[]; // all - chosen
  toChoose: Choice[]; // notChosen items that match user's query
  all: Choice[];
}

/**
 * Throws an exception if the provided `state` is invalid. Otherwise, it
 * returns the provided `state` unchanged.
 */
function validateState(state: State): State {
  const chosen = new Set<Choice>(state.chosen);
  const notChosen = new Set<Choice>(state.notChosen);
  const all = new Set<Choice>(state.all);

  // `chosen` and `notChosen` must not overlap
  const intersection = intersect(chosen, notChosen);
  if (intersection.size > 0) {
    throw unreachable(
      `invalid state: a choice must only appear in either 'chosen' or` +
        ` 'notChosen' collections, but the following choices appear in both: ` +
        [...intersection]
          .map((choice) => `'${choice}'`)
          .sort()
          .join(", ")
    );
  }

  // `all` = `chosen` + `notChosen`
  const errors: string[] = [];
  const { inAButNotInB: extraInAll, inBButNotInA: missingInAll } = assessSetOverlap({
    a: all,
    b: union(chosen, notChosen),
  });
  if (extraInAll.size > 0) {
    errors.push(
      `every choice in the 'all' collection must appear in either 'chosen' or,` +
        ` 'notChosen' collections but these do not: ` +
        [...extraInAll]
          .map((choice) => `'${choice}'`)
          .sort()
          .join(", ")
    );
  }
  if (missingInAll.size > 0) {
    errors.push(
      `every choice in the 'chosen' and 'notChosen' collections must appear in` +
        ` the 'all' collection, but these do not: ` +
        [...missingInAll]
          .map((choice) => `'${choice}'`)
          .sort()
          .join(", ")
    );
  }

  if (errors.length > 0) {
    throw unreachable(`invalid state:\n${errors.join("\n\n")}`);
  }

  return state;
}

/**
 * Context: when a user
 */
function addAndSelectNonexistentChoice({
  choice,
  state,
}: {
  choice: Choice;
  state: State;
}): State {
  return {
    toChoose: [...state.toChoose],
    chosen: [...state.chosen, choice],
    notChosen: state.notChosen.filter((c) => c !== choice),
    all: [...state.all, choice],
  };
}
function selectExistingChoice({
  choice,
  state,
}: {
  choice: Choice;
  state: State;
}): State {
  return {
    toChoose: [...state.toChoose],
    chosen: [...state.chosen, choice],
    notChosen: state.notChosen.filter((c) => c !== choice),
    all: [...state.all],
  };
}

function unselectChoice({ choice, state }: { choice: Choice; state: State }): State {
  return {
    toChoose: [...state.toChoose],
    chosen: state.chosen.filter((c) => c !== choice),
    notChosen: [...state.notChosen, choice],
    all: [...state.all],
  };
}
