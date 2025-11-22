import { Button } from "../../components/Button";
import { Label } from "../../components/Label";
import { Select } from "../../components/Select";
import { TextInput } from "../../components/TextInput";
import { Toggle } from "../../components/Toggle";
import {
  CurrencyCode,
  DraftPaymentAccount,
  LedgerAccountName,
  PaymentAccountIsVisible,
  PaymentAccountName,
} from "../../domain/model";
import { useState } from "react";

const ACCOUNT_DEFAULT_VISIBILITY: PaymentAccountIsVisible = true;

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
  const [isVisible, setIsVisible] = useState<boolean>(ACCOUNT_DEFAULT_VISIBILITY);

  function handleAddPaymentAccount(): void {
    if (
      name === undefined ||
      ledgerName === undefined ||
      currency === undefined ||
      isVisible === undefined
    ) {
      return;
    }

    addPaymentAccount({ name, ledgerName, currency, isVisible });
    setName(undefined);
    setLedgerName(undefined);
    setCurrency(undefined);
    setIsVisible(ACCOUNT_DEFAULT_VISIBILITY);
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

      <Toggle
        uniqueKey="new-account"
        isOn={isVisible}
        labelOn="account is visible"
        labelOff="account is hidden"
        onToggle={() => setIsVisible(!isVisible)}
      />

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
