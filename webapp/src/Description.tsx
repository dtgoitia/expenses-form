import StyledTagSelector, { Tag, TagName } from "./TagSelector";
import { DEFAULT_PEOPLE, TAGS } from "./constants";
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

type Seller = string;
type Person = string;

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
    chunks.push(main);
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

const defaultTags: Tag[] = TAGS.map((name) => ({ name: name, picked: false }));

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

function Description({ onChange }: DescriptionProps) {
  const [main, setMain] = useState<string | undefined>();
  const [seller, setSeller] = useState<Seller | undefined>();
  const [people, setPeople] = useState<Person[]>([]);
  const [tags, setTags] = useState<Tag[]>(defaultTags);
  const selectedTags: TagName[] = tags
    .filter((tag) => tag.picked === true)
    .map((tag) => tag.name);

  const [peopleAddedByUser, setPeopleAddedByUser] = useState<Person[]>([]);
  const selectablePeople = [...DEFAULT_PEOPLE, ...peopleAddedByUser];

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
    if (!selectedPeople || selectedPeople.length === 0) {
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

  return (
    <Container>
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
          onChange={handlePeopleChange}
          allowAdditions
        />
      </Grid>
      <StyledTagSelector tags={tags} onChange={setTags} />
    </Container>
  );
}

export default Description;
