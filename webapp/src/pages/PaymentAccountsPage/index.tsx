import CenteredPage from "../../components/CenteredPage";
import { App } from "../../domain/app";
import {
  DraftPaymentAccount,
  PaymentAccount,
  PaymentAccountId,
} from "../../domain/model";
import Paths from "../../routes";
import { AddPaymentAccount } from "./AddPaymentAccount";
import { ListedPaymentAccount } from "./ListedPaymentAccount";
import { Button } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  app: App;
}

export default function PaymentAccountsPage({ app }: Props) {
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);

  useEffect(() => {
    const subscription = app.paymentAccountsManager.change$.subscribe((_) => {
      setAccounts(app.paymentAccountsManager.getAll());
    });

    setAccounts(app.paymentAccountsManager.getAll());

    return subscription.unsubscribe;
  }, [app]);

  function handleAddPaymentAccount(account: DraftPaymentAccount): void {
    app.paymentAccountsManager.add({ draft: account });
  }

  function handleUpdatePaymentAccount(account: PaymentAccount): void {
    app.paymentAccountsManager.update({ account });
  }

  function handleDeletePaymentAccount(id: PaymentAccountId): void {
    app.paymentAccountsManager.delete({ id });
  }

  return (
    <CenteredPage>
      <Link to={Paths.root}>
        <Button large icon={"arrow-left"}>
          Back
        </Button>
      </Link>

      <h3>Payment Accounts</h3>

      <AddPaymentAccount onAddPaymentAccount={handleAddPaymentAccount} />

      {accounts.length > 0 ? (
        accounts.map((account, i) => (
          <ListedPaymentAccount
            key={`${i}-${account.id}`}
            account={account}
            onUpdate={handleUpdatePaymentAccount}
            onDelete={handleDeletePaymentAccount}
          />
        ))
      ) : (
        <p>No payment accounts :)</p>
      )}
    </CenteredPage>
  );
}
