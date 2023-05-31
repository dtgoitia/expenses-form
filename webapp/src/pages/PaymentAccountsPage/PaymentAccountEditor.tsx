import {
  CurrencyCode,
  LedgerAccountName,
  PaymentAccount,
  PaymentAccountName,
} from "../../domain/model";
import { Button, Intent, MenuItem } from "@blueprintjs/core";
import { Select2 } from "@blueprintjs/select";
import { useState } from "react";
import styled from "styled-components";

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
  const [currency, setCurrency] = useState<CurrencyCode | undefined>(account.currency);

  const changesSaved =
    name === account.name &&
    ledgerName === account.ledgerName &&
    currency === account.currency;

  function handleAddPaymentAccount(): void {
    if (
      name === undefined ||
      ledgerName === undefined ||
      currency === undefined ||
      changesSaved
    ) {
      return;
    }

    update({ ...account, name, ledgerName, currency });
  }

  return (
    <Container>
      <input
        type="text"
        className="bp4-input bp4-large bp4-fill"
        value={name}
        placeholder="Name"
        onChange={(event) => setName(event.target.value)}
      />
      <input
        type="text"
        className="bp4-input bp4-large bp4-fill"
        value={ledgerName}
        placeholder="Ledger name"
        onChange={(event) => setLedgerName(event.target.value)}
      />
      <Select2<CurrencyCode>
        items={currencies}
        itemRenderer={(currency, { handleClick, modifiers }) => (
          <MenuItem
            active={modifiers.active}
            key={currency}
            label={currency}
            onClick={handleClick}
          />
        )}
        filterable={false}
        onItemSelect={setCurrency}
      >
        <Button
          text={currency}
          rightIcon="double-caret-vertical"
          placeholder="Select a currency"
        />
      </Select2>
      <Button
        intent={Intent.PRIMARY}
        icon="floppy-disk"
        onClick={handleAddPaymentAccount}
        disabled={
          name === undefined ||
          ledgerName === undefined ||
          currency === undefined ||
          changesSaved
        }
      >
        Save
      </Button>
    </Container>
  );
}

const Container = styled.div``;
