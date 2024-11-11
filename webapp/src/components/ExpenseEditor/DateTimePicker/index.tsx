import { Button } from "../../Button";
import { DatePicker } from "../../DateTimePicker/DatePicker";
import { TimePicker } from "../../DateTimePicker/TimePicker";
import FormattedDate from "./FormattedDate";
import { Dialog } from "@blueprintjs/core";
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

const FormattedDateContainer = styled.div`
  background-color: white;
  padding: 1rem;
`;

interface Props {
  date: Date;
  defaultDate: Date;
  onChange: (date: Date) => void;
}

function DateTimePicker({ defaultDate, date, onChange: setDate }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Container className="bp4-text-large">
      <Row>
        <Dialog
          title="Select a date"
          isOpen={isOpen}
          autoFocus={true}
          canOutsideClickClose={true}
          isCloseButtonShown={true}
          canEscapeKeyClose={true}
          transitionDuration={0}
          onClose={() => setIsOpen(false)}
        >
          <div className="bp4-dialog-body">
            <div className="flex flex-col gap-8 justify-center align-center pb-4">
              <DatePicker value={date} defaultValue={defaultDate} onChange={setDate} />
              <TimePicker value={date} onChange={setDate} />
            </div>
            <FormattedDateContainer>
              <FormattedDate date={date} />
            </FormattedDateContainer>
          </div>
          <div className="bp4-dialog-footer">Changes are saved automatically</div>
        </Dialog>
      </Row>
      <Row>
        <FormattedDate date={date} />
        <Button
          text={isOpen ? "Close" : "Edit time"}
          disabled={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        />
      </Row>
    </Container>
  );
}

export default DateTimePicker;
