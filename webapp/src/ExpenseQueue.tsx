import { Button } from "./components/Button";
import { Collapse } from "./components/Collapse";
import { Toggle } from "./components/Toggle";
import { customISOStringToDate, dateToLocale } from "./datetimeUtils";
import { App } from "./domain/app";
import { AppExpense, groupExpensesByLocalDate } from "./domain/expenses";
import { CurrencyAmount, CurrencyCode, DraftExpense, ExpenseId } from "./domain/model";
import { NUMBER_FORMATTER } from "./lib/number";
import { errorsService } from "./services/errors";
import { descriptionToSplitwiseFormat } from "./splitwise";
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
  function _format(amount: CurrencyAmount, currency: CurrencyCode): string {
    return `${NUMBER_FORMATTER.format(amount)} ${currency}`;
  }

  const isPaidInAnotherCurrency = !!expense.originalAmount;

  if (isPaidInAnotherCurrency) {
    return _format(
      expense.originalAmount as CurrencyAmount,
      expense.originalCurrency as CurrencyCode
    );
  }

  if (expense.amount === undefined) {
    return `?`;
  }

  return _format(expense.amount, expense.currency);
}

interface ListItemProps {
  appExpense: AppExpense;
  deleting: boolean;
  edit: () => void;
  remove: () => void;
  deleteMode: boolean;
  app: App;
}
function ListItem({
  appExpense,
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

  let css = "flex flex-row flex-nowrap gap-x-2" + " p-2 dark:p-2";
  if (!appExpense.readyToPublish) {
    css += " bg-red-200 dark:bg-red-900";
  }

  return (
    <div className={css}>
      <ActionSlot>
        {deleteMode ? (
          <Button onClick={handleOnDeleteClick} icon="bin" />
        ) : (
          <Button onClick={handleOnEditClick} icon="pencil" />
        )}
      </ActionSlot>

      <DescriptionSlot>
        <span onClick={() => setIsOpen(!isOpen)}>
          <b>{formatAmount(expense)}</b> {expense.description}
        </span>
        <Collapse isOpen={isOpen}>
          <pre>id: {expense.id}</pre>
          <pre>datetime: {dateToLocale(customISOStringToDate(expense.datetime))}</pre>
          <pre>paid_with: {account && account.name}</pre>
          <pre>
            amount:{" "}
            {expense.amount === undefined
              ? "--"
              : `${NUMBER_FORMATTER.format(expense.amount)} ${expense.currency}`}
          </pre>
          <pre>
            original_amount:{" "}
            {expense.originalAmount === undefined
              ? "--"
              : `${NUMBER_FORMATTER.format(expense.originalAmount)} ${
                  expense.originalCurrency
                }`}
          </pre>
          <pre>
            splits:{" "}
            {expense.splits.length === 0 ? "--" : JSON.stringify(expense.splits, null, 2)}
          </pre>
          <div className="flex flex-row gap-3 pt-1">
            <Button
              text="Copy full description"
              onClick={() => copyToClipboard(expense.description)}
            />
            <Button
              text="Copy Splitwise description"
              onClick={() => copyToClipboard(splitwiseDescription)}
            />
          </div>
        </Collapse>
      </DescriptionSlot>
    </div>
  );
}

interface Props {
  expenses: AppExpense[];
  onEditExpense: (id: ExpenseId) => void;
  onDelete: (id: ExpenseId) => void;
  app: App;
}
function ExpenseList({ expenses, onEditExpense, onDelete, app }: Props) {
  const [inDeletionMode, setInDeletionMode] = useState<boolean>(false);

  function toggleDeletionMode(): void {
    setInDeletionMode(!inDeletionMode);
  }

  const expensesByDate = groupExpensesByLocalDate(expenses);

  return (
    <div>
      <div className="flex flex-row justify-end">
        <Toggle
          uniqueKey={"expenses"}
          isOn={inDeletionMode}
          labelOn="enable deletion mode"
          labelOff="exit deletion mode"
          onToggle={() => toggleDeletionMode()}
        />
      </div>

      {expensesByDate.length > 0 ? (
        expensesByDate.map(([isoDate, expensesInDay]) => {
          const date = formatDate(new Date(Date.parse(isoDate)));
          return (
            <div key={`${isoDate}-expenses`}>
              <div className="pt-4 p-2">
                <b>{date}</b>
              </div>
              <div>
                {expensesInDay.map((appExpense) => {
                  const id = appExpense.expense.id;
                  return (
                    <ListItem
                      key={`queued-expense-${id}`}
                      deleting={false} // TODO: integrate this in the new domain
                      appExpense={appExpense}
                      edit={() => onEditExpense(id)}
                      remove={() => onDelete(id)}
                      deleteMode={inDeletionMode}
                      app={app}
                    />
                  );
                })}
              </div>
            </div>
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
