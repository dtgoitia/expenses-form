import Shortcuts from "../../PredefinedButtons";
import { SHORTCUTS, TAGS } from "../../constants";
import { PersonName, Seller, ShortcutId, TagName } from "../../domain/model";
import storage from "../../localStorage";
import { Choice, MultipleChoice } from "../MultipleChoice";
import { TextInput } from "../TextInput";
import TagSelector from "./TagSelector";
import { useState } from "react";

interface DescriptionProps {
  description: string;
  peopleInSettings: PersonName[];
  onChange: (description: string) => void;
}

export function descriptionToString({ main, people, seller, tags }: Description): string {
  const chunks = [];

  if (main) {
    chunks.push(main);
  }

  if (people && people.length > 0) {
    const formattedPeople = people.map((person) => `@${person}`);
    chunks.push(`with ${formattedPeople.join(",")}`);
  }

  if (seller) {
    chunks.push(`at @${seller}`);
  }

  if (tags.length > 0) {
    const formattedTags = tags.map((name) => `#${name}`).join(" ");
    chunks.push(formattedTags);
  }

  return chunks.join(" ");
}

export interface Description {
  main: string | undefined;
  people: PersonName[]; // TODO: make a Set
  seller: Seller | undefined;
  tags: TagName[]; // TODO: make a Set
}
export function stringToDescription({ raw }: { raw: string }): Description {
  let reminder: string = raw;
  let seller: Seller | undefined = undefined;
  let main: string | undefined = undefined;
  let tags: TagName[] = [];
  let rawPeople: string | undefined = undefined;
  let people: PersonName[] = [];

  if (reminder.startsWith("#")) {
    // user added tags first, without adding anything else to the description
    tags = reminder
      .split("#")
      .map((chunk) => chunk.trim())
      .filter((tag) => tag !== "");
    return { main, people, seller, tags };
  }

  [reminder, ...tags] = reminder.split(" #");

  if (reminder.startsWith("at @")) {
    seller = reminder.replace("at @", "").trim();
    return { main, people, seller, tags };
  }

  [reminder, seller] = reminder.split(" at @");

  if (reminder.startsWith("with @")) {
    people = reminder.replace("with @", "").split(",@");
    return { main, people, seller, tags };
  }

  [reminder, rawPeople] = reminder.split(" with @");
  if (rawPeople) {
    people = rawPeople.split(",@");
  }

  const notOnlyEmptySpaces = reminder.trim() !== "";
  if (notOnlyEmptySpaces) {
    main = reminder;
  }

  return { main, people, seller, tags };
}

const tagsInSettings = storage.tripTags.read() || [];
const availableTags: TagName[] = mergeStringLists([TAGS, tagsInSettings]);

function mergeStringLists(listOfStringLists: string[][]): string[] {
  /**
   * Return a list of unique strings. The order is preserved - items of the first list
   * are added first, then items in the second list, etc.
   */
  const seen = new Set<string>([]);
  const result: string[] = [];
  for (const s of listOfStringLists.flatMap((s) => s)) {
    if (seen.has(s)) continue;

    seen.add(s);
    result.push(s);
  }

  return result;
}

export function DescriptionForm({
  description: raw,
  peopleInSettings,
  onChange: update,
}: DescriptionProps) {
  const description = stringToDescription({ raw });

  const [peopleAddedByUser, setPeopleAddedByUser] = useState<PersonName[]>([]);
  const selectablePeople: PersonName[] = getSelectablePeople({
    inSettings: peopleInSettings,
    addedByUser: peopleAddedByUser, // TODO: add these to Settings
    inExpense: description.people,
  });

  function handleMainChange(main: string | undefined): void {
    update(descriptionToString({ ...description, main }));
  }

  function handleSellerChange(seller: string | undefined): void {
    update(descriptionToString({ ...description, seller }));
  }

  function handlePeopleChange(value: Choice[]): void {
    const selectedPeople: PersonName[] = value;
    if (!selectedPeople) {
      return;
    }

    // Ensure people added by the user are shown amongst the dropdown options
    const previous = new Set(selectablePeople);
    const addedByUser = selectedPeople.filter((person) => !previous.has(person));

    if (addedByUser.length > 0) {
      setPeopleAddedByUser([...peopleAddedByUser, ...addedByUser]);
    }

    const people = selectedPeople.sort();

    update(descriptionToString({ ...description, people }));
  }

  function handleTagChange(selectedTags: Set<TagName>): void {
    const tags = [...selectedTags.values()];
    update(descriptionToString({ ...description, tags }));
  }

  function handleShortcutSelection(id: ShortcutId) {
    const shortcut = SHORTCUTS.filter((shortcut) => shortcut.id === id)[0];

    update(
      descriptionToString({
        main: shortcut.main,
        people: shortcut.people,
        seller: shortcut.seller,
        tags: shortcut.tags,
      })
    );
  }

  return (
    <div role="description-form" className="mb-4">
      <Shortcuts
        data={SHORTCUTS.map(({ id, buttonName }) => ({ id, buttonName }))}
        select={handleShortcutSelection}
      />

      <div className="grid grid-cols-2 gap-2 mb-4">
        <TextInput
          value={description.main}
          placeholder="description"
          className="col-start-1 col-span-2"
          onChange={handleMainChange}
        />
        <TextInput
          value={description.seller}
          placeholder="seller"
          className="col-start-1 col-span-1"
          onChange={handleSellerChange}
        />
        <MultipleChoice
          placeholder="people"
          value={description.people}
          choices={selectablePeople}
          onChange={handlePeopleChange}
          allowChoiceCreation={true}
        />
      </div>

      <TagSelector
        tags={availableTags}
        selected={new Set(description.tags)}
        onChange={handleTagChange}
      />
    </div>
  );
}

/**
 * Ensure there are no duplicates
 */
function getSelectablePeople({
  inSettings,
  addedByUser,
  inExpense,
}: {
  inSettings: PersonName[];
  addedByUser: PersonName[];
  inExpense: PersonName[];
}) {
  const seen = new Set<PersonName>([...inSettings, ...addedByUser, ...inExpense]);
  const result: PersonName[] = [...seen.values()].sort();
  return result;
}
