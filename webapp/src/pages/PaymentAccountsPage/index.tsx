import CenteredPage from "../../components/CenteredPage";
import {
  DraftPaymentAccount,
  PaymentAccount,
  PaymentAccountId,
} from "../../domain/model";
import { PaymentAccountsManager } from "../../domain/paymentAccounts";
import Paths from "../../routes";
import { AddPaymentAccount } from "./AddPaymentAccount";
import { ListedPaymentAccount } from "./ListedPaymentAccount";
import { Button } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  paymentAccountsManager: PaymentAccountsManager;
}

export default function PaymentAccountsPage({ paymentAccountsManager }: Props) {
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);

  useEffect(() => {
    const subscription = paymentAccountsManager.change$.subscribe((_) => {
      setAccounts(paymentAccountsManager.getAll());
    });

    setAccounts(paymentAccountsManager.getAll());

    return subscription.unsubscribe;
  }, [paymentAccountsManager]);

  function handleAddPaymentAccount(account: DraftPaymentAccount): void {
    paymentAccountsManager.add({ draft: account });
  }

  function handleUpdatePaymentAccount(account: PaymentAccount): void {
    paymentAccountsManager.update({ account });
  }

  function handleDeletePaymentAccount(id: PaymentAccountId): void {
    paymentAccountsManager.delete({ id });
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
