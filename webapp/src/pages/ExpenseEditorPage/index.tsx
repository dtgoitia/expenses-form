import CenteredPage from "../../components/CenteredPage";
import { ExpenseEditor } from "../../components/ExpenseEditor";
import { App } from "../../domain/app";
import { AppExpense } from "../../domain/expenses";
import { DraftExpense, ExpenseId } from "../../domain/model";
import Paths from "../../routes";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Props {
  app: App;
}
export function ExpenseEditorPage({ app }: Props) {
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

  function handleBlockPublication(id: ExpenseId): void {
    console.debug(`ExpenseEditorPage::handleBlockPublication::expense ID`, id);
    app.expenseManager.blockPublication(id);
  }

  function handleAllowPublication(id: ExpenseId): void {
    console.debug(`ExpenseEditorPage::handleAllowPublication::expense ID`, id);
    app.expenseManager.allowPublication(id);
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
      <ExpenseEditor
        expense={expense.expense}
        publicationAllowed={expense.publicationAllowed}
        app={app}
        update={handleUpdate}
        blockPublication={handleBlockPublication}
        allowPublication={handleAllowPublication}
      />
    </CenteredPage>
  );
}
