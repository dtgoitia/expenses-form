import CenteredPage from "../../components/CenteredPage";
import { App } from "../../domain/app";
import { AppExpense } from "../../domain/expenses";
import { DraftExpense } from "../../domain/model";
import Paths, { EXPENSE_ID } from "../../routes";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ExpenseSplitsEditor } from "./ExpenseSplitsEditor";
import { Button } from "../../components/Button";

interface Props {
  app: App;
}

export function ExpenseSplitsEditorPage({ app }: Props) {
  const { expenseId } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState<AppExpense | undefined>(undefined);

  if (expenseId === undefined) {
    navigate(Paths.root);
    return null;
  }

  useEffect(() => {
    const subscription = app.expenseManager.change$.subscribe((_) => {
      setExpense(app.expenseManager.get(expenseId));
    });

    setExpense(app.expenseManager.get(expenseId));

    return () => {
      subscription.unsubscribe();
    };
  }, [app]);

  function handleUpdate(expense: DraftExpense): void {
    console.debug(`ExpenseEditorPage::handleUpdate::expense`, expense);
    app.expenseManager.update(expense);
  }

  if (expense === undefined) {
    return (
      <CenteredPage>
        <div className="flex flex-row justify-center">loading...</div>
      </CenteredPage>
    );
  }

  return (
    <CenteredPage>
      <Link to={Paths.expenseEditor.replace(EXPENSE_ID, expense.expense.id)}>
        <Button icon="arrow-left" text="back" />
      </Link>
      <ExpenseSplitsEditor expense={expense.expense} app={app} onUpdate={handleUpdate} />
    </CenteredPage>
  );
}
