import { customAlphabet } from "nanoid";

function generateRandomId(): string {
  const generateId = customAlphabet("1234567890abcdef", 10);
  return generateId();
}

export function generatePrefixedId(prefix: string): string {
  return `${prefix}_${generateRandomId()}`;
}
