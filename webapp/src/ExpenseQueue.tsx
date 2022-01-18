import { Icon } from "semantic-ui-react";
import styled from "styled-components";

// interface ExpenseData {
//   amount: number;
//   currency: Currency;
//   description: string;
//   datetime: ISOString;
//   paid_with: Account;
// }

const DeleteSlot = styled.div`
  order: 1;
  flex-grow: 0;
  flex-shrink: 1;
`;
const SubmittedSlot = styled.div`
  order: 2;
  flex-grow: 0;
  flex-shrink: 1;
`;
const DescriptionSlot = styled.div`
  order: 3;
  flex-grow: 1;
  flex-shrink: 1;
`;
const StyledQueuedExpense = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

interface QueuedExpenseProps {
  submitted: boolean;
  description: string;
  data: any;
  onDelete: () => void;
}
function ExpenseInQueue({ submitted, description, data }: QueuedExpenseProps) {
  const iconName = submitted ? "check" : "spinner";
  return (
    <StyledQueuedExpense>
      <DeleteSlot></DeleteSlot>
      <SubmittedSlot>
        <Icon loading name={iconName} />
      </SubmittedSlot>
      <DescriptionSlot>
        <b>
          {data.amount} {data.currency}
        </b>{" "}
        {description}
      </DescriptionSlot>
    </StyledQueuedExpense>
  );
}

interface SubmittedExpensesProps {
  id?: string;
  amount: number;
  currency: string;
  description: string;
  datetime: string;
}
function SubmittedExpense({
  datetime,
  amount,
  currency,
  description,
}: SubmittedExpensesProps) {
  return (
    <StyledQueuedExpense>
      <DeleteSlot></DeleteSlot>
      <SubmittedSlot>
        <Icon name="check" />
      </SubmittedSlot>
      <DescriptionSlot>
        <b>
          {amount} {currency}
        </b>{" "}
        {description}
      </DescriptionSlot>
    </StyledQueuedExpense>
  );
}

interface ExpenseQueueProps {
  queue: QueuedExpenseProps[];
  submitted: SubmittedExpensesProps[];
}
function ExpensesQueue({ queue, submitted }: ExpenseQueueProps) {
  return (
    <div>
      {queue.map((item) => (
        <ExpenseInQueue
          submitted={item.submitted}
          description={item.description}
          data={item.data}
          onDelete={() => {
            alert("Deleting");
          }}
        />
      ))}
      {submitted.map((item) => (
        <SubmittedExpense
          datetime={item.datetime}
          amount={item.amount}
          currency={item.currency}
          description={item.description}
        />
      ))}
    </div>
  );
}

export default ExpensesQueue;
