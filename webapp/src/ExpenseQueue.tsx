import { dateToLocale } from "./datetimeUtils";
import { App } from "./domain/app";
import { AppExpense } from "./domain/expenses";
import { DraftExpense, ExpenseId } from "./domain/model";
import { errorsService } from "./services/errors";
import { descriptionToSplitwiseFormat } from "./splitwise";
import { Button, Switch } from "@blueprintjs/core";
import { Collapse } from "@blueprintjs/core";
import { useState } from "react";
import styled from "styled-components";

const ActionSlot = styled.div`
  order: 1;
  flex-grow: 0;
  flex-shrink: 1;
`;
const DescriptionSlot = styled.div`
  order: 2;
  flex-grow: 1;
  flex-shrink: 1;
`;
const StyledListItem = styled.div`
  display: flex;
  flex-flow: row nowrap;
  column-gap: 0.5rem;
  padding: 0.3rem;
`;
const RedListItem = styled(StyledListItem)`
  background-color: rgba(255, 0, 0, 0.2);
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

function formatAmount(expense: DraftExpense): string {
  const isPaidInAnotherCurrency = !!expense.originalAmount;

  if (isPaidInAnotherCurrency) {
    return `${expense.originalAmount} ${expense.originalCurrency}`;
  }

  if (expense.amount === undefined) {
    return `?`;
  }

  return `${expense.amount} ${expense.currency}`;
}

interface ListItemProps {
  appExpense: AppExpense;
  editing: boolean;
  deleting: boolean;
  edit: () => void;
  remove: () => void;
  deleteMode: boolean;
  app: App;
}
function ListItem({
  appExpense,
  editing,
  deleting,
  edit,
  remove,
  deleteMode,
  app,
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

  const account = app.paymentAccountsManager.get({ id: expense.paid_with });

  let splitwiseDescription = descriptionToSplitwiseFormat(expense.description);

  const ListItem = appExpense.readyToPublish ? StyledListItem : RedListItem;

  return (
    <ListItem>
      <ActionSlot>
        {deleteMode ? (
          <Button onClick={handleOnDeleteClick} loading={deleting} icon="delete" />
        ) : (
          <Button onClick={handleOnEditClick} loading={editing} icon="edit" />
        )}
      </ActionSlot>

      <DescriptionSlot>
        <span onClick={() => setIsOpen(!isOpen)}>
          {formatDate(expense.datetime)} <b>{formatAmount(expense)}</b>{" "}
          {expense.description}
        </span>
        <Collapse isOpen={isOpen}>
          <pre>id: {expense.id}</pre>
          <pre>datetime: {dateToLocale(expense.datetime)}</pre>
          <pre>paid_with: {account && account.name}</pre>
          <pre>
            original_amount: {expense.originalAmount} {expense.originalCurrency}
          </pre>
          <p onClick={() => copyToClipboard(expense.description)}>
            Click to copy description
          </p>
          <pre onClick={() => copyToClipboard(splitwiseDescription)}>
            Splitwise: {splitwiseDescription}
          </pre>
        </Collapse>
      </DescriptionSlot>
    </ListItem>
  );
}

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
  app: App;
}
function ExpenseList({ expenses, underEdition, onEditExpense, onDelete, app }: Props) {
  const [inDeletionMode, setInDeletionMode] = useState<boolean>(false);

  function toggleDeletionMode(): void {
    setInDeletionMode(!inDeletionMode);
  }

  return (
    <div>
      <Switch label="deletion mode" onClick={() => toggleDeletionMode()} />

      {expenses.length > 0 ? (
        expenses.map((appExpense) => {
          const id = appExpense.expense.id;

          return (
            <ListItem
              key={`queued-expense-${id}`}
              editing={underEdition === id}
              deleting={false} // TODO: integrate this in the new domain
              appExpense={appExpense}
              edit={() => onEditExpense(id)}
              remove={() => onDelete(id)}
              deleteMode={inDeletionMode}
              app={app}
            />
          );
        })
      ) : (
        <p>No expenses :)</p>
      )}
    </div>
  );
}

const ExpenseQueue = ExpenseList;

export default ExpenseQueue;
