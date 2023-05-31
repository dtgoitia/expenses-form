import { PAYMENT_ACCOUNTS } from "../constants";
import { getAccountById } from "../domain/accounts";
import { Account, AccountId } from "../domain/model";
import { HTMLSelect, Label } from "@blueprintjs/core";
import { useState } from "react";

interface PaidWithDropdownProps {
  paidWith: AccountId;
  onChange: (account: Account) => void;
}

export function PaidWithDropdown({
  paidWith,
  onChange: notifySelectedAccountChange,
}: PaidWithDropdownProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<AccountId>(paidWith);

  function handleAccountSelection(event: any): void {
    const id: AccountId = Number(event.target.value as string);
    const account = getAccountById(id);
    setSelectedAccountId(id);
    notifySelectedAccountChange(account);
  }

  return (
    <div>
      <Label>
        Paid with:
        <HTMLSelect value={selectedAccountId} fill onChange={handleAccountSelection}>
          {PAYMENT_ACCOUNTS.map(({ id, alias }) => (
            <option key={id} value={id}>
              {alias}
            </option>
          ))}
        </HTMLSelect>
      </Label>
    </div>
  );
}
