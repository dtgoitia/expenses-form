import { Button } from "./components/Button";
import { ShortcutId } from "./domain/model";
import { SyntheticEvent } from "react";

interface ButtonData {
  id: ShortcutId;
  buttonName: string;
}

interface ShortcutsProps {
  data: ButtonData[];
  select: (id: ShortcutId) => void;
}

function Shortcuts({ data, select }: ShortcutsProps) {
  function handleClick(e: SyntheticEvent, id: ShortcutId) {
    e.preventDefault();
    select(id);
  }

  return (
    <div className="flex flex-row flex-wrap my-2 mb-2 gap-2">
      {data.map((shortcut, i) => (
        <Button
          text={shortcut.buttonName}
          key={`shortcut-${i}`}
          onClick={(e) => handleClick(e, shortcut.id)}
        />
      ))}
    </div>
  );
}

export default Shortcuts;
