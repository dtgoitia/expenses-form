import { ChangeEvent } from "react";

interface Props {
  checked: boolean;

  /**
   * Text displayed next to the checkbox.
   */
  label: string;

  onChange: (checked: boolean) => void;
}
export function Checkbox({ checked, label, onChange }: Props) {
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    onChange(event.target.checked);
  }

  const htmlFor = label
    .toLowerCase()
    .replaceAll("-", "")
    .replaceAll(" ", "")
    .replaceAll("!", "")
    .replaceAll("?", "");

  return (
    <label
      htmlFor={htmlFor}
      className={
        "relative" + // to align the check-symbol over the box
        " inline-flex flex-row flex-nowrap justify-start items-center" +
        " cursor-pointer"
      }
    >
      <input
        type="checkbox"
        id={htmlFor}
        checked={checked}
        onChange={handleChange}
        className="hidden peer"
      />
      <div
        role="checkbox-icon-box"
        className={
          "w-5 h-5" +
          " rounded-sm" +
          " border-2     border-gray-300       peer-checked:border-blue-500" + // box border
          "         dark:border-gray-600  dark:peer-checked:border-blue-600" + // box border
          "              bg-gray-100           peer-checked:bg-blue-500" + // box background
          "         dark:bg-gray-700      dark:peer-checked:bg-blue-700" + // box background
          " transition-all"
        }
      >
        {checked && (
          <svg
            role="checkbox-icon-check"
            className={
              "w-4 h-4" +
              " absolute left-2.5 top-1/2" +
              " transform -translate-x-1/2 -translate-y-1/2" +
              "      stroke-gray-100" + // check-symbol color
              " dark:stroke-blue-200" + // check-symbol color
              ""
            }
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none" // prevents distorsion of check-symbol perimeter
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/*  this is just a 2 segment polyline with thickness */}
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </div>
      <div role="checkbox-label" className="p-2 text-sm ">
        {label}
      </div>
    </label>
  );
}
