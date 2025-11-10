import { useEffect, useState } from "react";
import {
  DescriptionForm,
  descriptionToString,
  stringToDescription,
} from "../../../components/Description";
import { TextInput } from "../../../components/TextInput";
import {
  PersonName,
  Shortcut,
  ShortcutButtonName,
  ShortcutMainDescription,
} from "../../../domain/model";
import { Button } from "../../../components/Button";
import { App } from "../../../domain/app";

interface Props {
  app: App;
  shortcut: Shortcut;
  onUpdate: (shortcut: Shortcut) => void;
}

export function ShortcutEditor({ app, shortcut, onUpdate: updateShortcut }: Props) {
  const [buttonName, setButtonName] = useState<ShortcutButtonName | undefined>(
    shortcut.buttonName
  );
  const originalDescription = descriptionToString(shortcut);
  const [description, setDescription] = useState<string>(originalDescription);
  const [peopleInSettings, setPeopleInSettings] = useState<PersonName[]>([]);

  const buttonNameIsSet =
    buttonName !== undefined && buttonName !== null && buttonName !== "";
  const somethingChanged =
    buttonName !== shortcut.buttonName || description !== originalDescription;

  const updateAllowed = buttonNameIsSet && somethingChanged;

  useEffect(() => {
    const peopleSubscription = app.peopleManager.change$.subscribe((_) => {
      setPeopleInSettings(app.peopleManager.getAll().map((person) => person.name));
    });
    setPeopleInSettings(app.peopleManager.getAll().map((person) => person.name));

    return () => {
      peopleSubscription.unsubscribe();
    };
  }, [app]);

  function handleShortcutUpdate(): void {
    if (!updateAllowed) return;
    const { main, seller, people, tags } = stringToDescription({ raw: description });
    updateShortcut({
      id: shortcut.id,
      buttonName: buttonName as ShortcutButtonName,
      main: main as ShortcutMainDescription,
      seller: seller,
      people: [...people],
      tags: [...tags],
    });
  }

  return (
    <div>
      <TextInput
        id={`shortcut-${shortcut.id}-button-name`}
        value={buttonName}
        placeholder={`Button name (required)`}
        onChange={setButtonName}
        className="mt-1"
      />
      <DescriptionForm
        description={description}
        peopleInSettings={peopleInSettings}
        onChange={setDescription}
      />
      <div className="flex justify-end p-2">
        <Button
          text={somethingChanged ? "Update" : "No changes"}
          onClick={handleShortcutUpdate}
          disabled={!updateAllowed}
        />
      </div>
    </div>
  );
}
