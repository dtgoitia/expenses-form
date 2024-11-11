import { unreachable } from "../../lib/devex";

export type Year = number;
export type Month = number; // ranges 1-12, as opposed to JS which ranges 0-11
export type Day = number;
type Hour = number; // 0-23
type Minute = number; // 0-59
type Second = number; // 0 -59
type Milisecond = number; // 0-999

type Weekday = number; // Mon 0 - Sun 6
type JsWeekday = number; // Sun 0, Mon 1, Sat 6
type JsMonth = number; // ranges 0-11

interface DateArgs {
  year: Year;
  month: Month;
  day: Day;
  hour?: Hour;
  minute?: Minute;
  second?: Second;
  ms?: Milisecond;
}

class InvalidDate extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "InvalidDate";
  }
}

const MILLISECONDS_PER_SECOND = 1_000;
const MILLISECONDS_PER_MINUTE = 60 * MILLISECONDS_PER_SECOND;
const MILLISECONDS_PER_HOUR = 60 * MILLISECONDS_PER_MINUTE;
const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;
export const SUNDAY: Weekday = 6;

export class XDate {
  public year: Year; // local time
  public month: Month; // local time
  public day: Day; // local time
  public hour: Hour;
  public minute: Minute;
  public second: Second;
  public ms: Milisecond;
  private nativeDate: Date;

  constructor({
    year,
    month,
    day,
    hour: maybeHour,
    minute: maybeMinute,
    second: maybeSecond,
    ms: maybeMs,
  }: DateArgs) {
    const jsMonth = monthToJsMonth(month);

    const hour = maybeHour || 0;
    const minute = maybeMinute || 0;
    const second = maybeSecond || 0;
    const ms = maybeMs || 0;

    const date = new Date(year, jsMonth, day, hour, minute, second, ms);

    /**
     * Problem: when if you provide an invalid date (e.g.: 2024-01-34), the built-in
     * `Date` constructor - instead of failing - will return 2024-02-03. To protect
     * against this behaviour, verify that the day provided by the user matches the
     * day of the `Date` instance.
     */
    if (
      date.getDate() !== day ||
      notBetween({ value: month, start: 1, end: 12 }) ||
      notBetween({ value: day, start: 1, end: 31 }) ||
      notBetween({ value: hour, start: 0, end: 23 }) ||
      notBetween({ value: hour, start: 0, end: 23 }) ||
      notBetween({ value: minute, start: 0, end: 59 }) ||
      notBetween({ value: second, start: 0, end: 59 }) ||
      notBetween({ value: ms, start: 0, end: 999 })
    ) {
      const paddedMonth = month.toString().padStart(2, "0");
      const paddedDay = day.toString().padStart(2, "0");
      const paddedHour = hour.toString().padStart(2, "0");
      const paddedMinute = minute.toString().padStart(2, "0");
      const paddedSecond = second.toString().padStart(2, "0");
      const paddedMs = ms.toString().padStart(3, "0");
      let iso = `${year}-${paddedMonth}-${paddedDay} ${paddedHour}:${paddedMinute}:${paddedSecond}.${paddedMs}`;
      throw new InvalidDate(`${iso} is not a valid date`);
    }

    this.year = year;
    this.month = month;
    this.day = day;
    this.hour = hour;
    this.minute = minute;
    this.second = second;
    this.ms = ms;

    this.nativeDate = date;
  }

  static fromNative(date: Date): XDate {
    const year = date.getFullYear();
    const month = jsMonthToMonth(date.getMonth());
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const ms = date.getMilliseconds();
    return new XDate({ year, month, day, hour, minute, second, ms });
  }

  /**
   * Returns the day of the week (Mon 0 - Sun 6) in local time.
   */
  public weekday(): Weekday {
    return jsWeekdayToWeekday(this.nativeDate.getDay());
  }

  public toISODate(): string {
    return `${this.year}-${this.toISOMonthString()}-${this.toISODayString()}`;
  }

  /**
   * Returns equivalent native `Date` object.
   */
  public toNative(): Date {
    return this.nativeDate;
  }

  public setYear(year: Year): XDate {
    return new XDate({ year, month: this.month, day: this.day });
  }

  public setMonth(month: Month): XDate {
    return new XDate({ year: this.year, month: month, day: this.day });
  }

  /**
   * Subtract `n` months.
   */
  public minusNMonths(n: number): XDate {
    const yearDelta = Math.floor(n / 12);
    const monthDelta = n % 12;

    let year = this.year - yearDelta;
    let month = this.month - monthDelta;

    if (month < 1) {
      year = year - 1;
      month = month + 12;
    }

    // validate that the day exists - think about 2024-02-30 for example
    const jsMonth = monthToJsMonth(month);
    const tmp = new Date(Date.UTC(year, jsMonth, this.day));
    if (tmp.getUTCDate() !== this.day) {
      // recursively subtract a day until success
      return this.minusNDays(1).minusNMonths(n);
    }

    return new XDate({ year, month, day: this.day });
  }

  /**
   * Subtract `n` days.
   */
  public minusNDays(n: number): XDate {
    const previous = new Date(this.nativeDate.getTime() - n * MILLISECONDS_PER_DAY);
    return XDate.fromNative(previous);
  }

  /**
   * Subtract `n` hours.
   */
  public minusNHours(n: number): XDate {
    const previous = new Date(this.nativeDate.getTime() - n * MILLISECONDS_PER_HOUR);
    return XDate.fromNative(previous);
  }

  /**
   * Subtract `n` minutes.
   */
  public minusNMinutes(n: number): XDate {
    const previous = new Date(this.nativeDate.getTime() - n * MILLISECONDS_PER_MINUTE);
    return XDate.fromNative(previous);
  }

  /**
   * Subtract `n` seconds.
   */
  public minusNSeconds(n: number): XDate {
    const previous = new Date(this.nativeDate.getTime() - n * MILLISECONDS_PER_SECOND);
    return XDate.fromNative(previous);
  }

  /**
   * Add `n` months.
   */
  public plusNMonths(n: number): XDate {
    const yearDelta = Math.floor(n / 12);
    const monthDelta = n % 12;

    let year = this.year + yearDelta;
    let month = this.month + monthDelta;

    if (month > 12) {
      year = year + 1;
      month = month - 12;
    }

    // validate that the day exists - think about 2024-02-30 for example
    const jsMonth = monthToJsMonth(month);
    const tmp = new Date(Date.UTC(year, jsMonth, this.day));
    if (tmp.getUTCDate() !== this.day) {
      // recursively subtract a day until success
      return this.minusNDays(1).plusNMonths(n);
    }

    return new XDate({ year, month, day: this.day });
  }

  /**
   * Add `n` days.
   */
  public plusNDays(n: number): XDate {
    const previous = new Date(this.nativeDate.getTime() + n * MILLISECONDS_PER_DAY);
    return XDate.fromNative(previous);
  }

  /**
   * Add `n` hours.
   */
  public plusNHours(n: number): XDate {
    const previous = new Date(this.nativeDate.getTime() + n * MILLISECONDS_PER_HOUR);
    return XDate.fromNative(previous);
  }

  /**
   * Add `n` minutes.
   */
  public plusNMinutes(n: number): XDate {
    const previous = new Date(this.nativeDate.getTime() + n * MILLISECONDS_PER_MINUTE);
    return XDate.fromNative(previous);
  }

  /**
   * Add `n` seconds.
   */
  public plusNSeconds(n: number): XDate {
    const previous = new Date(this.nativeDate.getTime() + n * MILLISECONDS_PER_SECOND);
    return XDate.fromNative(previous);
  }

  public isEqualTo(other: XDate): boolean {
    return (
      this.year === other.year && this.month === other.month && this.day === other.day
    );
  }

  private toISOMonthString(): string {
    return this.month.toString().padStart(2, "0");
  }

  private toISODayString(): string {
    return this.day.toString().padStart(2, "0");
  }
}

/**
 * Convert natural months (1-12) to JS months (0-11)
 */
export function monthToJsMonth(month: Month): JsMonth {
  return month - 1;
}

/**
 * Convert JS months (0-11) to natural months (1-12)
 */
export function jsMonthToMonth(jsMonth: JsMonth): Month {
  return jsMonth + 1;
}

/**
 * Convert natural weekdays (Mon=0, Sun=6) to JS weekdays (Sun=0, Mon=1, Sat=6)
 */
export function weekdayToJsWeekday(weekday: Weekday): JsWeekday {
  let jsWeekday = weekday + 1;
  if (jsWeekday > 6) {
    jsWeekday = jsWeekday - 7;
  }
  return jsWeekday;
}

/**
 * Convert JS weekdays (Sun=0, Mon=1, Sat=6) to natural weekdays (Mon=0, Sun=6)
 */
export function jsWeekdayToWeekday(jsWeekday: JsWeekday): Weekday {
  let weekday = jsWeekday - 1;
  if (weekday < 0) {
    weekday = weekday + 7;
  }
  return weekday;
}

export function getAllDaysInMonth({
  year,
  month,
}: {
  year: Year;
  month: Month;
}): XDate[] {
  const result: XDate[] = [new XDate({ year, month, day: 1 })];

  while (true) {
    const last = result.at(-1);
    if (last === undefined) {
      throw unreachable();
    }

    try {
      result.push(new XDate({ year, month, day: last.day + 1 }));
    } catch {
      break;
    }
  }

  return result;
}

function notBetween({
  value,
  start,
  end,
}: {
  value: number;
  start: number;
  end: number;
}): boolean {
  return value < start || end < value;
}

/**
 * Replace the time portion of a given Date (`of`) and use instead the time
 * portion of another Date (`withTimeFrom`).
 */
export function replaceTime({
  of,
  withTimeFrom,
}: {
  of: Date;
  withTimeFrom: Date;
}): Date {
  /**
   * When calculating the epoch (ms) of the `of` date, the aim is to find
   * when did the day start, so that we can chop at 00:00:00 local time
   * to later add the time of `withTimeFrom`.
   *
   * Problem: if the user's local timezone is +01:00 then:
   *   of = "2024-10-02 12:03:04+01:00"
   * and if we chop at 00:00:00 UTC
   *   of = "2024-10-02 00:00:00+01:00"
   *      = "2024-10-01 23:00:00+00:00"
   * so we need to correct the timezone offset before chopping the time
   * after 00:00:00
   */
  const localTzOffsetInMins = of.getTimezoneOffset() * MILLISECONDS_PER_MINUTE;
  const localMidnightEpoch =
    Math.floor((of.getTime() - localTzOffsetInMins) / MILLISECONDS_PER_DAY) *
    MILLISECONDS_PER_DAY;

  const timeMs = withTimeFrom.getTime() % MILLISECONDS_PER_DAY;

  const ms = localMidnightEpoch + timeMs;

  return new Date(ms);
}
