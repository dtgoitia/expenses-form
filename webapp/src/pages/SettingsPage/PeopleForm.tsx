import { useEffect, useState } from "react";
import { App } from "../../domain/app";
import { Person, PersonName } from "../../domain/model";
import { Button } from "../../components/Button";
import { Label } from "../../components/Label";
import { TextInput } from "../../components/TextInput";

interface Props {
  app: App;
}

export function PeopleForm({ app }: Props) {
  const [people, setPeople] = useState<Person[]>([]);

  const [draft, setDraft] = useState<PersonName | undefined>();

  useEffect(() => {
    const subscription = app.peopleManager.change$.subscribe((_) => {
      setPeople(app.peopleManager.getAll());
    });

    setPeople(app.peopleManager.getAll());

    return () => {
      return subscription.unsubscribe();
    };
  }, [app]);

  function handleNameChange(userInput: string | undefined): void {
    setDraft(userInput);
  }

  function handleAddition(): void {
    if (draft === undefined) {
      return;
    }

    const name = draft;
    app.peopleManager.add(name);

    setDraft(undefined);
  }

  function handlePersonDeletion(name: PersonName): void {
    app.peopleManager.delete(name);
  }

  return (
    <Label htmlFor="add-person" text="People">
      <div role="people-form" className="pt-2 px-2">
        {people.length === 0 ? (
          <div>No people found</div>
        ) : (
          <div role="person-list" className="flex flex-col gap-2">
            {people.map((person) => (
              <ListedPerson
                key={`person-${person.name}`}
                person={person}
                onDelete={handlePersonDeletion}
              />
            ))}
          </div>
        )}

        <div className="pt-3">
          <Label htmlFor="add-person" text="Add person">
            <TextInput
              id="add-person"
              value={draft}
              placeholder={`Name`}
              onChange={handleNameChange}
              className="mt-1"
            />
          </Label>

          <div className="flex justify-end p-2">
            <Button text="Add" onClick={handleAddition} disabled={!draft} />
          </div>
        </div>
      </div>
    </Label>
  );
}

interface ListedPersonProps {
  person: Person;
  onDelete: (name: PersonName) => void;
}
function ListedPerson({ person, onDelete }: ListedPersonProps) {
  return (
    <div
      role="person"
      className={
        "flex flex-row justify-between items-center gap-2" +
        " px-4 py-3" +
        " text-gray-700  dark:text-gray-200" +
        "   bg-gray-100    dark:bg-gray-700" +
        " rounded"
      }
    >
      <div role="person-name">{person.name}</div>
      <Button icon="bin" onClick={() => onDelete(person.name)} />
    </div>
  );
}
