import { ChangeEvent } from "react";

interface Props {
  id?: string;
  value?: string;
  placeholder?: string;
  onChange: (value: string | undefined) => void;
  className?: string;
  isCode?: boolean;
}

export function TextInput({
  id,
  value,
  placeholder,
  onChange,
  className,
  isCode,
}: Props) {
  let css =
    "w-full py-3 px-4" +
    " text-sm" +
    " text-gray-700  dark:text-gray-200" +
    "   bg-gray-100    dark:bg-gray-700" +
    " border      border-gray-100      focus:border-blue-300" +
    "        dark:border-gray-700 dark:focus:border-blue-300" +
    " rounded" +
    " appearance-none" +
    " leading-tight focus:outline-none focus:shadow-outline";

  if (className) {
    css += ` ${className}`;
  }
  if (isCode) {
    css += " font-mono";
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    let newValue: string | undefined = event.target.value;
    if (newValue === "") {
      newValue = undefined;
    }
    onChange(newValue);
  }

  return (
    <input
      id={id}
      className={css}
      value={value === undefined ? "" : value}
      placeholder={placeholder === undefined ? "" : placeholder}
      onChange={handleChange}
    />
  );
}
