import { PAYMENT_ACCOUNTS } from "./constants";
import { AppExpense } from "./domain/expenses";
import { ExpenseId } from "./domain/model";
import { errorsService } from "./services/errors";
import { descriptionToSplitwiseFormat } from "./splitwise";
import { Collapse } from "@blueprintjs/core";
import { useState } from "react";
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

function formatDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const formattedMonth = MONTH_INDEX_TO_NAME[month];
  const formattedDay = day > 9 ? `${day}` : `0${day}`;

  return `${formattedMonth}-${formattedDay}`;
}

function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard
    .writeText(text)
    .then((_) => {
      alert(`Copied to clipboard:\n${text}`);
    })
    .catch((reason) => {
      errorsService.add({
        header: "Error while trying to copy to clipboard",
        description: reason,
      });
    });
}

interface ListItemProps {
  appExpense: AppExpense;
  editing: boolean;
  deleting: boolean;
  edit: () => void;
  remove: () => void;
}
function ListItem({
  appExpense,
  editing,
  deleting,
  edit,
  remove,
}: ListItemProps) {
  const { expense } = appExpense;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handleOnEditClick() {
    console.debug(`ExpenseQueue.handleOnEditClick:: ${expense.id}`);
    edit();
  }

  function handleOnDeleteClick() {
    console.debug(`ExpenseQueue.handleOnDeleteClick:: ${expense.id}`);
    if (deleting) return; // Do nothing if already removing item
    remove();
  }

  const paymentAccount = PAYMENT_ACCOUNTS.filter(
    (account) => account.id === expense.paid_with
  )[0].name;

  let splitwiseDescription = descriptionToSplitwiseFormat(expense.description);

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
        <Button onClick={handleOnEditClick}>
          {editing ? (
            <Loader active inline size="mini" />
          ) : (
            <Icon name="edit" />
          )}
        </Button>
      </DeleteActionSlot>
      <SubmittedStatusSlot onClick={() => setIsOpen(!isOpen)}>
        <Icon name="check" />
      </SubmittedStatusSlot>
      <DescriptionSlot>
        <p onClick={() => setIsOpen(!isOpen)}>
          {formatDate(expense.datetime)}{" "}
          <b>
            {expense.amount} {expense.currency}
          </b>{" "}
          {expense.description}
        </p>
        <Collapse isOpen={isOpen}>
          <pre>id: {expense.id}</pre>
          <pre>datetime: {expense.datetime.toISOString()}</pre>
          <pre>paid_with: {paymentAccount}</pre>
          <p onClick={() => copyToClipboard(expense.description)}>
            Click to copy description
          </p>
          <pre onClick={() => copyToClipboard(splitwiseDescription)}>
            Splitwise: {splitwiseDescription}
          </pre>
        </Collapse>
      </DescriptionSlot>
    </StyledListItem>
  );
}

// function sortExpensesByDate(a: ExpenseItem, b: ExpenseItem): number {
//   const date_a = new Date(a.expense.datetime);
//   const date_b = new Date(b.expense.datetime);

//   if (date_a < date_b) {
//     return -1;
//   }

//   return 1;
// }

// const Container = styled.div`
//   display: flex;
//   flex: row nowrap;
//   justify-content: center;
//   gap: 0.8rem;
// `;
// const LoaderText = styled.span`
//   font-size: 0.8rem;
// `;

interface Props {
  expenses: AppExpense[];
  underEdition: ExpenseId | undefined;
  onEditExpense: (id: ExpenseId) => void;
  onDelete: (id: ExpenseId) => void;
}
function ExpenseList({
  expenses,
  underEdition,
  onEditExpense,
  onDelete,
}: Props) {
  return (
    <div>
      {expenses.map((appExpense) => {
        const {
          expense: { id },
        } = appExpense;

        return (
          <ListItem
            key={`queued-expense-${id}`}
            editing={underEdition === id}
            deleting={false} // TODO: integrate this in the new domain
            appExpense={appExpense}
            edit={() => onEditExpense(id)}
            remove={() => onDelete(id)}
          />
        );
      })}
    </div>
  );
}

const ExpenseQueue = ExpenseList;

export default ExpenseQueue;
