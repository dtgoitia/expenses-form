import { Button } from "../../components/Button";
import { Label } from "../../components/Label";
import { Select } from "../../components/Select";
import { TextInput } from "../../components/TextInput";
import { Toggle } from "../../components/Toggle";
import {
  CurrencyCode,
  LedgerAccountName,
  PaymentAccount,
  PaymentAccountIsVisible,
  PaymentAccountName,
} from "../../domain/model";
import { useState } from "react";

interface Props {
  account: PaymentAccount;
  currencies: CurrencyCode[];
  onUpdate: (account: PaymentAccount) => void;
}
export function PaymentAccountEditor({ account, currencies, onUpdate: update }: Props) {
  const [name, setName] = useState<PaymentAccountName | undefined>(account.name);
  const [ledgerName, setLedgerName] = useState<LedgerAccountName | undefined>(
    account.ledgerName
  );
  const [currency, setCurrency] = useState<CurrencyCode>(account.currency);
  const [isVisible, setIsVisible] = useState<PaymentAccountIsVisible>(account.isVisible);

  console.log(`${name} ${isVisible} ${account.isVisible}`);

  const changesSaved =
    name === account.name &&
    ledgerName === account.ledgerName &&
    currency === account.currency &&
    isVisible === account.isVisible;

  function handleAddPaymentAccount(): void {
    if (
      name === undefined ||
      ledgerName === undefined ||
      currency === undefined ||
      changesSaved
    ) {
      return;
    }

    update({ ...account, name, ledgerName, currency, isVisible });
  }

  const canSaveAccount = name !== undefined && ledgerName !== undefined;

  return (
    <div className="flex flex-col gap-3">
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

      <Toggle
        uniqueKey={account.id}
        isOn={isVisible}
        labelOn="account is visible"
        labelOff="account is hidden"
        onToggle={(isOn) => setIsVisible(isOn)}
      />

      <div className="flex justify-end m-3">
        <Button
          // icon="floppy-disk"
          onClick={handleAddPaymentAccount}
          disabled={!canSaveAccount || changesSaved}
          text={!canSaveAccount ? "'name' and 'ledger name' must not be empty" : "Save"}
        />
      </div>
    </div>
  );
}
