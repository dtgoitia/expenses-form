import { now } from "../../datetimeUtils";
import { useEffect, useState } from "react";
import styled from "styled-components";

const GrayedOutText = styled.span`
  opacity: 0.6;
  margin-left: 1rem;
`;

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

  const formattedDate = date
    .toISOString()
    .replace("T", " ") // improve readability
    .replace(".000", "") // drop milliseconds
    .replace("Z", " +00:00"); // improve timezone readability

  const [isoDate, isoTime, timezone] = formattedDate.split(" ");

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
      {isoDate} <b>{isoTime}</b> {timezone}
      <GrayedOutText>{formattedDiff}</GrayedOutText>
    </span>
  );
}

export default FormattedDate;
