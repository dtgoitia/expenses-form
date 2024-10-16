import CenteredPage from "../../components/CenteredPage";
import { App } from "../../domain/app";
import { CurrencyCode } from "../../domain/model";
import {
  DraftPaymentAccount,
  PaymentAccount,
  PaymentAccountId,
} from "../../domain/model";
import { AddPaymentAccount } from "./AddPaymentAccount";
import { ListedPaymentAccount } from "./ListedPaymentAccount";
import { useEffect, useState } from "react";

interface Props {
  app: App;
}

export default function PaymentAccountsPage({ app }: Props) {
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [defaultAccount, setDefaultAccount] = useState<PaymentAccountId | undefined>();
  const [currencies, setCurrencies] = useState<CurrencyCode[]>([]);

  useEffect(() => {
    const accountsSubscription = app.paymentAccountsManager.change$.subscribe((_) => {
      setAccounts(app.paymentAccountsManager.getAll());
      setDefaultAccount(app.paymentAccountsManager.getDefault()?.id);
    });
    const currenciesSubscription = app.currencyManager.change$.subscribe((_) => {
      setCurrencies([...app.currencyManager.getAll()].sort());
    });

    setAccounts(app.paymentAccountsManager.getAll());
    setDefaultAccount(app.paymentAccountsManager.getDefault()?.id);
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

  function handleMarkPaymentAccountAsDefault(id: PaymentAccountId): void {
    app.paymentAccountsManager.setDefault({ id });
  }

  const canAddAccount = currencies.length > 0;

  return (
    <CenteredPage>
      {canAddAccount ? (
        <>
          <AddPaymentAccount
            currencies={currencies}
            onAddPaymentAccount={handleAddPaymentAccount}
          />

          {defaultAccount === undefined && accounts.length > 0 && (
            <div role="warning" className="p-4 flex justify-center">
              <p>
                <b>please, select your default payment account</b>
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3" role="payment-accounts">
            {accounts.length > 0 ? (
              accounts.map((account, i) => (
                <ListedPaymentAccount
                  key={`${i}-${account.id}`}
                  account={account}
                  isDefault={account.id === defaultAccount}
                  currencies={currencies}
                  onUpdate={handleUpdatePaymentAccount}
                  onDelete={handleDeletePaymentAccount}
                  onMarkAsDefault={() => handleMarkPaymentAccountAsDefault(account.id)}
                />
              ))
            ) : (
              <p>No payment accounts :)</p>
            )}
          </div>
        </>
      ) : (
        <div>
          You must add currencies in the Settings page to be able to add Payment Accounts
          here
        </div>
      )}
    </CenteredPage>
  );
}
