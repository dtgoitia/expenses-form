import { Button } from "../../Button";
import { DatePicker } from "../../DateTimePicker/DatePicker";
import { TimePicker } from "../../DateTimePicker/TimePicker";
import { Dialog } from "../../Dialog";
import FormattedDate from "./FormattedDate";
import { useState } from "react";

interface Props {
  date: Date;
  defaultDate: Date;
  onChange: (date: Date) => void;
}

function DateTimePicker({ defaultDate, date, onChange: setDate }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const rowCss = "flex flex-row flex-nowrap justify-between";

  return (
    <div className="m-1">
      <div className={rowCss}>
        <Dialog
          className="p-4 rounded-lg"
          isOpen={isOpen}
          onClickOutside={() => setIsOpen(false)}
        >
          <div className="flex flex-col gap-8 justify-center align-center">
            <DatePicker value={date} defaultValue={defaultDate} onChange={setDate} />
            <TimePicker value={date} onChange={setDate} />
            <FormattedDate date={date} />
          </div>
        </Dialog>
      </div>

      <div className={rowCss}>
        <FormattedDate date={date} />
        <Button
          text={isOpen ? "Close" : "Edit time"}
          disabled={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
    </div>
  );
}

export default DateTimePicker;
