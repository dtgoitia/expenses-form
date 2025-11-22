import { ChangeEvent } from "react";

interface Props {
  /**
   * Unique string for each instance of the component. Necessary if
   * the component appears multiple times on the screen.
   */
  uniqueKey: string;

  /**
   * Pass `true` to set the toggle to ON, or `false` to set the
   * toggle to OFF.
   */
  isOn: boolean;

  /** Text displayed next to the toggle when the toggle is ON. */
  labelOn: string;

  /** Text displayed next to the toggle when the toggle is OFF. */
  labelOff: string;

  onToggle: (isOn: boolean) => void;
}

export function Toggle({ uniqueKey, isOn, labelOn, labelOff, onToggle }: Props) {
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    onToggle(event.target.checked);
  }

  const htmlFor = [uniqueKey, labelOn]
    .map((chunk) =>
      chunk
        .toLowerCase()
        .replaceAll("-", "")
        .replaceAll(" ", "")
        .replaceAll("!", "")
        .replaceAll("?", "")
    )
    .join("-");

  return (
    <label
      htmlFor={htmlFor}
      className={
        "relative" + // to align the check-symbol over the box
        " inline-flex flex-row flex-nowrap items-center" +
        " cursor-pointer"
      }
    >
      <input
        type="checkbox"
        id={htmlFor}
        checked={isOn}
        onChange={handleChange}
        className="hidden peer"
      />
      <div
        role="toggle-rail"
        className={
          // ::after = handle ,  div = handle-rail
          "w-11 h-6" +
          " bg-gray-200  dark:bg-gray-700" +
          " rounded-full" +
          " peer-checked:bg-blue-600" +
          " peer-checked:after:translate-x-full" +
          // " peer-focus:outline-none" +
          // " peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800" +
          // " after:content-['']" +
          " after:h-5 after:w-5" +
          " after:absolute  after:top-2  after:start-[2px]" +
          " after:bg-white" +
          " after:border after:border-gray-300 after:rounded-full" +
          " after:transition-all" +
          ""
        }
      ></div>
      <div role="toggle-label" className="p-2 text-sm ">
        {isOn ? labelOn : labelOff}
      </div>
    </label>
  );
}
