import { Button } from "../../components/Button";
import { CurrencyCode, PaymentAccount, PaymentAccountId } from "../../domain/model";
import { unreachable } from "../../lib/devex";
import { PaymentAccountEditor } from "./PaymentAccountEditor";
import { useState } from "react";

interface Props {
  account: PaymentAccount;
  isDefault: boolean;
  currencies: CurrencyCode[];
  onUpdate: (account: PaymentAccount) => void;
  onDelete: (id: PaymentAccountId) => void;
  onMarkAsDefault: () => void;
}
export function ListedPaymentAccount({
  account,
  isDefault,
  currencies,
  onUpdate: update,
  onDelete,
  onMarkAsDefault: markAsDefault,
}: Props) {
  const [editing, setEditing] = useState<boolean>(false);

  let css = "px-4 py-3 rounded relative";
  if (isDefault && editing) {
    css += " bg-blue-200  dark:bg-blue-900 dark:bg-opacity-50";
  } else if (isDefault && !editing) {
    css += " bg-blue-200  dark:bg-blue-900";
  } else if (!isDefault && !editing) {
    css += " bg-gray-100  dark:bg-gray-700";
  } else if (!isDefault && editing) {
    css += " bg-gray-300  dark:bg-gray-900";
  } else {
    throw unreachable();
  }

  if (editing === false) {
    const { name, ledgerName } = account;
    return (
      <div role="payment-account" className={css} onClick={() => setEditing(true)}>
        {isDefault && (
          <div
            className={
              "absolute top-2 right-3" +
              " text-xs" +
              " flex justify-end" +
              " z-10" +
              " opacity-50"
            }
            role="default-payment-account-indicator"
          >
            default
          </div>
        )}
        <div>
          <b>{name}</b>
        </div>
        <div>{ledgerName}</div>
      </div>
    );
  }

  function handleDeletionIntent(): void {
    // TODO: show confirmation dialog
    onDelete(account.id);
  }

  return (
    <div role="payment-account" className={css}>
      <PaymentAccountEditor account={account} currencies={currencies} onUpdate={update} />

      <Button text="Delete" onClick={handleDeletionIntent} />

      <Button text="Close" onClick={() => setEditing(false)} />

      <Button
        text={isDefault ? "is default payment method" : "Mark as default"}
        onClick={markAsDefault}
        disabled={isDefault}
      />
    </div>
  );
}
