import { useState } from "react";
import { Shortcut, ShortcutId } from "../../../domain/model";
import { Button } from "../../../components/Button";
import { Collapse } from "../../../components/Collapse";
import { ShortcutEditor } from "./ShortcutEditor";
import { App } from "../../../domain/app";

interface Props {
  shortcut: Shortcut;
  onUpdate: (shortcut: Shortcut) => void;
  onDelete: (id: ShortcutId) => void;
  app: App;
}
export function ListedShortcut({
  shortcut,
  onUpdate: updateShortcut,
  onDelete,
  app,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function toggleOpen(): void {
    setIsOpen(!isOpen);
  }

  return (
    <div role="shortcut">
      <div
        className={
          "flex flex-row items-center gap-2" +
          " px-4 py-3" +
          " text-gray-700  dark:text-gray-200" +
          "   bg-gray-100    dark:bg-gray-700" +
          " rounded"
        }
      >
        <Button icon={isOpen ? "arrow-left" : "pencil"} onClick={toggleOpen} />
        <div role="shortcut-name" className="w-full">
          {shortcut.buttonName}
        </div>
        <Button icon="bin" onClick={() => onDelete(shortcut.id)} />
      </div>
      <Collapse isOpen={isOpen}>
        <div className="flex flex-row items-center gap-2 pl-6 pt-1 pr-2 pb-4">
          <ShortcutEditor app={app} shortcut={shortcut} onUpdate={updateShortcut} />
        </div>
      </Collapse>
    </div>
  );
}
