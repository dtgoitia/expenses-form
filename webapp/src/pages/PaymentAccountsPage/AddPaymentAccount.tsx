import {
  CurrencyCode,
  DraftPaymentAccount,
  LedgerAccountName,
  PaymentAccountName,
} from "../../domain/model";
import { Button, Intent } from "@blueprintjs/core";
import { useState } from "react";
import styled from "styled-components";

interface Props {
  onAddPaymentAccount: (account: DraftPaymentAccount) => void;
}
export function AddPaymentAccount({ onAddPaymentAccount: addPaymentAccount }: Props) {
  const [name, setName] = useState<PaymentAccountName | undefined>(undefined);
  const [ledgerName, setLedgerName] = useState<LedgerAccountName | undefined>(undefined);
  const [currency, setCurrency] = useState<CurrencyCode | undefined>(undefined);

  function handleAddPaymentAccount(): void {
    if (name === undefined || ledgerName === undefined || currency === undefined) {
      return;
    }

    addPaymentAccount({ name, ledgerName, currency });
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
          name === undefined || ledgerName === undefined || currency === undefined
        }
      >
        Add
      </Button>
    </Container>
  );
}

const Container = styled.div`
  margin: 1rem 0;
`;
