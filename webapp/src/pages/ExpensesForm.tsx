import ExpenseQueue from "../ExpenseQueue";
import { Button } from "../components/Button";
import CenteredPage from "../components/CenteredPage";
import ExpenseEditor from "../components/ExpenseEditor";
import { dateToISOLocale, now } from "../datetimeUtils";
import { App } from "../domain/app";
import { AppExpense, AddExpenseArgs } from "../domain/expenses";
import { DraftExpense, Expense, ExpenseId, PaymentAccount } from "../domain/model";
import { useEffect, useState } from "react";
import { first } from "rxjs";

interface ExpensesFormProps {
  app: App;
}

function ExpensesForm({ app }: ExpensesFormProps) {
  const [appExpenses, setAppExpenses] = useState<AppExpense[]>([]);
  const [expenseIdUnderEdition, setExpenseUnderEdition] = useState<ExpenseId | undefined>(
    undefined
  );
  const [defaultAccount, setDefaultAccount] = useState<PaymentAccount | undefined>();

  useEffect(() => {
    const subscription = app.expenseManager.change$.subscribe((_) => {
      setDefaultAccount(app.paymentAccountsManager.getDefault());
      setAppExpenses(app.expenseManager.getAll());
    });

    setDefaultAccount(app.paymentAccountsManager.getDefault());
    setAppExpenses(app.expenseManager.getAll());

    return subscription.unsubscribe;
  }, [app]);

  function handleAddExpense(): void {
    app.expenseManager.change$.pipe(first()).subscribe((change) => {
      setExpenseUnderEdition(change.expenseId);
    });

    const defaultAccount = app.paymentAccountsManager.getDefault();
    if (defaultAccount === undefined) {
      // TODO: push to error service
      throw new Error("No default account found");
    }

    const newExpense: AddExpenseArgs = {
      datetime: dateToISOLocale(now()),
      amount: undefined,
      originalAmount: undefined,
      currency: defaultAccount.currency,
      originalCurrency: undefined,
      description: "",
      shared: false,
      pending: true,
      paid_with: defaultAccount.id,
    };

    app.expenseManager.add(newExpense);
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
    app.expenseManager.update(expense);
  }

  const canAddExpense = defaultAccount !== undefined;

  const expenseUnderEdition = expenseIdUnderEdition
    ? app.expenseManager.get(expenseIdUnderEdition)
    : undefined;

  return (
    <CenteredPage>
      <Button text="reload PWA" icon="rotate" onClick={refreshPage} />
      {expenseUnderEdition ? (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button text="Close" onClick={handleStopEditingExpense} />
          </div>
          <ExpenseEditor
            expense={expenseUnderEdition.expense}
            app={app}
            update={handleExpenseEdition}
          />
        </>
      ) : (
        <p>Add expense or select an existing one</p>
      )}
      {expenseIdUnderEdition ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button text="Close" onClick={handleStopEditingExpense} />
        </div>
      ) : (
        <Button
          text={
            canAddExpense
              ? "Add expense"
              : "Must select a default account to add an expense"
          }
          onClick={handleAddExpense}
          disabled={canAddExpense === false}
        />
      )}

      <ExpenseQueue
        expenses={appExpenses}
        underEdition={expenseIdUnderEdition}
        onEditExpense={handleOnEditExpense}
        onDelete={(id: ExpenseId) => app.expenseManager.delete(id)}
        app={app}
      />
    </CenteredPage>
  );
}

export default ExpensesForm;
