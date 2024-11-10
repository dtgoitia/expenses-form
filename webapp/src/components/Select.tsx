import { unreachable } from "../lib/devex";
import React from "react";

export type OptionId = string;
type OptionLabel = string;

/**
 * This `Option` represents the empty `<option/>` shown at the top of a
 * `<select/>` element. It's purpose is to allow a `<select/>` to have
 * nothing selected on initialization.
 */
const EMPTY_OPTION: Option = {
  id: "empty-option",
  label: "",
};

export interface Option {
  id: OptionId;
  label: OptionLabel;
}

interface Props {
  id?: string;
  selected: OptionId | undefined;
  options: Option[];
  onSelect: (selected: OptionId) => void;
  className?: string;
  disabled?: boolean;
}

export function Select({
  id,
  selected: selectedId,
  options,
  onSelect: select,
  className,
  disabled,
}: Props) {
  let containerCss = "relative";
  if (className) {
    containerCss += ` ${className}`;
  }

  let css =
    "w-full py-3 px-4" +
    " text-sm" +
    " text-gray-700  dark:text-gray-100" +
    "   bg-gray-100    dark:bg-gray-700" +
    " border      border-gray-100      focus:border-blue-300" +
    "        dark:border-gray-700 dark:focus:border-blue-300" +
    " rounded" +
    " appearance-none" + // removes chevron
    " cursor-pointer" +
    " leading-tight focus:outline-none focus:shadow-outline";

  if (disabled) {
    css += " cursor-not-allowed" + " opacity-20 dark:opacity-50";
  }

  const labelToId: Map<OptionLabel, OptionId> = new Map([]);
  const idToLabel: Map<OptionId, OptionLabel> = new Map([]);
  for (const { id, label } of options) {
    labelToId.set(label, id);
    idToLabel.set(id, label);
  }

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    const label: OptionLabel = event.currentTarget.value;
    const id = labelToId.get(label);
    if (id === undefined) {
      console.error("BUG: selected `<option>` has an unexpected `value`:", label);
      return;
    }
    select(id);
    return;
  }

  let selectedLabel: OptionLabel | undefined = undefined;
  let selectable: Option[] = [...options];
  if (selectedId === undefined) {
    selectedLabel = EMPTY_OPTION.label;
    selectable = [EMPTY_OPTION, ...options];
  } else {
    selectedLabel = idToLabel.get(selectedId);
  }

  return (
    <div id={id} className={containerCss} role="select">
      <select
        value={selectedLabel}
        className={css}
        disabled={disabled}
        onChange={handleChange}
      >
        {selectable.map(({ id, label }) => (
          <option key={id} value={label}>
            {label}
          </option>
        ))}
      </select>

      {!disabled && (
        <div
          className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
          role="fold-unfold-icon"
        >
          <svg
            className="w-4 h-4 text-gray-400 mr-1"
            fill="currentColor"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 10l5 5 5-5H7z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
