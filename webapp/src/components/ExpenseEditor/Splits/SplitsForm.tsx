import { useState } from "react";
import { Choice, MultipleChoice } from "../../MultipleChoice";
import { Label } from "../../Label";
import { ListedSplit } from "./ListedSplit";
import { CurrencyAmount, PersonName, Split } from "../../../domain/model";
import { DefaultActions } from "./DefaultActions";

interface Props {
  splits: Split[];
  amount: CurrencyAmount;
  selectablePeople: PersonName[];
  onChange: (splits: Split[]) => void;
}
export function SplitsForm({
  splits: originalSplits,
  amount,
  selectablePeople,
  onChange: update,
}: Props) {
  const [splits, setSplits] = useState<Split[]>(originalSplits);

  const [participants, setParticipants] = useState<PersonName[]>(
    splits.map((s) => s.person)
  );

  function updateSplits(updated: Split[]): void {
    setSplits(updated);
    update(updated);
  }

  function handleSplitUpdate(splitIndex: number) {
    function handleInner(split: Split): void {
      const updated = splits.map((previous, i) => {
        return splitIndex === i ? split : { ...previous };
      });

      updateSplits(updated);
    }

    return handleInner;
  }

  function handleParticipantsChange(choices: Choice[]): void {
    const names: PersonName[] = choices;
    setParticipants(names);

    const updated: Split[] = [];
    const choicesSet = new Set<PersonName>([...choices.values()]);
    const reviewed = new Set<PersonName>();

    for (const split of splits) {
      const person = split.person;
      if (choicesSet.has(person) === false) {
        continue; // split has been deleted
      }
      updated.push(split);

      choicesSet.delete(person);
      reviewed.add(person);
    }

    // traverse reminding choices
    for (const choice of choicesSet.values()) {
      if (updated.length === 0) {
        updated.push({ person: choice, paid: amount, owed: undefined });
        continue;
      }
      updated.push({ person: choice, paid: undefined, owed: undefined });
    }

    updateSplits(updated);
  }

  return (
    <div role="splits-container" className="pb-3">
      <div role="participants">
        <Label htmlFor="participants" text="Participants">
          <div className="pt-2">
            <MultipleChoice
              id="participants"
              placeholder="participant names"
              value={participants}
              choices={selectablePeople}
              onChange={handleParticipantsChange}
              allowChoiceCreation={false}
            />
          </div>
        </Label>
      </div>
      {splits.length === 0 && (
        <div className="p-2 flex flex-row justify-center">
          <p>there are no splits</p>
        </div>
      )}
      {splits.length > 0 && <DefaultActions splits={splits} onChange={updateSplits} />}

      {splits.length > 0 && (
        <ol>
          {splits.map((split, i) => (
            <ListedSplit
              key={`split-${split.person}`}
              split={split}
              onChange={handleSplitUpdate(i)}
            />
          ))}
        </ol>
      )}
    </div>
  );
}
