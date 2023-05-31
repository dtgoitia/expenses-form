import { CurrencyCode, PaymentAccount, PaymentAccountId } from "../../domain/model";
import { PaymentAccountEditor } from "./PaymentAccountEditor";
import { Button, Intent } from "@blueprintjs/core";
import { useState } from "react";

interface Props {
  account: PaymentAccount;
  currencies: CurrencyCode[];
  onUpdate: (account: PaymentAccount) => void;
  onDelete: (id: PaymentAccountId) => void;
}
export function ListedPaymentAccount({
  account,
  currencies,
  onUpdate: update,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState<boolean>(false);

  if (editing === false) {
    const { name, ledgerName, currency } = account;
    return (
      <div onClick={() => setEditing(true)}>
        {name} {ledgerName} {currency}
      </div>
    );
  }

  function handleDeletionIntent(): void {
    // TODO: show confirmation dialog
    onDelete(account.id);
  }

  return (
    <div>
      <PaymentAccountEditor account={account} currencies={currencies} onUpdate={update} />
      <Button onClick={handleDeletionIntent} intent={Intent.DANGER}>
        Delete {account.name}
      </Button>
      <Button onClick={() => setEditing(false)}>Close</Button>
    </div>
  );
}
