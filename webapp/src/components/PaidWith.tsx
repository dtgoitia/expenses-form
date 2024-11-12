import { App } from "../domain/app";
import { PaymentAccount, PaymentAccountId } from "../domain/model";
import { PaymentAccountsManager } from "../domain/paymentAccounts";
import { errorsService } from "../services/errors";
import { Label } from "./Label";
import { Option, Select } from "./Select";
import { useEffect, useState } from "react";

interface Props {
  app: App;
  paidWith: PaymentAccountId;
  onChange: (account: PaymentAccount) => void;
}

export function PaidWithDropdown({
  paidWith,
  app,
  onChange: changePaymentAccount,
}: Props) {
  const [selected, select] = useState<PaymentAccountId>(paidWith);
  const [accounts, updateAccounts] = useState<PaymentAccount[]>([]);

  useEffect(() => {
    const subscription = app.paymentAccountsManager.change$.subscribe((_) => {
      updateAccounts(app.paymentAccountsManager.getAll());
    });

    updateAccounts(app.paymentAccountsManager.getAll());

    return () => {
      subscription.unsubscribe();
    };
  }, [app]);

  function handleAccountSelection(id: PaymentAccountId): void {
    const account = app.paymentAccountsManager.get({ id });
    if (account === undefined) {
      errorsService.add({
        header: `UNEXPECTED ERROR: no account found with ID ${id}`,
        description:
          `When handling account selection in ${PaidWithDropdown.name} component, the` +
          ` ID ${id} was picked by the UI but no payment account found with that ID` +
          ` in ${PaymentAccountsManager.name}`,
      });
      return;
    }
    select(id);
    changePaymentAccount(account);
  }

  // accounts are populated after the component is mounted and we suscribe to
  // the App.paymentAccountManager
  if (accounts.length === 0) {
    return <div>loading accounts...</div>;
  }

  const options: Option[] = accounts.map((account) => ({
    id: account.id,
    label: account.name,
  }));

  return (
    <div>
      <Label htmlFor="paid-with" text="Paid with:">
        <Select
          id="paid-with"
          selected={selected}
          options={options}
          onSelect={handleAccountSelection}
        />
      </Label>
    </div>
  );
}
