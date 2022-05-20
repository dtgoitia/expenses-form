import {
  TimePicker as BlueprintTimePicker,
  TimePrecision,
} from "@blueprintjs/datetime";

interface Props {
  date: Date;
  defaultDate: Date;
  onChange: (date: Date) => void;
}

function TimePicker({ defaultDate, date, onChange }: Props) {
  return (
    <BlueprintTimePicker
      value={date}
      defaultValue={defaultDate}
      showArrowButtons
      precision={TimePrecision.SECOND}
      onChange={onChange}
    />
  );
}

export default TimePicker;
