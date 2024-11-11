import { unreachable } from "../../lib/devex";
import { OptionId, Select } from "../Select";
import {
  getAllDaysInMonth,
  Month,
  replaceTime,
  SUNDAY,
  XDate,
  Year,
} from "./__internal__";
import { useState } from "react";

interface Props {
  value: Date;
  defaultValue: Date;
  onChange: (date: Date) => void;
}

export function DatePicker({ value, defaultValue, onChange: change }: Props) {
  const [previousValue, setPreviousValue] = useState<Date>(defaultValue);

  function handleDateChange(date: Date): void {
    const previous = value;
    const updated = replaceTime({ of: date, withTimeFrom: previous });

    change(updated);
    setPreviousValue(value);
  }

  function handleGoToPreviousMonth(): void {
    const updated = XDate.fromNative(value).minusNMonths(1).toNative();
    handleDateChange(updated);
  }

  function handleGoToNextMonth(): void {
    const updated = XDate.fromNative(value).plusNMonths(1).toNative();
    handleDateChange(updated);
  }

  const monthAndYearPickerCss =
    "flex flex-row items-center justify-center gap-3" + " h-14 ";
  const arrowCss = "w-3" + " text-xl text-bold" + " cursor-pointer";

  return (
    <div className={"flex flex-col" + " w-80"}>
      <div className={monthAndYearPickerCss} role="month-and-year-picker">
        <div
          role="go-to-previous-month"
          className={arrowCss}
          onClick={() => handleGoToPreviousMonth()}
        >
          &lt;
        </div>
        <YearPicker value={value} onChange={handleDateChange} className="w-24" />
        <MonthPicker value={value} onChange={handleDateChange} className="w-32" />
        <div
          role="go-to-next-month"
          className={arrowCss}
          onClick={() => handleGoToNextMonth()}
        >
          &gt;
        </div>
      </div>
      <DayPicker
        value={value}
        previousValue={previousValue}
        onChange={handleDateChange}
      />
    </div>
  );
}

interface YearPickerProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

function YearPicker({ value, onChange: change, className }: YearPickerProps) {
  const years = calculateYears({ reference: value.getFullYear() });

  const selected = `${value.getFullYear()}`;
  const options = years
    .map((year) => year.toString())
    .map((year) => ({ id: year, label: year }));

  function handleSelect(selected: OptionId): void {
    const option = options.filter((option) => option.id === selected)[0];
    const year = Number(option.label);

    const updated = XDate.fromNative(value).setYear(year).toNative();
    change(updated);
  }

  return (
    <div className={className} role="year-picker">
      <Select selected={selected} options={options} onSelect={handleSelect} />
    </div>
  );
}

interface MonthPickerProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

const MONTH_TO_STR = new Map<string, Month>([
  ["January", 1],
  ["February", 2],
  ["March", 3],
  ["April", 4],
  ["May", 5],
  ["June", 6],
  ["July", 7],
  ["August", 8],
  ["September", 9],
  ["October", 10],
  ["November", 11],
  ["December", 12],
]);

function MonthPicker({ value, onChange: change, className }: MonthPickerProps) {
  const selected = value.toLocaleString("default", { month: "long" });
  const options = [...MONTH_TO_STR.keys()].map((month) => ({
    id: month,
    label: month,
  }));

  function handleSelect(selectedId: OptionId): void {
    const month = MONTH_TO_STR.get(selectedId);
    if (month === undefined) {
      throw unreachable(`failed to map '${selectedId}' to a month`);
    }
    const updated = XDate.fromNative(value).setMonth(month).toNative();

    change(updated);
  }

  return (
    <div className={className} role="month-picker">
      <Select selected={selected} options={options} onSelect={handleSelect} />
    </div>
  );
}

interface DayPickerProps {
  value: Date;
  previousValue: Date;
  onChange: (date: Date) => void;
}

function DayPicker({ value, previousValue, onChange: selectDate }: DayPickerProps) {
  const containerCss = "p-1";
  const dayGridCss = "grid grid-cols-7";

  const selected = XDate.fromNative(value);
  const previousSelection = XDate.fromNative(previousValue);
  const thisMonth = getAllDaysInMonth({ year: selected.year, month: selected.month });

  const weekdayHeaders = [
    { text: "Mo" },
    { text: "Tu" },
    { text: "We" },
    { text: "Th" },
    { text: "Fr" },
    { text: "Sa" },
    { text: "Su" },
  ];

  // find out how many days from the previous month must be shown
  const firstXDate = thisMonth[0];
  const previousMonthBoxAmount = firstXDate.weekday();
  const previousMonthXDates: XDate[] = [];
  for (let i = previousMonthBoxAmount; i > 0; i--) {
    const xDate = firstXDate.minusNDays(i);
    previousMonthXDates.push(xDate);
  }

  // find out how many days from the next month must be shown
  const lastXDate = thisMonth[thisMonth.length - 1];
  const lastWeekday = lastXDate.weekday();
  const nextMonthXDates: XDate[] = [];
  if (lastWeekday < SUNDAY) {
    const nextMonthBoxAmount = SUNDAY - lastXDate.weekday();
    for (let i = 1; i <= nextMonthBoxAmount; i++) {
      const xDate = lastXDate.plusNDays(i);
      nextMonthXDates.push(xDate);
    }
  }

  return (
    <div className={containerCss}>
      <div className={dayGridCss}>
        {weekdayHeaders.map((header) => (
          <Box
            key={header.text}
            text={header.text}
            selected={false}
            wasPreviousSelection={false}
            grayedOut={true}
            onSelect={undefined}
          />
        ))}
        {previousMonthXDates.map((xDate) => {
          return (
            <Box
              key={`prev-month-${xDate.day.toString()}`}
              text={xDate.day.toString()}
              selected={false}
              wasPreviousSelection={xDate.isEqualTo(previousSelection)}
              grayedOut={true}
              onSelect={() => {
                selectDate(xDate.toNative());
              }}
            />
          );
        })}
        {thisMonth.map((xDate) => {
          return (
            <Box
              key={`this-month-${xDate.day.toString()}`}
              text={xDate.day.toString()}
              selected={xDate.isEqualTo(selected)}
              wasPreviousSelection={xDate.isEqualTo(previousSelection)}
              grayedOut={false}
              onSelect={() => {
                selectDate(xDate.toNative());
              }}
            />
          );
        })}
        {nextMonthXDates.map((xDate) => {
          return (
            <Box
              key={`next-month-${xDate.day.toString()}`}
              text={xDate.day.toString()}
              selected={false}
              wasPreviousSelection={xDate.isEqualTo(previousSelection)}
              grayedOut={true}
              onSelect={() => {
                selectDate(xDate.toNative());
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

interface BoxProps {
  text: string;
  selected: boolean;
  wasPreviousSelection: boolean;
  grayedOut: boolean;
  onSelect?: () => void;
}
function Box({ text, selected, wasPreviousSelection, grayedOut, onSelect }: BoxProps) {
  let css =
    "w-12" +
    " p-2" +
    " text-xl" +
    " rounded" +
    " flex items-center justify-center" +
    " cursor-pointer";

  let grayedOutCss = " opacity-50";
  let prevSelectionCss = " border-2 border-gray-500 border-opacity-30";

  if (selected) {
    css += " text-white  bg-blue-600  dark:bg-blue-800";
    css += " z-10";
  } else if (wasPreviousSelection && grayedOut) {
    css += prevSelectionCss;
    css += grayedOutCss;
  } else if (wasPreviousSelection && !grayedOut) {
    css += prevSelectionCss;
  } else if (grayedOut) {
    css += grayedOutCss;
  }
  return (
    <div className={css} onClick={onSelect ? () => onSelect() : undefined}>
      {text}
    </div>
  );
}

function calculateYears({ reference }: { reference: Year }): Year[] {
  const years: Year[] = [];

  const BEFORE = 10;
  for (let i = 1; i < BEFORE; i++) {
    years.push(reference - i);
  }

  years.push(reference);

  const AFTER = BEFORE;
  for (let i = 1; i < AFTER; i++) {
    years.push(reference + i);
  }

  return years.sort();
}
