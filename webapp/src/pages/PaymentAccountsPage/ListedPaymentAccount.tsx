import { CurrencyCode, PaymentAccount, PaymentAccountId } from "../../domain/model";
import { PaymentAccountEditor } from "./PaymentAccountEditor";
import { Button, Intent } from "@blueprintjs/core";
import { useState } from "react";
import styled from "styled-components";

const NonDefaultPaymentAccount = styled.div`
  padding: 1rem;
`;

const DefaultPaymentAccount = styled(NonDefaultPaymentAccount)`
  background-color: #ddd;
`;

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

  const Container = isDefault ? DefaultPaymentAccount : NonDefaultPaymentAccount;

  if (editing === false) {
    const { name, ledgerName } = account;
    return (
      <Container onClick={() => setEditing(true)}>
        <div>
          <b>{name}</b>
        </div>
        <div>{ledgerName}</div>
      </Container>
    );
  }

  function handleDeletionIntent(): void {
    // TODO: show confirmation dialog
    onDelete(account.id);
  }

  return (
    <Container>
      <PaymentAccountEditor account={account} currencies={currencies} onUpdate={update} />
      <Button onClick={handleDeletionIntent} intent={Intent.DANGER}>
        Delete {account.name}
      </Button>
      <Button onClick={() => setEditing(false)}>Close</Button>
      <Button onClick={markAsDefault} disabled={isDefault}>
        {isDefault ? "is default payment method" : "Mark as default"}
      </Button>
    </Container>
  );
}
