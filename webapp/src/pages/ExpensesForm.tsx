import ExpenseQueue from "../ExpenseQueue";
import { Button } from "../components/Button";
import CenteredPage from "../components/CenteredPage";
import DownloadJson from "../components/DownloadJson";
import ExpenseEditor from "../components/ExpenseEditor";
import { dateToISOLocale, now } from "../datetimeUtils";
import { App } from "../domain/app";
import { AppExpense, AddExpenseArgs } from "../domain/expenses";
import { DraftExpense, Expense, ExpenseId, PaymentAccount } from "../domain/model";
import { unreachable } from "../lib/devex";
import Paths from "../routes";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      throw unreachable("No default account found");
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

  const publishableExpenses = appExpenses
    .filter((appExpense) => appExpense.readyToPublish)
    .map((appExpense) => appExpense.expense) as Expense[];

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
        canAddExpense && (
          <div className="flex justify-center items-center p-4" role="warning">
            <div>Add expense or select an existing one</div>
          </div>
        )
      )}
      {expenseUnderEdition ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button text="Close" onClick={handleStopEditingExpense} />
        </div>
      ) : canAddExpense ? (
        <Button text="Add expense" onClick={handleAddExpense} />
      ) : (
        <div className="flex justify-center p-4" role="warning">
          <div className="flex flex-col gap-4 items-center">
            <div>
              Must &nbsp;<b>select a default account</b>&nbsp; in "Accounts" page to add
              an expense.
            </div>
            <Link to={Paths.paymentAccounts}>
              <Button text="Go to Accounts" />
            </Link>
          </div>
        </div>
      )}

      {publishableExpenses.length > 0 && (
        <DownloadJson expenses={publishableExpenses} app={app} />
      )}

      <div className="mt-4">
        <ExpenseQueue
          expenses={appExpenses}
          underEdition={expenseIdUnderEdition}
          onEditExpense={handleOnEditExpense}
          onDelete={(id: ExpenseId) => app.expenseManager.delete(id)}
          app={app}
        />
      </div>
    </CenteredPage>
  );
}

export default ExpensesForm;
