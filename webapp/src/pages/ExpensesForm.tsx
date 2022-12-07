import ExpenseQueue from "../ExpenseQueue";
import CenteredPage from "../components/CenteredPage";
import DownloadJson from "../components/DownloadJson";
import ExpenseEditor from "../components/ExpenseEditor";
import { DEFAULT_CURRENCY, PAYMENT_ACCOUNTS } from "../constants";
import { now } from "../datetimeUtils";
import { ExpenseManager, AppExpense, AddExpenseArgs } from "../domain/expenses";
import { DraftExpense, Expense, ExpenseId } from "../domain/model";
import storage from "../localStorage";
import Paths from "../routes";
import { Button } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { first } from "rxjs";

interface ExpensesFormProps {
  expenseManager: ExpenseManager;
}

function ExpensesForm({ expenseManager }: ExpensesFormProps) {
  const [appExpenses, setAppExpenses] = useState<AppExpense[]>([]);
  const [expenseIdUnderEdition, setExpenseUnderEdition] = useState<ExpenseId | undefined>(
    undefined
  );

  useEffect(() => {
    const subscription = expenseManager.change$.subscribe((_) => {
      setAppExpenses(expenseManager.getAll());
    });

    setAppExpenses(expenseManager.getAll());

    return subscription.unsubscribe;
  }, [expenseManager]);

  function handleAddExpense() {
    expenseManager.change$.pipe(first()).subscribe((change) => {
      setExpenseUnderEdition(change.expenseId);
    });

    // TODO: use a reactive AccountManager to handle these things...
    const defaultAccountAlias = storage.defaultPaymentAccount.read();
    const defaultAccount = PAYMENT_ACCOUNTS.filter(
      (account) => account.alias === defaultAccountAlias
    )[0];

    const newExpense: AddExpenseArgs = {
      datetime: now(),
      amount: undefined,
      currency: DEFAULT_CURRENCY,
      description: "",
      shared: false,
      pending: defaultAccount.pending,
      paid_with: defaultAccount.id,
    };

    expenseManager.add(newExpense);
  }

  function handleStopEditingExpense(): void {
    setExpenseUnderEdition(undefined);
  }

  function refreshPage() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Location/reload
    // `.reload(true)` is supported in Firefox and Chrome, but it's not standard
    // @ts-ignore
    window.location.reload(true);
  }

  function handleOnEditExpense(id: ExpenseId): void {
    setExpenseUnderEdition(id);
  }

  function handleExpenseEdition(expense: DraftExpense): void {
    console.debug(`ExpensesForm::handleExpenseEdition::expense`, expense);
    expenseManager.update(expense);
  }

  const expenseUnderEdition =
    expenseIdUnderEdition && expenseManager.get(expenseIdUnderEdition);

  const publishableExpenses = appExpenses
    .filter((appExpense) => appExpense.readyToPublish)
    .map((appExpense) => appExpense.expense) as Expense[];

  return (
    <CenteredPage>
      <Button large icon="refresh" onClick={refreshPage}>
        reload PWA
      </Button>
      <Link to={Paths.settings}>
        <Button large icon="cog">
          Settings
        </Button>
      </Link>

      {expenseUnderEdition ? (
        <ExpenseEditor
          expense={expenseUnderEdition.expense}
          update={handleExpenseEdition}
        />
      ) : (
        <p>Add expense or select an existing one</p>
      )}

      {expenseIdUnderEdition ? (
        <Button large text="Close" onClick={handleStopEditingExpense} />
      ) : (
        <Button large text="Add expense" onClick={handleAddExpense} />
      )}

      <DownloadJson expenses={publishableExpenses} />

      <ExpenseQueue
        expenses={appExpenses}
        underEdition={expenseIdUnderEdition}
        onEditExpense={handleOnEditExpense}
        onDelete={(id: ExpenseId) => expenseManager.delete(id)}
      />
    </CenteredPage>
  );
}

export default ExpensesForm;
