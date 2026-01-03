import ExpenseQueue from "../ExpenseQueue";
import { Button } from "../components/Button";
import CenteredPage from "../components/CenteredPage";
import DownloadJson from "../components/DownloadJson";
import { dateToISOLocale, now } from "../datetimeUtils";
import { App } from "../domain/app";
import { AppExpense, AddExpenseArgs } from "../domain/expenses";
import { Expense, ExpenseId, PaymentAccount } from "../domain/model";
import { unreachable } from "../lib/devex";
import Paths from "../routes";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { first } from "rxjs";

interface Props {
  app: App;
}

export function ExpensesPage({ app }: Props) {
  const navigate = useNavigate();

  const [appExpenses, setAppExpenses] = useState<AppExpense[]>([]);
  const [defaultAccount, setDefaultAccount] = useState<PaymentAccount | undefined>();

  useEffect(() => {
    const subscription = app.expenseManager.change$.subscribe((_) => {
      setDefaultAccount(app.paymentAccountsManager.getDefault());
      setAppExpenses(app.expenseManager.getAll());
    });

    setDefaultAccount(app.paymentAccountsManager.getDefault());
    setAppExpenses(app.expenseManager.getAll());

    return () => {
      subscription.unsubscribe();
    };
  }, [app]);

  function navigateToExpense(id: ExpenseId): void {
    navigate(Paths.expenseEditor.replace(":expenseId", id));
  }

  function handleAddExpense(): void {
    app.expenseManager.change$.pipe(first()).subscribe((change) => {
      navigateToExpense(change.expenseId);
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
      splits: [],
    };

    app.expenseManager.add(newExpense);
  }

  function refreshPage() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Location/reload
    // `.reload(true)` is supported in Firefox and Chrome, but it's not standard
    // @ts-ignore
    window.location.reload(true);
  }

  const canAddExpense = defaultAccount !== undefined;

  const publishableExpenses = appExpenses
    .filter((appExpense) => appExpense.readyToPublish)
    .map((appExpense) => appExpense.expense) as Expense[];

  return (
    <CenteredPage>
      <Button text="reload PWA" icon="rotate" onClick={refreshPage} />
      {canAddExpense ? (
        <>
          <div className="flex justify-center items-center p-4" role="warning">
            <div>Add expense or select an existing one</div>
          </div>
          <Button text="Add expense" onClick={handleAddExpense} />
        </>
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
          onEditExpense={navigateToExpense}
          onDelete={(id: ExpenseId) => app.expenseManager.delete(id)}
          app={app}
        />
      </div>
    </CenteredPage>
  );
}
