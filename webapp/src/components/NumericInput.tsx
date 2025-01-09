import { parseAsNumber } from "../lib/number";

interface Props {
  value?: number;
  placeholder?: string;
  onChange: (value: number | undefined) => void;
  className?: string;
}

export function NumericInput({ value, placeholder, onChange: change, className }: Props) {
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

  function handleChange(raw: string | undefined): void {
    if (raw === "" || raw === undefined || raw === null) {
      change(undefined);
      return;
    }

    const parsed = parseAsNumber(raw);
    if (!parsed.isNumber) {
      return;
    }

    change(parsed.value);
  }

  return (
    <input
      type="number"
      pattern="[0-9]*"
      className={css}
      value={value === undefined ? "" : value}
      placeholder={placeholder === undefined ? "" : placeholder}
      onChange={(event) => handleChange(event.target.value)}
    />
  );
}
