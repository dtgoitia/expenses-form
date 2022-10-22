import Shortcuts from "../../PredefinedButtons";
import { DEFAULT_PEOPLE, SHORTCUTS, TAGS } from "../../constants";
import { Person, Seller, ShortcutId, TagName } from "../../domain/model";
import storage from "../../localStorage";
import TagSelector, { SelectableTag } from "./TagSelector";
import { useEffect, useState } from "react";
import { DropdownProps, Form, InputOnChangeData } from "semantic-ui-react";
import styled from "styled-components";

interface DescriptionProps {
  onChange: (description: string) => void;
}

enum DescriptionSubfield {
  main = "main",
  people = "people",
  seller = "seller",
}

interface buildDescriptionArgs {
  main: string | undefined;
  people: Person[];
  seller: Seller;
  selectedTags: TagName[];
}

function buildDescription({
  main,
  people,
  seller,
  selectedTags,
}: buildDescriptionArgs): string {
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

  if (selectedTags.length > 0) {
    const formattedTags = selectedTags.map((name) => `#${name}`).join(" ");
    chunks.push(formattedTags);
  }

  return chunks.join(" ");
}

const tagsInConfig = storage.tripTags.read() || [];
const defaultTags: SelectableTag[] = mergeStringLists([TAGS, tagsInConfig]).map(
  (tag: string): SelectableTag => ({ name: tag, selected: false })
);

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

function Description({ onChange }: DescriptionProps) {
  const [main, setMain] = useState<string | undefined>();
  const [seller, setSeller] = useState<Seller | undefined>();
  const [people, setPeople] = useState<Person[]>([]);
  const [selectableTags, setSelectableTags] =
    useState<SelectableTag[]>(defaultTags);

  const selectedTags: TagName[] = selectableTags
    .filter((tag) => tag.selected === true)
    .map((tag) => tag.name);

  const [peopleAddedByUser, setPeopleAddedByUser] = useState<Person[]>([]);
  const selectablePeople = [...defaultPeople, ...peopleAddedByUser];

  function handleChange(_: any, { name, value }: InputOnChangeData): void {
    if (value === undefined) {
      return;
    }

    switch (name) {
      case DescriptionSubfield.main:
        setMain(value);
        break;
      case DescriptionSubfield.seller:
        setSeller(value);
        break;
    }
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

    setPeople(selectedPeople.sort());
  }

  useEffect(() => {
    if (main === undefined && seller === undefined) {
      return;
    }

    const fullDescription = buildDescription({
      main,
      people,
      seller: seller as Seller,
      selectedTags,
    });

    onChange(fullDescription);
  }, [onChange, main, seller, people, selectedTags]);

  function handleShortcutSelection(id: ShortcutId) {
    const shortcut = SHORTCUTS.filter((shortcut) => shortcut.id === id)[0];

    setMain(shortcut.main);
    setSeller(shortcut.seller);
    setPeople(shortcut.people);

    // Change tag desired selection
    const mustSelect = new Set(shortcut.tags);
    const rightSelection = selectableTags.map(({ name }) => ({
      name,
      selected: mustSelect.has(name),
    }));
    setSelectableTags(rightSelection);
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
          value={main}
          fluid
          onChange={handleChange}
        />
        <SellerInput
          name={DescriptionSubfield.seller}
          placeholder="seller"
          value={seller}
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
          value={people}
          onChange={handlePeopleChange}
          allowAdditions
        />
      </Grid>
      <TagSelector tags={selectableTags} onChange={setSelectableTags} />
    </Container>
  );
}

export default Description;
