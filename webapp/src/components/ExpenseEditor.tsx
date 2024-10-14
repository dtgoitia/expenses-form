import { Button } from "../components/Button";
import { dateToISOLocale, now } from "../datetimeUtils";
import { App } from "../domain/app";
import {
  CurrencyCode,
  DatetimeISOString,
  DraftExpense,
  PaymentAccount,
} from "../domain/model";
import DateTimePicker from "./DateTimePicker";
import DescriptionForm from "./Description";
import { NumericInput } from "./NumericInput";
import { PaidWithDropdown } from "./PaidWith";
import { Select } from "./Select";
import { Checkbox, Collapse } from "@blueprintjs/core";
import { SyntheticEvent, useEffect, useState } from "react";
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
  const [paidInOtherCurrency, setPaidInOtherCurrency] = useState<boolean>(
    expense.originalAmount !== undefined
  );
  const [currencies, setCurrencies] = useState<Set<CurrencyCode>>(new Set());
  const [account, setAccount] = useState<PaymentAccount | undefined>();

  useEffect(() => {
    const accountsSubscription = app.paymentAccountsManager.change$.subscribe((_) => {
      setAccount(app.paymentAccountsManager.get({ id: expense.paid_with }));
    });
    const currenciesSubscription = app.currencyManager.change$.subscribe((_) => {
      setCurrencies(app.currencyManager.getAll());
    });

    setAccount(app.paymentAccountsManager.get({ id: expense.paid_with }));
    setCurrencies(app.currencyManager.getAll());

    return () => {
      accountsSubscription.unsubscribe();
      currenciesSubscription.unsubscribe();
    };
  }, [app, expense.paid_with]);

  function handleDateChange(date: Date): void {
    const local: DatetimeISOString = dateToISOLocale(date);
    update({ ...expense, datetime: local });
  }

  function setDateToNow(e: SyntheticEvent) {
    console.debug("Refreshing date");
    e.preventDefault();
    handleDateChange(now());
  }

  function handleAccountChange(account: PaymentAccount): void {
    update({ ...expense, paid_with: account.id, currency: account.currency });
  }

  function handleAmountChange(value: string) {
    let amount = value === "" ? undefined : Number(value);
    update({ ...expense, amount });
  }

  function handleOriginalAmountChange(value: string): void {
    let originalAmount = value === "" ? undefined : Number(value);
    update({ ...expense, originalAmount });
  }

  function handleOriginalCurrencyChange(selectedId: string): void {
    const originalCurrency: CurrencyCode = selectedId;
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

  function handlePaidInOtherCurrencyCheckboxChange(): void {
    if (paidInOtherCurrency) {
      setPaidInOtherCurrency(false);
      update({ ...expense, originalAmount: undefined, originalCurrency: undefined });
    } else {
      setPaidInOtherCurrency(true);
    }
  }

  if (account === undefined) {
    return (
      <div>
        Account <code>{expense.paid_with}</code> not found
      </div>
    );
  }

  const paymentCurrencies: CurrencyCode[] = [...currencies]
    .filter((currency) => currency !== account.currency)
    .sort();

  return (
    <div>
      <DateTimePicker
        date={new Date(Date.parse(expense.datetime))}
        defaultDate={now()}
        onChange={handleDateChange}
      />

      <DateSlot>
        <ReloadDate onClick={setDateToNow}>
          <Button text="now" icon="rotate" onClick={setDateToNow} />
        </ReloadDate>
      </DateSlot>

      <PaidWithDropdown
        paidWith={expense.paid_with}
        app={app}
        onChange={handleAccountChange}
      />

      <Checkbox
        inline
        checked={paidInOtherCurrency}
        label="paid with different currency"
        onChange={handlePaidInOtherCurrencyCheckboxChange}
      />

      <div className="grid grid-col-2 gap-2">
        {paidInOtherCurrency ? (
          <>
            <div className="col-span-1">
              <NumericInput
                value={expense.originalAmount}
                placeholder="Amount in payment currency"
                onChange={handleOriginalAmountChange}
              />
            </div>
            <div className="col-start-2 col-span-2">
              <Select
                id="payment-currency"
                selected={expense.originalCurrency}
                options={paymentCurrencies.map((currency) => ({
                  id: currency,
                  label: currency,
                }))}
                onSelect={handleOriginalCurrencyChange}
              />
            </div>
            <div className="col-span-1">
              <NumericInput
                value={expense.amount}
                placeholder="Amount in account currency"
                onChange={handleAmountChange}
              />
            </div>
            <div className="col-start-2 col-span-2">
              <Select
                id="account-currency"
                selected={account.currency}
                options={[
                  {
                    id: account.currency,
                    label: account.currency,
                  },
                ]}
                onSelect={() => {}}
                disabled
              />
            </div>
          </>
        ) : (
          <>
            <div className="col-span-1">
              <NumericInput
                value={expense.amount}
                placeholder="Amount"
                onChange={handleAmountChange}
              />
            </div>
            <div className="col-start-2 col-span-2">
              <Select
                selected={account.currency}
                options={[
                  {
                    id: account.currency,
                    label: account.currency,
                  },
                ]}
                onSelect={() => {}}
                disabled
              />
            </div>
          </>
        )}
      </div>

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

      <Button
        text={showDetails ? "Hide JSON" : "Show JSON"}
        onClick={toggleShowDetails}
      />
      <Collapse isOpen={showDetails}>
        <pre className="bp4-code-block">
          {JSON.stringify(
            {
              ...expense,
              paid_with: `${expense.paid_with} -- ${account && account.name}`,
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
