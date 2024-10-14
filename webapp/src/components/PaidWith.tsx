import { App } from "../domain/app";
import { PaymentAccount, PaymentAccountId, PaymentAccountName } from "../domain/model";
import { PaymentAccountsManager } from "../domain/paymentAccounts";
import { errorsService } from "../services/errors";
import { Option, Select } from "./Select";
import { HTMLSelect, Label } from "@blueprintjs/core";
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

  const options: Option[] = accounts.map((account) => ({
    id: account.id,
    label: account.name,
  }));

  return (
    <div>
      <Label>
        Paid with:
        <Select selected={selected} options={options} onSelect={handleAccountSelection} />
      </Label>
    </div>
  );
}
