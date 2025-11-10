import { useEffect, useState } from "react";
import { App } from "../../../domain/app";
import {
  PersonName,
  Shortcut,
  ShortcutButtonName,
  ShortcutId,
} from "../../../domain/model";
import { Button } from "../../../components/Button";
import { Label } from "../../../components/Label";
import { TextInput } from "../../../components/TextInput";
import { DescriptionForm, stringToDescription } from "../../../components/Description";
import { ListedShortcut } from "./ListedShortcut";

const NO_DESCRIPTION = "";

interface Props {
  app: App;
}

export function ShortcutsForm({ app }: Props) {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

  const [peopleInSettings, setPeopleInSettings] = useState<PersonName[]>([]);

  const [buttonName, setButtonName] = useState<ShortcutButtonName | undefined>();
  const [description, setDescription] = useState<string>(NO_DESCRIPTION);

  useEffect(() => {
    const peopleSubscription = app.peopleManager.change$.subscribe((_) => {
      setPeopleInSettings(app.peopleManager.getAll().map((person) => person.name));
    });
    const shortcutsSubscription = app.shortcutsManager.change$.subscribe((_) => {
      setShortcuts(app.shortcutsManager.getAll());
    });

    setPeopleInSettings(app.peopleManager.getAll().map((person) => person.name));
    setShortcuts(app.shortcutsManager.getAll());

    return () => {
      peopleSubscription.unsubscribe();
      shortcutsSubscription.unsubscribe();
    };
  }, [app]);

  function clearDraftShortcut(): void {
    setButtonName(undefined);
    setDescription(NO_DESCRIPTION);
  }

  function handleShortcutAddition(): void {
    const { main, seller, people, tags } = stringToDescription({ raw: description });

    if (buttonName === undefined || buttonName === null || buttonName === "") {
      alert("button name must not be empty");
      return;
    }

    if (main === undefined || main === null || main === "") {
      alert("main description name must not be empty");
      return;
    }

    app.shortcutsManager.add({
      buttonName,
      main,
      people: [...people],
      seller,
      tags: [...tags],
    });

    clearDraftShortcut();
  }

  function handleShortcutUpdate(shortcut: Shortcut): void {
    app.shortcutsManager.update({ shortcut });
  }

  function handleShortcutDeletion(id: ShortcutId): void {
    app.shortcutsManager.delete(id);
  }

  function canAddShortcut(): boolean {
    if (buttonName === undefined || buttonName === null || buttonName === "")
      return false;
    if (description === NO_DESCRIPTION) return false;
    return true;
  }

  return (
    <Label htmlFor="shortcuts" text="Shortcuts">
      <div role="shortcuts-form" className="pt-2 px-2">
        {shortcuts.length === 0 ? (
          <div>No shortcuts found</div>
        ) : (
          <div role="shortcut-list" className="flex flex-col gap-2">
            {shortcuts.map((shortcut) => (
              <ListedShortcut
                key={`shortcut-${shortcut.id}`}
                shortcut={shortcut}
                onUpdate={handleShortcutUpdate}
                onDelete={handleShortcutDeletion}
                app={app}
              />
            ))}
          </div>
        )}

        <div className="pt-3">
          <Label htmlFor="add-shortcut" text="Add shortcut">
            <TextInput
              id="new-shortcut-button-name"
              value={buttonName}
              placeholder={`Button name`}
              onChange={setButtonName}
              className="mt-1"
            />
            <DescriptionForm
              description={description}
              peopleInSettings={peopleInSettings}
              onChange={setDescription}
            />
          </Label>

          <div className="flex justify-end p-2">
            <Button
              text="Add"
              onClick={handleShortcutAddition}
              disabled={!canAddShortcut()}
            />
          </div>
        </div>
      </div>
    </Label>
  );
}
