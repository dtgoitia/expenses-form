import {
  CurrencyCode,
  LedgerAccountName,
  PaymentAccount,
  PaymentAccountName,
} from "../../domain/model";
import { Button, Intent } from "@blueprintjs/core";
import { useState } from "react";
import styled from "styled-components";

interface Props {
  account: PaymentAccount;
  onUpdate: (account: PaymentAccount) => void;
}
export function PaymentAccountEditor({ account, onUpdate: update }: Props) {
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
      <input
        type="text"
        className="bp4-input bp4-large bp4-fill"
        value={currency}
        placeholder="Currency"
        onChange={(event) => setCurrency(event.target.value)}
      />
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
