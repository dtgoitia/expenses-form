import { Button } from "../../components/Button";
import { Label } from "../../components/Label";
import { Select } from "../../components/Select";
import { TextInput } from "../../components/TextInput";
import {
  CurrencyCode,
  DraftPaymentAccount,
  LedgerAccountName,
  PaymentAccountName,
} from "../../domain/model";
import { useState } from "react";

interface Props {
  currencies: CurrencyCode[];
  onAddPaymentAccount: (account: DraftPaymentAccount) => void;
}
export function AddPaymentAccount({
  currencies,
  onAddPaymentAccount: addPaymentAccount,
}: Props) {
  const [name, setName] = useState<PaymentAccountName | undefined>(undefined);
  const [ledgerName, setLedgerName] = useState<LedgerAccountName | undefined>(undefined);
  const [currency, setCurrency] = useState<CurrencyCode | undefined>(undefined);

  function handleAddPaymentAccount(): void {
    if (name === undefined || ledgerName === undefined || currency === undefined) {
      return;
    }

    addPaymentAccount({ name, ledgerName, currency });
  }

  const canCreateAccount = name !== undefined && ledgerName !== undefined;

  return (
    <div className="flex flex-col gap-3 ">
      <Label htmlFor="new-account-name" text="Account name: *">
        <TextInput
          id="new-account-name"
          value={name}
          placeholder="Name"
          onChange={setName}
          className="mt-1"
        />
      </Label>

      <Label htmlFor="new-account-ledger-name" text="Account name in ledger: *">
        <TextInput
          id="new-account-ledger-name"
          value={ledgerName}
          placeholder="Ledger name"
          onChange={setLedgerName}
          className="mt-1"
        />
      </Label>

      <Label htmlFor="new-account-currency" text="Account currency:">
        <Select
          id="new-account-currency"
          selected={currency}
          options={currencies.map((currency) => ({ id: currency, label: currency }))}
          onSelect={setCurrency}
          className="mt-1"
        />
      </Label>

      <div className="flex justify-end p-4">
        <Button
          text={canCreateAccount ? "Create" : "fill details above"}
          // icon="floppy-disk"
          onClick={handleAddPaymentAccount}
          disabled={!canCreateAccount}
        />
      </div>
    </div>
  );
}
