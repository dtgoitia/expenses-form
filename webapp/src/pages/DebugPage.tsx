import DateTimePicker from "../components/DateTimePicker";
import { useState } from "react";

export default function DebugPage() {
  const [datetime, setDatetime] = useState<Date | undefined>();

  return (
    <div>
      <DateTimePicker onChange={setDatetime} />
    </div>
  );
}
