import { XDate } from "./__internal__";

interface Props {
  value: Date;
  onChange: (date: Date) => void;
}
export function TimePicker({ value, onChange: change }: Props) {
  const xDate = XDate.fromNative(value);

  function handleHourUp(): void {
    change(xDate.plusNHours(1).toNative());
  }

  function handleHourDown(): void {
    change(xDate.minusNHours(1).toNative());
  }

  function handleMinuteUp(): void {
    change(xDate.plusNMinutes(1).toNative());
  }

  function handleMinuteDown(): void {
    change(xDate.minusNMinutes(1).toNative());
  }

  function handleSecondUp(): void {
    change(xDate.plusNSeconds(1).toNative());
  }

  function handleSecondDown(): void {
    change(xDate.minusNSeconds(1).toNative());
  }

  return (
    <div className="flex flex-row gap-8">
      <Input value={xDate.hour} onIncrement={handleHourUp} onDecrement={handleHourDown} />
      <Input
        value={xDate.minute}
        onIncrement={handleMinuteUp}
        onDecrement={handleMinuteDown}
      />
      <Input
        value={xDate.second}
        onIncrement={handleSecondUp}
        onDecrement={handleSecondDown}
      />
    </div>
  );
}

interface InputProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

function Input({ value, onIncrement: increase, onDecrement: decrease }: InputProps) {
  return (
    <div className="flex flex-row gap-2 text-xl">
      <div role="increase" className="cursor-pointer" onClick={increase}>
        +
      </div>
      <div role="value">{value.toString().padStart(2, "0")}</div>
      <div role="decrease" className="cursor-pointer" onClick={decrease}>
        -
      </div>
    </div>
  );
}
