import TimePicker from "./TimePicker";
import { useEffect, useState } from "react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import { SemanticDatepickerProps } from "react-semantic-ui-datepickers/dist/types";
import styled from "styled-components";

function dateFromDateAndTime(date: Date, time: string): Date | undefined {
  // `time` format: "20:53"
  if (date === undefined || date === null) {
    return undefined;
  }

  const [h, m] = time.split(":").map((s) => Number(s));
  const datetime = new Date(date);
  datetime.setHours(h);
  datetime.setMinutes(m);
  datetime.setSeconds(0);
  datetime.setMilliseconds(0);

  return datetime;
}

function getNowTime() {
  const now = new Date();
  const h = now.getHours().toString();
  const m = now.getMinutes().toString();
  const time = `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  return time;
}

const Container = styled.div`
  display: flex;
  flex: column wrap;
  justify-content: start;
`;

interface DateTimePickerProps {
  value?: Date | undefined;
  onChange?: (d: Date | undefined) => void;
}

function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [date, setDate] = useState(value ? value : new Date());
  const [time, setTime] = useState<string>(getNowTime());

  useEffect(() => {
    if (!onChange) return;
    onChange(dateFromDateAndTime(date, time));
  }, [date, time]);

  function handleDateChange(_: any, data: SemanticDatepickerProps): void {
    if (data.value === undefined) return;

    setDate(data.value as unknown as Date);
  }

  return (
    <Container>
      <SemanticDatepicker value={date} onChange={handleDateChange} />
      <TimePicker value={time} onChange={setTime} />
    </Container>
  );
}

export default DateTimePicker;
