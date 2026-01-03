import { dateToISOLocale, now } from "../../datetimeUtils";
import { App } from "../../domain/app";
import {
  CurrencyCode,
  DatetimeISOString,
  DraftExpense,
  PaymentAccount,
  PersonName,
  Shortcut,
  ShortcutId,
} from "../../domain/model";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import { DescriptionForm, descriptionToString } from "../Description";
import { NumericInput } from "../NumericInput";
import { PaidWithDropdown } from "../PaidWith";
import { Select } from "../Select";
import DateTimePicker from "./DateTimePicker";
import { SyntheticEvent, useEffect, useState } from "react";
import styled from "styled-components";
import Shortcuts from "../../PredefinedButtons";
import { Link } from "react-router-dom";
import Paths, { EXPENSE_ID } from "../../routes";

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

export function ExpenseEditor({ app, expense, update }: ExpenseEditorProps) {
  // If true, the user has paid with a different currency to the default
  // currency of the account used to pay
  const [paidInDifferentCurrency, setPaidInDifferentCurrency] = useState<boolean>(
    expense.originalAmount !== undefined
  );
  const [currencies, setCurrencies] = useState<Set<CurrencyCode>>(new Set());
  const [account, setAccount] = useState<PaymentAccount | undefined>();
  const [people, setPeople] = useState<PersonName[]>([]);

  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

  useEffect(() => {
    const accountsSubscription = app.paymentAccountsManager.change$.subscribe((_) => {
      setAccount(app.paymentAccountsManager.get({ id: expense.paid_with }));
    });
    const currenciesSubscription = app.currencyManager.change$.subscribe((_) => {
      setCurrencies(app.currencyManager.getAll());
    });
    const peopleSubscription = app.peopleManager.change$.subscribe((_) => {
      setPeople(app.peopleManager.getAll().map((person) => person.name));
    });
    const shortcutsSubscription = app.shortcutsManager.change$.subscribe((_) => {
      setShortcuts(app.shortcutsManager.getAll());
    });

    setAccount(app.paymentAccountsManager.get({ id: expense.paid_with }));
    setCurrencies(app.currencyManager.getAll());
    setPeople(app.peopleManager.getAll().map((person) => person.name));
    setShortcuts(app.shortcutsManager.getAll());

    return () => {
      accountsSubscription.unsubscribe();
      currenciesSubscription.unsubscribe();
      peopleSubscription.unsubscribe();
      shortcutsSubscription.unsubscribe();
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

  function handleAmountChange(value: number | undefined) {
    update({ ...expense, amount: value });
  }

  function handleOriginalAmountChange(value: number | undefined): void {
    update({ ...expense, originalAmount: value });
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

  function handleShortcutSelection(id: ShortcutId) {
    const shortcut = shortcuts.filter((shortcut) => shortcut.id === id)[0];

    handleDescriptionChange(
      descriptionToString({
        main: shortcut.main,
        people: shortcut.people,
        seller: shortcut.seller,
        tags: shortcut.tags,
      })
    );
  }

  function handleSplitwiseChange(checked: boolean): void {
    const updated = {
      ...expense,
      shared: checked,
      splits: checked ? expense.splits : [],
    };
    update(updated);
  }

  function handlePaidInDifferentCurrencyCheckboxChange(checked: boolean): void {
    const paidInDifferentCurrency = checked;
    if (paidInDifferentCurrency) {
      update({ ...expense, originalAmount: undefined, originalCurrency: undefined });
    }
    setPaidInDifferentCurrency(checked);
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

  const { showLink: showLinkToSplitEditor, help } = guardUserAccessToSplitEditor({
    expense,
    paidInDifferentCurrency,
  });

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

      <div className="pb-3 flex flex-row flex-no-wrap justify-end">
        <Checkbox
          label="paid with different currency"
          checked={paidInDifferentCurrency}
          onChange={handlePaidInDifferentCurrencyCheckboxChange}
        />
      </div>

      <div className="grid grid-col-2 gap-2">
        {paidInDifferentCurrency ? (
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

      <Shortcuts
        data={shortcuts.map(({ id, buttonName }) => ({ id, buttonName }))}
        select={handleShortcutSelection}
      />

      <DescriptionForm
        description={expense.description}
        peopleInSettings={people}
        onChange={handleDescriptionChange}
      />

      <div className="py-4 flex flex-row justify-end">
        <Checkbox
          checked={expense.shared}
          label="is shared"
          onChange={handleSplitwiseChange}
        />
      </div>

      <div className="flex flex-col justify-center mb-5">
        <div className="flex flex-row justify-center">
          <Link to={Paths.expenseSplitsEditor.replace(EXPENSE_ID, expense.id)}>
            <Button
              text="split payment"
              disabled={!showLinkToSplitEditor}
              onClick={() => {}}
            />
          </Link>
        </div>
        {help && (
          <div
            role="help-to-access-split-editor"
            className="flex flex-row justify-center p-2"
          >
            tip: {help}
          </div>
        )}
      </div>
    </div>
  );
}

function shouldUserBeAbleToSetSplits(expense: DraftExpense): boolean {
  const amountInAccountCurrencyIsSet = expense.amount !== undefined;
  const amountInMerchantCurrencyIsSet =
    expense.originalAmount !== undefined && expense.originalCurrency !== undefined;
  const atLeastOneAmountIsSet =
    amountInAccountCurrencyIsSet || amountInMerchantCurrencyIsSet;
  const should = expense.shared && atLeastOneAmountIsSet;
  return should;
}

function guardUserAccessToSplitEditor({
  expense,
  paidInDifferentCurrency,
}: {
  expense: DraftExpense;
  paidInDifferentCurrency: boolean;
}): { showLink: boolean; help: string | undefined } {
  if (expense.shared === false) {
    return { showLink: false, help: undefined };
  }

  const showLink = shouldUserBeAbleToSetSplits(expense);

  if (paidInDifferentCurrency === false) {
    if (showLink) {
      return { showLink: true, help: undefined };
    } else {
      return { showLink: false, help: "input amount" };
    }
  }

  if (showLink) {
    return { showLink, help: undefined };
  }

  const help =
    expense.originalCurrency === undefined
      ? "either input amount for account currency or choose merchant currency"
      : "input one of the amounts";

  return { showLink: false, help };
}
