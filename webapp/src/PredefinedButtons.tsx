import { Button } from "semantic-ui-react";
import styled from "styled-components";

interface ButtonData {
  name: string;
  description: string;
}

interface PredefinedOptionsProps {
  data: ButtonData[];
  select: (buttonName: string) => void;
}

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;

  margin-top: 0.5rem;
  margin-bottom: 1rem;
  row-gap: 0.5rem;
`;

function PredefinedOptions({ data, select }: PredefinedOptionsProps) {
  return (
    <Container>
      {data.map((button, i) => (
        <Button
          key={`stacked-button-${i}`}
          onClick={() => select(button.description)}
        >
          {button.name}
        </Button>
      ))}
    </Container>
  );
}

export default PredefinedOptions;
