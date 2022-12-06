import Shortcuts from "../../PredefinedButtons";
import { DEFAULT_PEOPLE, SHORTCUTS, TAGS } from "../../constants";
import { Person, Seller, ShortcutId, TagName } from "../../domain/model";
import storage from "../../localStorage";
import TagSelector from "./TagSelector";
import { useState } from "react";
import { DropdownProps, Form, InputOnChangeData } from "semantic-ui-react";
import styled from "styled-components";

interface DescriptionProps {
  description: string;
  onChange: (description: string) => void;
}

enum DescriptionSubfield {
  main = "main",
  people = "people",
  seller = "seller",
}

export function descriptionToString({
  main,
  people,
  seller,
  tags,
}: Description): string {
  const chunks = [];

  if (main) {
    chunks.push(main.trim());
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

interface Description {
  main: string;
  people: Person[]; // TODO: make a Set
  seller: Seller | undefined;
  tags: TagName[]; // TODO: make a Set
}
export function stringToDescription({ raw }: { raw: string }): Description {
  let reminder = raw;
  let seller: Seller | undefined = undefined;
  let tags: TagName[] = [];
  let rawPeople: string | undefined = undefined;
  let people: Person[] = [];

  [reminder, ...tags] = raw.split(" #");
  [reminder, seller] = reminder.split(" at @");
  [reminder, rawPeople] = reminder.split(" with @");
  if (rawPeople) {
    people = rawPeople.split(",@");
  }

  return { main: reminder, people, seller, tags };
}

const tagsInConfig = storage.tripTags.read() || [];
const availableTags: TagName[] = mergeStringLists([TAGS, tagsInConfig]);

const peopleInConfig = storage.people.read() || [];
const defaultPeople: Person[] = mergeStringLists([
  DEFAULT_PEOPLE,
  peopleInConfig,
]);

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 0.3rem;
  row-gap: 0.3rem;
`;
const MainInput = styled(Form.Input)`
  grid-column-start: 1;
  grid-column-end: span 2;
`;

const SellerInput = styled(Form.Input)`
  grid-column-start: 1;
  grid-column-end: span 1;
`;
const PeopleInput = styled(Form.Dropdown)`
  grid-column-start: 2;
  grid-column-end: span 2;

  &.div {
    margin-bottom: 0;
  }
`;

const Container = styled.div`
  margin-bottom: 1rem;
`;

function mergeStringLists(listOfStringLists: string[][]): string[] {
  /**
   * Return a list of unique strings. The order is preserved - items of the first list
   * are added first, then items in the second list, etc.
   */
  const flatList = listOfStringLists.flatMap((s) => s);

  const added = new Set<string>([]);

  const unique: string[] = [];
  for (const s of flatList) {
    if (added.has(s)) continue;

    added.add(s);
    unique.push(s);
  }

  return unique;
}

function DescriptionForm({
  description: raw,
  onChange: update,
}: DescriptionProps) {
  const description = stringToDescription({ raw });

  const [peopleAddedByUser, setPeopleAddedByUser] = useState<Person[]>([]);
  const selectablePeople = [
    ...defaultPeople,
    ...peopleAddedByUser, // TODO: add these to Settings
    ...description.people,
  ];

  function handleChange(_: any, { name, value }: InputOnChangeData): void {
    if (value === undefined) {
      return;
    }

    switch (name) {
      case DescriptionSubfield.main:
        handleMainChange(value);
        break;
      case DescriptionSubfield.seller:
        handleSellerChange(value);
        break;
    }
  }

  function handleMainChange(main: string): void {
    update(descriptionToString({ ...description, main }));
  }

  function handleSellerChange(seller: string): void {
    update(descriptionToString({ ...description, seller }));
  }

  function handlePeopleChange(_: any, { value }: DropdownProps): void {
    const selectedPeople: Person[] = value as string[];
    if (!selectedPeople) {
      return;
    }

    // Ensure people added by the user are shown amongst the dropdown options
    const previous = new Set(selectablePeople);
    const addedByUser: Person[] = [];
    selectedPeople.forEach((person) => {
      if (previous.has(person)) return;
      addedByUser.push(person);
    });

    if (addedByUser.length > 0) {
      setPeopleAddedByUser([...peopleAddedByUser, ...addedByUser]);
    }

    const people = selectedPeople.sort();

    update(descriptionToString({ ...description, people: people }));
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
    <Container>
      <Shortcuts
        data={SHORTCUTS.map(({ id, buttonName }) => ({ id, buttonName }))}
        select={handleShortcutSelection}
      />

      <Grid>
        <MainInput
          name={DescriptionSubfield.main}
          placeholder="Description"
          value={description.main}
          fluid
          onChange={handleChange}
        />
        <SellerInput
          name={DescriptionSubfield.seller}
          placeholder="seller"
          value={description.seller}
          fluid
          onChange={handleChange}
        />
        <PeopleInput
          placeholder="people"
          multiple
          search
          fluid
          selection
          options={selectablePeople.map((person) => ({
            key: person,
            text: person,
            value: person,
          }))}
          value={description.people}
          onChange={handlePeopleChange}
          allowAdditions
        />
      </Grid>

      <TagSelector
        tags={availableTags}
        selected={new Set(description.tags)}
        onChange={handleTagChange}
      />
    </Container>
  );
}

export default DescriptionForm;
