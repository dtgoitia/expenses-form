export function parseAsNumber(
  value: string
): { isNumber: true; value: number } | { isNumber: false } {
  if (value === "") {
    return { isNumber: false };
  }

  const num = Number(value);
  if (isNaN(num)) {
    return { isNumber: false };
  }

  return { isNumber: true, value: num };
}
