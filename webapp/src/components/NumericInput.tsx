import { useState } from "react";
import {
  FRACTION_DELIMITER,
  NEGATIVE_SYMBOL,
  NUMBER_FORMATTER,
  stringToNumber,
} from "../lib/number";
import { unreachable } from "../lib/devex";

interface Props {
  value?: number;
  placeholder?: string;
  onChange: (value: number | undefined) => void;
  className?: string;
}

export function NumericInput({ value, placeholder, onChange: change, className }: Props) {
  const [internalValue, setInternalValue] = useState<string | undefined>(
    value === undefined ? undefined : NUMBER_FORMATTER.format(value)
  );

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
      setInternalValue(undefined);
      change(undefined);
      return;
    }

    if (raw === FRACTION_DELIMITER) {
      setInternalValue("0.");
      change(0);
      return;
    }

    if (raw === NEGATIVE_SYMBOL) {
      setInternalValue("-");
      change(undefined);
      return;
    }

    if (raw === `${NEGATIVE_SYMBOL}${FRACTION_DELIMITER}`) {
      setInternalValue("-0.");
      change(0);
      return;
    }

    const parsed = stringToNumber(raw);
    if (!parsed.isNumber) {
      change(value);
      return;
    }

    if (internalValue === undefined) {
      setInternalValue(raw);
      change(parsed.value);
      return;
    }

    if (raw.endsWith(".")) {
      if (countDecimalDelimiterOccurrences(raw) === 1) {
        const userTypesDecimalDelimiter = internalValue.length < raw.length;
        const userDeletesUntilDecimalDelimiter = raw.length < internalValue.length;
        if (userTypesDecimalDelimiter) {
          setInternalValue(`${internalValue}.`);
          change(parsed.value);
          return;
        } else if (userDeletesUntilDecimalDelimiter) {
          setInternalValue(raw);
          change(parsed.value);
          return;
        } else {
          throw unreachable();
        }
      } else if (countDecimalDelimiterOccurrences(raw) > 1) {
        console.debug(
          `>> NumericInput.handleChange::the user typed a second decimal delimiter, which is not supported`
        );
        return;
      } else {
        throw unreachable();
      }
    }

    const trailingZeroAmount = countFractionTrailingZeros(raw);
    const trailingZeros = "0".repeat(trailingZeroAmount);
    let formatted = NUMBER_FORMATTER.format(parsed.value);
    if (trailingZeroAmount > 0) {
      if (formatted.includes(".") === false) {
        formatted = `${formatted}.`;
      }
      formatted = `${formatted}${trailingZeros}`;
    }
    setInternalValue(formatted);
    change(parsed.value);
  }

  return (
    <input
      type="text"
      inputMode="decimal" // displays numeric-only keyboard on mobile devices
      className={css}
      value={internalValue === undefined ? "" : internalValue}
      placeholder={placeholder === undefined ? "" : placeholder}
      onChange={(event) => handleChange(event.target.value)}
    />
  );
}

function countDecimalDelimiterOccurrences(text: string): number {
  const initialCount = 0;
  return text
    .split("")
    .reduce(
      (count, character) => (character === FRACTION_DELIMITER ? count + 1 : count),
      initialCount
    );
}

function countFractionTrailingZeros(s: string): number {
  if (s.length === 0) {
    return 0;
  }

  const [_, fraction] = s.split(FRACTION_DELIMITER);
  if (fraction === undefined) {
    return 0;
  }

  const reversed = fraction.split("").reverse();
  let count = 0;
  for (const char of reversed) {
    if (char !== "0") {
      return count;
    }
    count++;
  }
  return count;
}
