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
  const [paidInOtherCurrency, setPaidInOtherCurrency] = useState<boolean>(
    expense.originalAmount !== undefined
  );
  const [currencies, setCurrencies] = useState<Set<CurrencyCode>>(new Set());
  const [account, setAccount] = useState<PaymentAccount | undefined>();

  const formCurrencies = getCurrencyDropdownItems({ currencies });

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

  function handleCurrencyChange(_: any, data: DropdownProps): void {
    const currency = data.value as CurrencyCode;
    update({ ...expense, currency });
  }

  function handleOriginalAmountChange(value: string): void {
    let originalAmount = value === "" ? undefined : Number(value);
    update({ ...expense, originalAmount });
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

      <Form>
        <div className="grid grid-col-2 gap-2">
          {paidInOtherCurrency ? (
            <>
              <div className="col-span-1">
                <NumericInput
                  value={expense.originalAmount}
                  placeholder="Merchant amount"
                  onChange={handleOriginalAmountChange}
                />
              </div>
              <div className="col-start-2 col-span-2">
                <Form.Dropdown
                  name="originalCurrencyField"
                  value={expense.originalCurrency}
                  options={formCurrencies}
                  onChange={handleOriginalCurrencyChange}
                />
              </div>
              <div className="col-span-1">
                <NumericInput
                  value={expense.amount}
                  placeholder="Amount in account"
                  onChange={handleAmountChange}
                />
              </div>
              <div className="col-start-2 col-span-2">
                <Form.Dropdown
                  name="currencyField"
                  value={account.currency}
                  options={formCurrencies}
                  disabled={true}
                  onChange={handleCurrencyChange}
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
                <Form.Dropdown
                  name="currencyField"
                  value={account.currency}
                  options={formCurrencies}
                  disabled={true}
                  onChange={handleCurrencyChange}
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
      </Form>

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
