import hasura, { HasuraExpense } from "./clients/hasura";
import { Expense } from "./domain";
import { useEffect, useState } from "react";
import { Icon, Loader } from "semantic-ui-react";
import styled from "styled-components";

const DeleteActionSlot = styled.div`
  order: 1;
  flex-grow: 0;
  flex-shrink: 1;
`;
const SubmittedStatusSlot = styled.div`
  order: 2;
  flex-grow: 0;
  flex-shrink: 1;
`;
const DescriptionSlot = styled.div`
  order: 3;
  flex-grow: 1;
  flex-shrink: 1;
`;
const StyledListItem = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

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

interface ListItemProps {
  expense: Expense;
}
function ListItem({ expense }: ListItemProps) {
  return (
    <StyledListItem>
      <DeleteActionSlot></DeleteActionSlot>
      <SubmittedStatusSlot>
        <Icon name="check" />
      </SubmittedStatusSlot>
      <DescriptionSlot>
        {formatDate(expense.datetime)}{" "}
        <b>
          {expense.amount} {expense.currency}
        </b>{" "}
        {expense.description}
      </DescriptionSlot>
    </StyledListItem>
  );
}

function sortExpensesByDate(a: Expense, b: Expense): number {
  const date_a = new Date(a.datetime);
  const date_b = new Date(b.datetime);

  if (date_a < date_b) {
    return -1;
  }

  return 1;
}

const Container = styled.div`
  display: flex;
  flex: row nowrap;
  justify-content: center;
  gap: 0.8rem;
`;
const LoaderText = styled.span`
  font-size: 0.8rem;
`;

function List() {
  const [expenses, setExpenses] = useState<HasuraExpense[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const subscription = hasura.expenses$.subscribe((request) => {
      setLoading(request.loading);
      if (request.data === undefined) return;
      setExpenses(request.data);
    });

    hasura.getExpenses();

    return subscription.unsubscribe;
  }, []);

  if (loading) {
    return (
      <Container>
        <Loader active inline size="mini" />
        <LoaderText>Loading submitted expenses from server... </LoaderText>
      </Container>
    );
  }

  const sortedByDate = expenses.concat().sort(sortExpensesByDate);

  return (
    <div>
      {sortedByDate.map((expense, i) => (
        <ListItem key={`queued-expense-${i}`} expense={expense} />
      ))}
    </div>
  );
}

const ExpenseQueue = List;

export default ExpenseQueue;
