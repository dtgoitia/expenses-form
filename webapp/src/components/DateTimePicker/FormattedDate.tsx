import { now } from "../../datetimeUtils";
import { useEffect, useState } from "react";
import styled from "styled-components";

const GrayedOutText = styled.span`
  opacity: 0.6;
  margin-left: 1rem;
`;

function getFormattedTimezone(date: Date): string {
  const timezoneOffset = date.getTimezoneOffset();
  const absoluteTimezone = Math.abs(timezoneOffset);
  const m = absoluteTimezone % 60;
  const h = (absoluteTimezone - m) / 60;

  const sign = timezoneOffset < 0 ? "+" : "-";
  const formattedTime = [h, m]
    .map((n) => n.toString())
    .map((s) => (s.length === 1 ? `0${s}` : s))
    .join(":");

  const formattedTimezone = `${sign}${formattedTime}`;
  return formattedTimezone;
}

interface Props {
  date: Date;
}

function FormattedDate({ date }: Props) {
  const [secondsDiff, setDiff] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDiff((_) => {
        const ms = now().getTime() - date.getTime();
        const seconds = Math.round(ms / 1000);
        return seconds;
      });
    }, 100);
    return () => clearInterval(intervalId);
  }, [date]);

  const localDate = date.toISOString().split("T")[0];
  const localTime = [`${date.getHours()}`, `${date.getMinutes()}`, `${date.getSeconds()}`]
    .map((n) => (n.length === 1 ? `0${n}` : n))
    .join(":");
  const localTimezone = getFormattedTimezone(date);

  const secs = secondsDiff % 60;
  const mins = (secondsDiff - secs) / 60;
  const formattedDiffChunks = [];
  if (mins > 0) {
    formattedDiffChunks.push(`${mins}m`);
  }
  formattedDiffChunks.push(`${secs}s`);
  const formattedDiff = formattedDiffChunks.join(" ");

  return (
    <span>
      {localDate} <b>{localTime}</b> {localTimezone}
      <GrayedOutText>{formattedDiff}</GrayedOutText>
    </span>
  );
}

export default FormattedDate;
