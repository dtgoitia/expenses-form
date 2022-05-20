import { Button, Collapse } from "@blueprintjs/core";
import {
  TimePicker as BlueprintTimePicker,
  TimePrecision,
} from "@blueprintjs/datetime";
import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  margin: 1rem;
  display: flex;
  justify-content: space-between;
`;

interface Props {
  date: Date;
  defaultDate: Date;
  onChange: (date: Date) => void;
}

function DateTimePicker({ defaultDate, date, onChange }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Container>
      <Collapse isOpen={isOpen}>
        <BlueprintTimePicker
          value={date}
          defaultValue={defaultDate}
          showArrowButtons
          precision={TimePrecision.SECOND}
          onChange={onChange}
        />
      </Collapse>

      <Button
        text={isOpen ? "Close" : "Edit time"}
        onClick={() => setIsOpen(!isOpen)}
      />
    </Container>
  );
}

export default DateTimePicker;
