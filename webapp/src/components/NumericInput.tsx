interface Props {
  value?: number;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function NumericInput({ value, placeholder, onChange, className }: Props) {
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

  return (
    <input
      type="number"
      className={css}
      value={value === undefined ? "" : value}
      placeholder={placeholder === undefined ? "" : placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function isNumeric(x: unknown): boolean {
  return isNaN(Number(x));
}
