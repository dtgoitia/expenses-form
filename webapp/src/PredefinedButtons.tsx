import { ShortcutId } from "./domain";
import { SyntheticEvent } from "react";
import { Button } from "semantic-ui-react";
import styled from "styled-components";

interface ButtonData {
  id: ShortcutId;
  buttonName: string;
}

interface ShortcutsProps {
  data: ButtonData[];
  select: (id: ShortcutId) => void;
}

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;

  margin-top: 0.5rem;
  margin-bottom: 1rem;
  row-gap: 0.5rem;
`;

function Shortcuts({ data, select }: ShortcutsProps) {
  function handleClick(e: SyntheticEvent, id: ShortcutId) {
    e.preventDefault();
    select(id);
  }

  return (
    <Container>
      {data.map((shortcut, i) => (
        <Button
          key={`shortcut-${i}`}
          onClick={(e) => handleClick(e, shortcut.id)}
        >
          {shortcut.buttonName}
        </Button>
      ))}
    </Container>
  );
}

export default Shortcuts;
