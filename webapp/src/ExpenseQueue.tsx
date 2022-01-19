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

const MONTH_INDEX_TO_NAME: { [x: number]: string } = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

function formatDate(isoDatetime: string): string {
  const date = new Date(isoDatetime);

  const month = date.getMonth() + 1;
  const day = date.getDate() + 1;

  const formattedMonth = MONTH_INDEX_TO_NAME[month];
  const formattedDay = day > 9 ? `${day}` : `0${day}`;

  return `${formattedMonth}-${formattedDay}`;
}

interface SubmittedExpensesProps {
  id?: string;
  amount: number;
  currency: string;
  description: string;
  datetime: string; // "2022-01-17T08:19:26+00:00"
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
        {formatDate(datetime)}{" "}
        <b>
          {amount} {currency}
        </b>{" "}
        {description}
      </DescriptionSlot>
    </StyledQueuedExpense>
  );
}

function sortExpensesByDate(
  a: SubmittedExpensesProps,
  b: SubmittedExpensesProps
): number {
  const date_a = new Date(a.datetime);
  const date_b = new Date(b.datetime);

  if (date_a < date_b) {
    return -1;
  }

  return 1;
}

interface ExpenseQueueProps {
  queue: QueuedExpenseProps[];
  submitted: SubmittedExpensesProps[];
}
function ExpensesQueue({ queue, submitted }: ExpenseQueueProps) {
  const sortedSubmitted = submitted.concat().sort(sortExpensesByDate);

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
      {sortedSubmitted.map((item) => (
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
