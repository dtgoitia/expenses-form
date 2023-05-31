import { now } from "../datetimeUtils";
import { getAccountById } from "../domain/accounts";
import { App } from "../domain/app";
import { Account, CurrencyCode, DraftExpense } from "../domain/model";
import DateTimePicker from "./DateTimePicker";
import DescriptionForm from "./Description";
import { PaidWithDropdown } from "./PaidWith";
import { Button } from "@blueprintjs/core";
import { Checkbox, Collapse } from "@blueprintjs/core";
import { SyntheticEvent, useEffect, useState } from "react";
import {
  DropdownItemProps,
  DropdownProps,
  Form,
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
  app: App;
  expense: DraftExpense;
  update: (expense: DraftExpense) => void;
}

function ExpenseEditor({ app, expense, update }: ExpenseEditorProps) {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // If true, the user has paid with a different currency to the default
  // currency of the account used to pay
  const [otherCurrency, setOtherCurrency] = useState<boolean>(!!expense.originalAmount);
  const [currencies, setCurrencies] = useState<Set<CurrencyCode>>(new Set());

  const formCurrencies = getCurrencyDropdownItems({ currencies });

  useEffect(() => {
    const subscription = app.currencyManager.change$.subscribe((_) => {
      setCurrencies(app.currencyManager.getAll());
    });

    setCurrencies(app.currencyManager.getAll());

    return subscription.unsubscribe;
  }, [app]);

  function handleDateChange(date: Date): void {
    update({ ...expense, datetime: date });
  }

  function setDateToNow(e: SyntheticEvent) {
    console.debug("Refreshing date");
    e.preventDefault();
    handleDateChange(now());
  }

  function handleAccountChange(account: Account): void {
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

  function handleOriginalAmountChange(_: SyntheticEvent, { value }: InputOnChangeData) {
    if (value === undefined || value === null || value === "") {
      update({ ...expense, originalAmount: undefined });
      return;
    }

    update({ ...expense, originalAmount: Number(value) });
  }

  function handleOriginalCurrencyChange(_: any, data: DropdownProps): void {
    const originalCurrency = data.value as CurrencyCode;
    update({ ...expense, originalCurrency });
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
          <Button large icon="refresh" onClick={setDateToNow}>
            now
          </Button>
        </ReloadDate>
      </DateSlot>

      <PaidWithDropdown paidWith={expense.paid_with} onChange={handleAccountChange} />

      <Checkbox
        inline
        checked={otherCurrency}
        label="paid with different currency"
        onChange={() => setOtherCurrency(!otherCurrency)}
      />

      <Form>
        {otherCurrency ? (
          <>
            <Form.Group inline>
              <Form.Input
                type="number"
                placeholder="Original amount"
                name="originalAmountField"
                value={expense.originalAmount}
                step="any"
                onChange={handleOriginalAmountChange}
              />
              <Form.Dropdown
                name="originalCurrencyField"
                value={expense.originalCurrency}
                options={formCurrencies}
                onChange={handleOriginalCurrencyChange}
              />
              <Form.Input
                type="number"
                placeholder="Amount in account"
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
          </>
        ) : (
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
        )}

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

      <Button
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

function getCurrencyDropdownItems({
  currencies,
}: {
  currencies: Set<CurrencyCode>;
}): DropdownItemProps[] {
  const dropdownItems = [...currencies.values()].map((currency) => ({
    key: currency,
    value: currency,
    text: currency,
  })) as unknown as DropdownItemProps[];

  return dropdownItems;
}
