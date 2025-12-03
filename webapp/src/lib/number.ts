const USE_LOCAL_FORMAT = undefined;
const MAX_POSSIBLE_FRACTION_DIGITS_BY_SPEC = 20;

export const NUMBER_FORMATTER = Intl.NumberFormat(USE_LOCAL_FORMAT, {
  maximumFractionDigits: MAX_POSSIBLE_FRACTION_DIGITS_BY_SPEC,
});

const SAMPLE_NUMBER = 1234567.89;
const GROUP_DELIMITER = NUMBER_FORMATTER.formatToParts(SAMPLE_NUMBER).filter(
  (part) => part.type === "group"
)[0].value;
export const FRACTION_DELIMITER = NUMBER_FORMATTER.formatToParts(SAMPLE_NUMBER).filter(
  (part) => part.type === "decimal"
)[0].value;
export const NEGATIVE_SYMBOL = "-";

export function stringToNumber(
  value: string
): { isNumber: true; value: number } | { isNumber: false } {
  if (value === "") {
    return { isNumber: false };
  }

  const withoutFormat = value.replaceAll(GROUP_DELIMITER, "");
  const num = Number(withoutFormat);
  if (isNaN(num)) {
    return { isNumber: false };
  }

  return { isNumber: true, value: num };
}
