import FormattedDate from "./FormattedDate";
import { Button, Collapse } from "@blueprintjs/core";
import {
  TimePicker as BlueprintTimePicker,
  TimePrecision,
} from "@blueprintjs/datetime";
import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  margin: 1rem;
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
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
      <Row>
        <Collapse isOpen={isOpen}>
          <BlueprintTimePicker
            value={date}
            defaultValue={defaultDate}
            showArrowButtons
            precision={TimePrecision.SECOND}
            onChange={onChange}
          />
        </Collapse>
      </Row>
      <Row>
        <FormattedDate date={date} />
        <Button
          text={isOpen ? "Close" : "Edit time"}
          onClick={() => setIsOpen(!isOpen)}
        />
      </Row>
    </Container>
  );
}

export default DateTimePicker;
