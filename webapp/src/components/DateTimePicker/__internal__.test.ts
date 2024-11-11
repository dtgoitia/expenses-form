import {
  getAllDaysInMonth,
  jsMonthToMonth,
  jsWeekdayToWeekday,
  monthToJsMonth,
  replaceTime,
  weekdayToJsWeekday,
  XDate,
} from "./__internal__";
import { describe, expect, it } from "vitest";

describe(`${XDate.name}`, () => {
  describe("from native Date", () => {
    it("YYYY-MM-DD", () => {
      const native = new Date("2021-03-17");
      const xDate = XDate.fromNative(native);
      expect(xDate).toEqual(new XDate({ year: 2021, month: 3, day: 17 }));
    });

    it("YYYY-MM-DD HH:mm", () => {
      const native = new Date("2021-03-17 01:23");
      const xDate = XDate.fromNative(native);
      expect(xDate).toEqual(
        new XDate({ year: 2021, month: 3, day: 17, hour: 1, minute: 23 })
      );
    });

    it("YYYY-MM-DD HH:mm:ss", () => {
      const native = new Date("2021-03-17 01:23:45");
      const xDate = XDate.fromNative(native);
      expect(xDate).toEqual(
        new XDate({ year: 2021, month: 3, day: 17, hour: 1, minute: 23, second: 45 })
      );
    });

    it("YYYY-MM-DD HH:mm:ss.fff", () => {
      const native = new Date("2021-03-17 01:23:45.678");
      const xDate = XDate.fromNative(native);
      expect(xDate).toEqual(
        new XDate({
          year: 2021,
          month: 3,
          day: 17,
          hour: 1,
          minute: 23,
          second: 45,
          ms: 678,
        })
      );
    });
  });

  it("fails if date is invalid: month > 12", () => {
    const expected = "2024-13-02 00:00:00.000 is not a valid date";
    expect(() => new XDate({ year: 2024, month: 13, day: 2 })).toThrow(expected);
  });

  it("fails if date is invalid: day > 31", () => {
    const expected = "2024-01-200 00:00:00.000 is not a valid date";
    expect(() => new XDate({ year: 2024, month: 1, day: 200 })).toThrow(expected);
  });

  it("fails if date is invalid: 29-Feb does not exist every year", () => {
    new XDate({ year: 2024, month: 2, day: 29 }); // OK
    [
      {
        year: 2022,
        month: 2,
        day: 29,
        expected: "2022-02-29 00:00:00.000 is not a valid date",
      },
      {
        year: 2023,
        month: 2,
        day: 29,
        expected: "2023-02-29 00:00:00.000 is not a valid date",
      },
      // 2024-02-29 exists
      {
        year: 2025,
        month: 2,
        day: 29,
        expected: "2025-02-29 00:00:00.000 is not a valid date",
      },
    ].forEach(({ year, month, day, expected }) => {
      expect(() => new XDate({ year, month, day })).toThrow(expected);
    });
  });

  it("ignores timezones", () => {
    [
      { year: 2024, month: 5, day: 10, expected: "2024-05-10" },
      { year: 2024, month: 11, day: 10, expected: "2024-11-10" },
    ].forEach(({ year, month, day, expected }) =>
      expect(new XDate({ year, month, day }).toISODate()).toEqual(expected)
    );
  });

  it("supports equality comparison", () => {
    const reference = new XDate({ year: 2000, month: 1, day: 1 });

    const same = new XDate({ year: 2000, month: 1, day: 1 });
    expect(reference.isEqualTo(same)).toBe(true);

    const nextDay = new XDate({ year: 2000, month: 1, day: 2 });
    const nextMonth = new XDate({ year: 2000, month: 2, day: 1 });
    const nextYear = new XDate({ year: 2002, month: 1, day: 1 });
    expect(reference.isEqualTo(nextDay)).toBe(false);
    expect(reference.isEqualTo(nextMonth)).toBe(false);
    expect(reference.isEqualTo(nextYear)).toBe(false);
  });

  it("calculates date minus N months", () => {
    const reference = new XDate({ year: 2024, month: 5, day: 31 });
    const minus1 = new XDate({ year: 2024, month: 4, day: 30 });
    const minus2 = new XDate({ year: 2024, month: 3, day: 31 });
    const minus3 = new XDate({ year: 2024, month: 2, day: 29 });

    expect(reference.minusNMonths(1)).toEqual(minus1);
    expect(reference.minusNMonths(2)).toEqual(minus2);
    expect(reference.minusNMonths(3)).toEqual(minus3);

    // jump across years
    expect(new XDate({ year: 2025, month: 1, day: 31 }).minusNMonths(1)).toEqual(
      new XDate({ year: 2024, month: 12, day: 31 })
    );
    expect(reference.minusNMonths(12)).toEqual(
      new XDate({ year: 2023, month: 5, day: 31 })
    );
  });

  it("calculates date minus N days", () => {
    const reference = new XDate({ year: 2024, month: 3, day: 2 });
    const minus1 = new XDate({ year: 2024, month: 3, day: 1 });
    const minus2 = new XDate({ year: 2024, month: 2, day: 29 });
    const minus3 = new XDate({ year: 2024, month: 2, day: 28 });
    expect(reference.minusNDays(1)).toEqual(minus1);
    expect(reference.minusNDays(2)).toEqual(minus2);
    expect(reference.minusNDays(3)).toEqual(minus3);
  });

  it("calculates date minus N hours", () => {
    const reference = new XDate({ year: 2024, month: 1, day: 1, hour: 1, minute: 0 });
    const minus1 = new XDate({ year: 2024, month: 1, day: 1, hour: 0, minute: 0 });
    const minus2 = new XDate({ year: 2023, month: 12, day: 31, hour: 23, minute: 0 });
    expect(reference.minusNHours(1)).toEqual(minus1);
    expect(reference.minusNHours(2)).toEqual(minus2);
  });

  it("calculates date minus N minutes", () => {
    const reference = new XDate({ year: 2024, month: 1, day: 1, hour: 0, minute: 1 });
    const minus1 = new XDate({ year: 2024, month: 1, day: 1, hour: 0, minute: 0 });
    const minus2 = new XDate({ year: 2023, month: 12, day: 31, hour: 23, minute: 59 });
    expect(reference.minusNMinutes(1)).toEqual(minus1);
    expect(reference.minusNMinutes(2)).toEqual(minus2);
  });

  it("calculates date minus N seconds", () => {
    const reference = new XDate({
      year: 2024,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 1,
    });
    const minus1 = new XDate({
      year: 2024,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
    });
    const minus2 = new XDate({
      year: 2023,
      month: 12,
      day: 31,
      hour: 23,
      minute: 59,
      second: 59,
    });
    expect(reference.minusNSeconds(1)).toEqual(minus1);
    expect(reference.minusNSeconds(2)).toEqual(minus2);
  });

  it("calculates date plus N months", () => {
    const reference = new XDate({ year: 2024, month: 1, day: 31 });
    const plus1 = new XDate({ year: 2024, month: 2, day: 29 });
    const plus2 = new XDate({ year: 2024, month: 3, day: 31 });
    const plus3 = new XDate({ year: 2024, month: 4, day: 30 });
    expect(reference.plusNMonths(1)).toEqual(plus1);
    expect(reference.plusNMonths(2)).toEqual(plus2);
    expect(reference.plusNMonths(3)).toEqual(plus3);

    // jump across years
    expect(new XDate({ year: 2024, month: 12, day: 31 }).plusNMonths(1)).toEqual(
      new XDate({ year: 2025, month: 1, day: 31 })
    );
    expect(reference.plusNMonths(12)).toEqual(
      new XDate({ year: 2025, month: 1, day: 31 })
    );
  });

  it("calculates date plus N days", () => {
    const reference = new XDate({ year: 2024, month: 2, day: 28 });
    const plus1 = new XDate({ year: 2024, month: 2, day: 29 });
    const plus2 = new XDate({ year: 2024, month: 3, day: 1 });
    const plus3 = new XDate({ year: 2024, month: 3, day: 2 });
    expect(reference.plusNDays(1)).toEqual(plus1);
    expect(reference.plusNDays(2)).toEqual(plus2);
    expect(reference.plusNDays(3)).toEqual(plus3);
  });

  it("calculates date plus N hours", () => {
    const reference = new XDate({ year: 2023, month: 12, day: 31, hour: 23, minute: 0 });
    const plus1 = new XDate({ year: 2024, month: 1, day: 1, hour: 0, minute: 0 });
    const plus2 = new XDate({ year: 2024, month: 1, day: 1, hour: 1, minute: 0 });
    expect(reference.plusNHours(1)).toEqual(plus1);
    expect(reference.plusNHours(2)).toEqual(plus2);
  });

  it("calculates date plus N minutes", () => {
    const reference = new XDate({ year: 2023, month: 12, day: 31, hour: 23, minute: 59 });
    const plus1 = new XDate({ year: 2024, month: 1, day: 1, hour: 0, minute: 0 });
    const plus2 = new XDate({ year: 2024, month: 1, day: 1, hour: 0, minute: 1 });
    expect(reference.plusNMinutes(1)).toEqual(plus1);
    expect(reference.plusNMinutes(2)).toEqual(plus2);
  });

  it("calculates date plus N seconds", () => {
    const reference = new XDate({
      year: 2023,
      month: 12,
      day: 31,
      hour: 23,
      minute: 59,
      second: 59,
    });
    const plus1 = new XDate({
      year: 2024,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
    });
    const plus2 = new XDate({
      year: 2024,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 1,
    });
    expect(reference.plusNSeconds(1)).toEqual(plus1);
    expect(reference.plusNSeconds(2)).toEqual(plus2);
  });
});

describe(`given a year and a month`, () => {
  it("returns all days for in the month", () => {
    [
      {
        year: 2023,
        month: 2,
        expected: [
          new XDate({ year: 2023, month: 2, day: 1 }),
          new XDate({ year: 2023, month: 2, day: 2 }),
          new XDate({ year: 2023, month: 2, day: 3 }),
          new XDate({ year: 2023, month: 2, day: 4 }),
          new XDate({ year: 2023, month: 2, day: 5 }),
          new XDate({ year: 2023, month: 2, day: 6 }),
          new XDate({ year: 2023, month: 2, day: 7 }),
          new XDate({ year: 2023, month: 2, day: 8 }),
          new XDate({ year: 2023, month: 2, day: 9 }),
          new XDate({ year: 2023, month: 2, day: 10 }),
          new XDate({ year: 2023, month: 2, day: 11 }),
          new XDate({ year: 2023, month: 2, day: 12 }),
          new XDate({ year: 2023, month: 2, day: 13 }),
          new XDate({ year: 2023, month: 2, day: 14 }),
          new XDate({ year: 2023, month: 2, day: 15 }),
          new XDate({ year: 2023, month: 2, day: 16 }),
          new XDate({ year: 2023, month: 2, day: 17 }),
          new XDate({ year: 2023, month: 2, day: 18 }),
          new XDate({ year: 2023, month: 2, day: 19 }),
          new XDate({ year: 2023, month: 2, day: 20 }),
          new XDate({ year: 2023, month: 2, day: 21 }),
          new XDate({ year: 2023, month: 2, day: 22 }),
          new XDate({ year: 2023, month: 2, day: 23 }),
          new XDate({ year: 2023, month: 2, day: 24 }),
          new XDate({ year: 2023, month: 2, day: 25 }),
          new XDate({ year: 2023, month: 2, day: 26 }),
          new XDate({ year: 2023, month: 2, day: 27 }),
          new XDate({ year: 2023, month: 2, day: 28 }),
        ],
      },
      {
        year: 2024,
        month: 2,
        expected: [
          new XDate({ year: 2024, month: 2, day: 1 }),
          new XDate({ year: 2024, month: 2, day: 2 }),
          new XDate({ year: 2024, month: 2, day: 3 }),
          new XDate({ year: 2024, month: 2, day: 4 }),
          new XDate({ year: 2024, month: 2, day: 5 }),
          new XDate({ year: 2024, month: 2, day: 6 }),
          new XDate({ year: 2024, month: 2, day: 7 }),
          new XDate({ year: 2024, month: 2, day: 8 }),
          new XDate({ year: 2024, month: 2, day: 9 }),
          new XDate({ year: 2024, month: 2, day: 10 }),
          new XDate({ year: 2024, month: 2, day: 11 }),
          new XDate({ year: 2024, month: 2, day: 12 }),
          new XDate({ year: 2024, month: 2, day: 13 }),
          new XDate({ year: 2024, month: 2, day: 14 }),
          new XDate({ year: 2024, month: 2, day: 15 }),
          new XDate({ year: 2024, month: 2, day: 16 }),
          new XDate({ year: 2024, month: 2, day: 17 }),
          new XDate({ year: 2024, month: 2, day: 18 }),
          new XDate({ year: 2024, month: 2, day: 19 }),
          new XDate({ year: 2024, month: 2, day: 20 }),
          new XDate({ year: 2024, month: 2, day: 21 }),
          new XDate({ year: 2024, month: 2, day: 22 }),
          new XDate({ year: 2024, month: 2, day: 23 }),
          new XDate({ year: 2024, month: 2, day: 24 }),
          new XDate({ year: 2024, month: 2, day: 25 }),
          new XDate({ year: 2024, month: 2, day: 26 }),
          new XDate({ year: 2024, month: 2, day: 27 }),
          new XDate({ year: 2024, month: 2, day: 28 }),
          new XDate({ year: 2024, month: 2, day: 29 }),
        ],
      },
      {
        year: 2024,
        month: 11,
        expected: [
          new XDate({ year: 2024, month: 11, day: 1 }),
          new XDate({ year: 2024, month: 11, day: 2 }),
          new XDate({ year: 2024, month: 11, day: 3 }),
          new XDate({ year: 2024, month: 11, day: 4 }),
          new XDate({ year: 2024, month: 11, day: 5 }),
          new XDate({ year: 2024, month: 11, day: 6 }),
          new XDate({ year: 2024, month: 11, day: 7 }),
          new XDate({ year: 2024, month: 11, day: 8 }),
          new XDate({ year: 2024, month: 11, day: 9 }),
          new XDate({ year: 2024, month: 11, day: 10 }),
          new XDate({ year: 2024, month: 11, day: 11 }),
          new XDate({ year: 2024, month: 11, day: 12 }),
          new XDate({ year: 2024, month: 11, day: 13 }),
          new XDate({ year: 2024, month: 11, day: 14 }),
          new XDate({ year: 2024, month: 11, day: 15 }),
          new XDate({ year: 2024, month: 11, day: 16 }),
          new XDate({ year: 2024, month: 11, day: 17 }),
          new XDate({ year: 2024, month: 11, day: 18 }),
          new XDate({ year: 2024, month: 11, day: 19 }),
          new XDate({ year: 2024, month: 11, day: 20 }),
          new XDate({ year: 2024, month: 11, day: 21 }),
          new XDate({ year: 2024, month: 11, day: 22 }),
          new XDate({ year: 2024, month: 11, day: 23 }),
          new XDate({ year: 2024, month: 11, day: 24 }),
          new XDate({ year: 2024, month: 11, day: 25 }),
          new XDate({ year: 2024, month: 11, day: 26 }),
          new XDate({ year: 2024, month: 11, day: 27 }),
          new XDate({ year: 2024, month: 11, day: 28 }),
          new XDate({ year: 2024, month: 11, day: 29 }),
          new XDate({ year: 2024, month: 11, day: 30 }),
        ],
      },
      {
        year: 2024,
        month: 12,
        expected: [
          new XDate({ year: 2024, month: 12, day: 1 }),
          new XDate({ year: 2024, month: 12, day: 2 }),
          new XDate({ year: 2024, month: 12, day: 3 }),
          new XDate({ year: 2024, month: 12, day: 4 }),
          new XDate({ year: 2024, month: 12, day: 5 }),
          new XDate({ year: 2024, month: 12, day: 6 }),
          new XDate({ year: 2024, month: 12, day: 7 }),
          new XDate({ year: 2024, month: 12, day: 8 }),
          new XDate({ year: 2024, month: 12, day: 9 }),
          new XDate({ year: 2024, month: 12, day: 10 }),
          new XDate({ year: 2024, month: 12, day: 11 }),
          new XDate({ year: 2024, month: 12, day: 12 }),
          new XDate({ year: 2024, month: 12, day: 13 }),
          new XDate({ year: 2024, month: 12, day: 14 }),
          new XDate({ year: 2024, month: 12, day: 15 }),
          new XDate({ year: 2024, month: 12, day: 16 }),
          new XDate({ year: 2024, month: 12, day: 17 }),
          new XDate({ year: 2024, month: 12, day: 18 }),
          new XDate({ year: 2024, month: 12, day: 19 }),
          new XDate({ year: 2024, month: 12, day: 20 }),
          new XDate({ year: 2024, month: 12, day: 21 }),
          new XDate({ year: 2024, month: 12, day: 22 }),
          new XDate({ year: 2024, month: 12, day: 23 }),
          new XDate({ year: 2024, month: 12, day: 24 }),
          new XDate({ year: 2024, month: 12, day: 25 }),
          new XDate({ year: 2024, month: 12, day: 26 }),
          new XDate({ year: 2024, month: 12, day: 27 }),
          new XDate({ year: 2024, month: 12, day: 28 }),
          new XDate({ year: 2024, month: 12, day: 29 }),
          new XDate({ year: 2024, month: 12, day: 30 }),
          new XDate({ year: 2024, month: 12, day: 31 }),
        ],
      },
    ].forEach(({ year, month, expected }) => {
      const result = getAllDaysInMonth({ year, month });
      expect(result).toEqual(expected);
    });
  });
});

describe(`convert between`, () => {
  const NATURAL_TO_JS_WEEKDAY = [
    { natural: 0, js: 1 }, // Monday
    { natural: 1, js: 2 }, // Tuesday
    { natural: 2, js: 3 }, // Wednesday
    { natural: 3, js: 4 }, // Thursday
    { natural: 4, js: 5 }, // Friday
    { natural: 5, js: 6 }, // Saturday
    { natural: 6, js: 0 }, // Sunday
  ];

  it("natural weekday and JS weekday", () => {
    NATURAL_TO_JS_WEEKDAY.forEach(({ natural, js }) =>
      expect(weekdayToJsWeekday(natural)).toEqual(js)
    );
  });

  it("natural weekday and JS weekday", () => {
    NATURAL_TO_JS_WEEKDAY.forEach(({ natural, js }) =>
      expect(jsWeekdayToWeekday(js)).toEqual(natural)
    );
  });

  const NATURAL_TO_JS_MONTH = [
    { natural: 1, js: 0 }, // January
    { natural: 2, js: 1 }, // February
    { natural: 3, js: 2 }, // March
    { natural: 4, js: 3 }, // April
    { natural: 5, js: 4 }, // May
    { natural: 6, js: 5 }, // June
    { natural: 7, js: 6 }, // July
    { natural: 8, js: 7 }, // August
    { natural: 9, js: 8 }, // September
    { natural: 10, js: 9 }, // October
    { natural: 11, js: 10 }, // November
    { natural: 12, js: 11 }, // December
  ];

  it("natural month and JS month", () => {
    NATURAL_TO_JS_MONTH.forEach(({ natural, js }) =>
      expect(monthToJsMonth(natural)).toEqual(js)
    );
  });

  it("natural weekday and JS weekday", () => {
    NATURAL_TO_JS_MONTH.forEach(({ natural, js }) =>
      expect(jsMonthToMonth(js)).toEqual(natural)
    );
  });
});

describe(`replaceTime`, () => {
  it(`overwrites the time of Date X with the time of the Date Y`, () => {
    const x = new Date("2024-05-08 11:11:11.111Z");
    const y = new Date("2024-01-17 22:22:22.222Z");
    const expected = new Date("2024-05-08 22:22:22.222Z");
    expect(replaceTime({ of: x, withTimeFrom: y })).toEqual(expected);
  });
});
