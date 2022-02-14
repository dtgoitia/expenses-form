import { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";

const InputWithoutArrows = styled.input`
  .ui.form &[type="number"]::-webkit-outer-spin-button,
  .ui.form &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .ui.form &[type="number"] {
    -moz-appearance: textfield;
  }
`;

const TimeContainer = styled.div`
  display: flex;
  flex: row nowrap;

  input {
    flex-basis: 5rem;
    text-align: center;
    height: 2.7rem;
  }
`;

interface Props {
  value: string | undefined;
  onChange: (hour: string) => void;
}

function toTimestamp(h: number | undefined, m: number | undefined): string {
  const hStr = h ? h.toString() : "00";
  const mStr = m ? m.toString() : "00";
  const time = `${hStr.padStart(2, "0")}:${mStr.padStart(2, "0")}`;
  return time;
}
type OnChangeProps = ChangeEvent<HTMLInputElement>;

function TimePicker({ value, onChange }: Props) {
  let propsH = undefined;
  let propsM = undefined;
  if (value !== undefined && value !== null) {
    [propsH, propsM] = value.split(":").map((s) => Number(s));
  }

  const [hour, setHour] = useState<number | undefined>(propsH);
  const [mins, setMins] = useState<number | undefined>(propsM);

  useEffect(() => {
    onChange(toTimestamp(hour, mins));
  }, [hour, mins]);

  function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
    event.target.select();
  }

  function handleHourChange({ target: { value: raw } }: OnChangeProps) {
    if (raw === null || raw === undefined || raw === "") {
      setHour(undefined);
      return;
    }

    const value = Number(raw);

    if (Number.isNaN(value)) return;
    if (value < 0 || 23 < value) return;

    setHour(value);
  }

  function handleMinsChange({ target: { value: raw } }: OnChangeProps) {
    if (raw === null || raw === undefined || raw === "") {
      setMins(undefined);
      return;
    }

    const value = Number(raw);

    if (Number.isNaN(value)) {
      setMins(undefined);
      return;
    }
    if (value < 0 || 59 < value) return;

    setMins(value);
  }

  return (
    <TimeContainer>
      <InputWithoutArrows
        placeholder="00"
        type="number"
        value={hour}
        step={1}
        onChange={handleHourChange}
        onFocus={handleFocus}
      />
      <InputWithoutArrows
        placeholder="00"
        type="number"
        value={mins}
        step={1}
        onChange={handleMinsChange}
        onFocus={handleFocus}
      />
    </TimeContainer>
  );
}
export default TimePicker;
