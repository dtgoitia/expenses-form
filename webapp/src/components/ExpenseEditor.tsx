import { CURRENCIES, PAYMENT_ACCOUNTS } from "../constants";
import { now } from "../datetimeUtils";
import { getAccountByAlias, getAccountById } from "../domain/accounts";
import { AccountAlias, CurrencyCode, DraftExpense } from "../domain/model";
import DateTimePicker from "./DateTimePicker";
import DescriptionForm from "./Description";
import { Button as BlueprintButton } from "@blueprintjs/core";
import { Checkbox, Collapse } from "@blueprintjs/core";
import { SyntheticEvent, useState } from "react";
import {
  Button,
  DropdownItemProps,
  DropdownProps,
  Form,
  Icon,
  InputOnChangeData,
} from "semantic-ui-react";
import styled from "styled-components";

const DateSlot = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const ReloadDate = styled.div`
  margin-bottom: 1rem;
`;

interface ExpenseEditorProps {
  expense: DraftExpense;
  update: (expense: DraftExpense) => void;
}

function ExpenseEditor({ expense, update }: ExpenseEditorProps) {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const formAccounts = PAYMENT_ACCOUNTS.map((account) => account.alias).map((name) => ({
    key: name,
    value: name,
    text: name,
  })) as unknown as DropdownItemProps[];

  const formCurrencies = CURRENCIES.map((currency) => currency.code).map((name) => ({
    key: name,
    value: name,
    text: name,
  })) as unknown as DropdownItemProps[];

  function handleDateChange(date: Date): void {
    update({ ...expense, datetime: date });
  }

  function setDateToNow(e: SyntheticEvent) {
    console.debug("Refreshing date");
    e.preventDefault();
    handleDateChange(now());
  }

  function handleAccountChange(_: any, data: DropdownProps): void {
    const alias = data.value as AccountAlias;
    const account = getAccountByAlias(alias);
    update({ ...expense, paid_with: account.id });
  }

  function handleAmountChange(_: SyntheticEvent, { value }: InputOnChangeData) {
    if (value === undefined || value === null || value === "") {
      update({ ...expense, amount: undefined });
      return;
    }

    update({ ...expense, amount: Number(value) });
  }

  function handleCurrencyChange(_: any, data: DropdownProps): void {
    const currency = data.value as CurrencyCode;
    update({ ...expense, currency });
  }

  function handleDescriptionChange(description: string): void {
    console.debug(`ExpenseEditor::handleDescriptionChange:description:`, description);

    if (expense.description === description) {
      return;
    }

    update({ ...expense, description });
  }

  function handleSplitwiseChange(event: SyntheticEvent): void {
    const shared = (event.target as HTMLInputElement).checked;
    update({ ...expense, shared });
  }

  function toggleShowDetails(): void {
    setShowDetails(!showDetails);
  }

  const account = getAccountById(expense.paid_with);

  return (
    <div>
      <DateTimePicker
        date={expense.datetime}
        defaultDate={now()}
        onChange={handleDateChange}
      />

      <DateSlot>
        <ReloadDate onClick={setDateToNow}>
          <Button onClick={setDateToNow}>
            <Icon name="refresh"></Icon>
            now
          </Button>
        </ReloadDate>
      </DateSlot>

      <Form onSubmit={() => {}}>
        <Form.Dropdown
          label="Paid with"
          name="paidWithField"
          value={account.alias}
          options={formAccounts}
          inline={true}
          onChange={handleAccountChange}
        />

        <Form.Group inline>
          <Form.Input
            type="number"
            placeholder="Amount"
            name="amountField"
            value={expense.amount}
            step="any"
            onChange={handleAmountChange}
          />
          <Form.Dropdown
            name="currencyField"
            value={expense.currency}
            options={formCurrencies}
            onChange={handleCurrencyChange}
          />
        </Form.Group>

        <DescriptionForm
          description={expense.description}
          onChange={handleDescriptionChange}
        />

        <Checkbox
          inline
          checked={expense.shared}
          label="Splitwise"
          onChange={handleSplitwiseChange}
        />
      </Form>

      <BlueprintButton
        text={showDetails ? "Hide JSON" : "Show JSON"}
        icon={showDetails ? "collapse-all" : "bring-data"}
        onClick={toggleShowDetails}
      />
      <Collapse isOpen={showDetails}>
        <pre className="bp4-code-block">
          {JSON.stringify(
            {
              ...expense,
              paid_with: `${expense.paid_with} -- ${account.alias}`,
            },
            null,
            2
          )}
        </pre>
      </Collapse>
    </div>
  );
}

export default ExpenseEditor;

/**
 * The Expenses locally can have invalid data, that's fine - they might be drafts that need further edition
 * the Expenses must be validated when being pushed, shared or downloaded in CSV
 */
