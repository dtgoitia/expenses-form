import CenteredPage from "../../components/CenteredPage";
import { App } from "../../domain/app";
import { CurrencyCode } from "../../domain/model";
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
  const [currencies, setCurrencies] = useState<CurrencyCode[]>([]);

  useEffect(() => {
    const accountsSubscription = app.paymentAccountsManager.change$.subscribe((_) => {
      setAccounts(app.paymentAccountsManager.getAll());
    });
    const currenciesSubscription = app.currencyManager.change$.subscribe((_) => {
      setCurrencies([...app.currencyManager.getAll()].sort());
    });

    setAccounts(app.paymentAccountsManager.getAll());
    setCurrencies([...app.currencyManager.getAll()].sort());

    return () => {
      accountsSubscription.unsubscribe();
      currenciesSubscription.unsubscribe();
    };
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

      <AddPaymentAccount
        currencies={currencies}
        onAddPaymentAccount={handleAddPaymentAccount}
      />

      {accounts.length > 0 ? (
        accounts.map((account, i) => (
          <ListedPaymentAccount
            key={`${i}-${account.id}`}
            account={account}
            currencies={currencies}
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
