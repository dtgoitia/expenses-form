import { DatetimeCustomISOString, DatetimeISOString } from "./domain/model";

export function now(): Date {
  return new Date(new Date().setMilliseconds(0));
}

// https://devhints.io/wip/intl-datetime
const LANGUAGE_SIMILAR_TO_ISO8601 = "sv-SE";

export const isoDateTimeFormatter = new Intl.DateTimeFormat(LANGUAGE_SIMILAR_TO_ISO8601, {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
}).format;

function getLocalTimezoneFormatted(): string {
  const offset = new Date().getTimezoneOffset(); // in minutes

  const sign = offset <= 0 ? "+" : "-";

  const m = offset % 60;
  const h = (offset - m) / 60;

  const fmt = (n: number) => String(Math.abs(n)).padStart(2, "0");

  return `${sign}${fmt(h)}:${fmt(m)}`;
}

/**
 * Produces a date like `2023-05-22 16:08:27 +01:00`.
 */
export function dateToLocale(date: Date): DatetimeCustomISOString {
  const naive: string = isoDateTimeFormatter(date);
  const tz = getLocalTimezoneFormatted();
  return `${naive} ${tz}`;
}

/**
 * Produces a date like `2023-05-22T16:08:27+01:00`.
 */
export function dateToISOLocale(date: Date): DatetimeISOString {
  return dateToLocale(date).replace(" ", "T").replace(" ", "");
}

export function customISOStringToDate(custom: DatetimeCustomISOString): Date {
  return new Date(Date.parse(custom));
}
