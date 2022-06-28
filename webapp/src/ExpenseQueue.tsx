import hasura from "./clients/hasura";
import { PAYMENT_ACCOUNTS } from "./constants";
import { Expense, ExpenseId } from "./domain";
import { Collapse } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import { Button, Icon, Loader } from "semantic-ui-react";
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
  const day = date.getDate();

  const formattedMonth = MONTH_INDEX_TO_NAME[month];
  const formattedDay = day > 9 ? `${day}` : `0${day}`;

  return `${formattedMonth}-${formattedDay}`;
}

const LoadingIconContainer = styled.div`
  margin-right: 0.4rem;
`;

interface ListItemProps {
  expense: Expense;
  deleting: boolean;
  remove: () => void;
}
function ListItem({ expense, deleting, remove }: ListItemProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleOnDeleteClick() {
    if (deleting) return; // Do nothing if already removing item
    remove();
  }

  return (
    <StyledListItem>
      <DeleteActionSlot>
        <Button onClick={handleOnDeleteClick}>
          {deleting ? (
            <Loader active inline size="mini" />
          ) : (
            <Icon name="delete" />
          )}
        </Button>
      </DeleteActionSlot>
      <SubmittedStatusSlot onClick={() => setIsOpen(!isOpen)}>
        {expense.submitted ? (
          <Icon name="check" />
        ) : (
          <LoadingIconContainer>
            <Loader active inline size="mini" />
          </LoadingIconContainer>
        )}
      </SubmittedStatusSlot>
      <DescriptionSlot onClick={() => setIsOpen(!isOpen)}>
        {formatDate(expense.datetime)}{" "}
        <b>
          {expense.amount} {expense.currency}
        </b>{" "}
        {expense.description}
        <Collapse isOpen={isOpen}>
          <pre>id: {expense.id}</pre>
          <pre>datetime: {expense.datetime}</pre>
          <pre>paid_with: {PAYMENT_ACCOUNTS[expense.paid_with].name}</pre>
        </Collapse>
      </DescriptionSlot>
    </StyledListItem>
  );
}

function sortExpensesByDate(a: ExpenseItem, b: ExpenseItem): number {
  const date_a = new Date(a.expense.datetime);
  const date_b = new Date(b.expense.datetime);

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

interface ExpenseItem {
  expense: Expense;
  deleting: boolean;
}

function List() {
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [listIsLoading, setListIsLoading] = useState(false);

  function deleteExpense(id: ExpenseId) {
    hasura.deleteExpense(id);
  }

  useEffect(() => {
    const subscription = hasura.expenses$.subscribe((request) => {
      setListIsLoading(request.loading);

      if (request.data === undefined) return;

      const updatedItems = (request.data as Expense[]).map((expense) => ({
        deleting: false,
        expense,
      }));
      setItems(updatedItems);
    });

    hasura.getExpenses();

    return subscription.unsubscribe;
  }, []);

  if (listIsLoading) {
    return (
      <Container>
        <Loader active inline size="mini" />
        <LoaderText>Loading submitted expenses from server... </LoaderText>
      </Container>
    );
  }

  const itemsSortedByDate = items.concat().sort(sortExpensesByDate);

  return (
    <div>
      {itemsSortedByDate.map(({ expense, deleting }, i) => {
        const onDelete = () => {
          const updatedItems = items.map((item) => {
            if (item.expense.id !== expense.id) return item;
            return { deleting: true, expense };
          });
          setItems(updatedItems);
          deleteExpense(expense.id);
        };
        return (
          <ListItem
            key={`queued-expense-${i}`}
            deleting={deleting}
            expense={expense}
            remove={onDelete}
          />
        );
      })}
    </div>
  );
}

const ExpenseQueue = List;

export default ExpenseQueue;
