import { App } from "../domain/app";
import { PaymentAccount, PaymentAccountId } from "../domain/model";
import { PaymentAccountsManager } from "../domain/paymentAccounts";
import { errorsService } from "../services/errors";
import { HTMLSelect, Label } from "@blueprintjs/core";
import { useState } from "react";

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

  function handleAccountSelection(event: any): void {
    const id: PaymentAccountId = event.target.value;
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

  return (
    <div>
      <Label>
        Paid with:
        <HTMLSelect value={selected} fill onChange={handleAccountSelection}>
          {app.paymentAccountsManager.getAll().map(({ id, name }) => (
            <option key={name} value={id}>
              {name}
            </option>
          ))}
        </HTMLSelect>
      </Label>
    </div>
  );
}
