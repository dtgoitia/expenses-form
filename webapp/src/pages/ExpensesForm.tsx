import ExpenseQueue from "../ExpenseQueue";
import CenteredPage from "../components/CenteredPage";
import DateTimePicker from "../components/DateTimePicker";
import Description from "../components/Description";
import DownloadJson from "../components/DownloadJson";
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  DEFAULT_PAYMENT_METHOD,
  PAYMENT_ACCOUNTS,
} from "../constants";
import { now } from "../datetimeUtils";
import { ExpenseManager, NewExpense } from "../domain/expenses";
import { AccountName, CurrencyCode, Expense, ExpenseId } from "../domain/model";
import storage from "../localStorage";
import Paths from "../routes";
import { errorsService } from "../services/errors";
import { Button as BlueprintButton, Checkbox } from "@blueprintjs/core";
import { SyntheticEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { first } from "rxjs";
import {
  Button,
  DropdownItemProps,
  DropdownProps,
  Form,
  Icon,
  InputOnChangeData,
} from "semantic-ui-react";
import styled from "styled-components";

enum FieldName {
  date = "date",
  paidWith = "paidWith",
  amount = "amount",
  currency = "currency",
  pending = "pending",
  shared = "shared",
}

const DateSlot = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const ReloadDate = styled.div`
  margin-bottom: 1rem;
`;

const pendingPaymentMethods = new Set(
  PAYMENT_ACCOUNTS.filter((account) => account.pending).map(
    (account) => account.name
  )
);

const paymentMethod: AccountName =
  storage.defaultPaymentAccount.read() || DEFAULT_PAYMENT_METHOD;

interface ExpensesFormProps {
  expenseManager: ExpenseManager;
}

function ExpensesForm({ expenseManager }: ExpensesFormProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [paidWith, setPaidWith] = useState<AccountName>(paymentMethod);
  const accountIndex = PAYMENT_ACCOUNTS.filter(
    (account) => account.name === paidWith
  )[0].id;

  const [date, setDate] = useState<Date>(now());
  const [amount, setAmount] = useState<number>();
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [description, setDescription] = useState<string | undefined>();
  const [pending, setPending] = useState<boolean>(
    pendingPaymentMethods.has(DEFAULT_PAYMENT_METHOD)
  );
  const [shared, setShared] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState<boolean>(false);

  const formAccounts = PAYMENT_ACCOUNTS.map((account) => account.name).map(
    (name) => ({
      key: name,
      value: name,
      text: name,
    })
  ) as unknown as DropdownItemProps[];

  const formCurrencies = CURRENCIES.map((currency) => currency.code).map(
    (name) => ({
      key: name,
      value: name,
      text: name,
    })
  ) as unknown as DropdownItemProps[];

  useEffect(() => {
    const subscription = expenseManager.change$.subscribe((_) => {
      setExpenses(expenseManager.getAll());
      // TODO: update rendered list of expenses
    });

    setExpenses(expenseManager.getAll());

    return subscription.unsubscribe;
  }, [expenseManager]);

  function handleAccountChange(_: any, data: DropdownProps): void {
    const value = data.value as string;
    setPaidWith(value);
    setPending(pendingPaymentMethods.has(value));
  }

  function handleCurrencyChange(_: any, data: DropdownProps): void {
    setCurrency(data.value as CurrencyCode);
  }

  function handleAmountChange(_: SyntheticEvent, { value }: InputOnChangeData) {
    if (value === undefined || value === null || value === "") {
      setAmount(undefined);
      return;
    }

    setAmount(Number(value));
  }

  function handleSubmit() {
    if (!amount) {
      errorsService.add({
        header: "Amount missing",
        description: "Amount is required",
      });
      return;
    }

    const newExpense: NewExpense = {
      datetime: date,
      amount: amount as number,
      currency,
      description: description as string,
      shared,
      pending,
      paid_with: accountIndex,
    };

    setSubmitting(true);
    // hasura
    //   .addExpense$({
    //     paidWith: accountIndex,
    //     datetime: date,
    //     amount: amount as number,
    //     currency,
    //     description: description as string,
    //     shared,
    //     pending,
    //   })
    //   .subscribe(() => {
    //     setSubmitting(false);
    //   });

    expenseManager.change$.pipe(first()).subscribe((_) => {
      setSubmitting(false);
    });
    expenseManager.add(newExpense);
  }

  function refreshDate(e: SyntheticEvent) {
    console.debug("Refreshing date");
    e.preventDefault();
    setDate(now());
  }

  function refreshPage() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Location/reload
    // `.reload(true)` is supported in Firefox and Chrome, but it's not standard
    // @ts-ignore
    window.location.reload(true);
  }

  return (
    <CenteredPage>
      <Button onClick={refreshPage}>
        <Icon name="refresh"></Icon>
        reload PWA
      </Button>
      <Link to={Paths.settings}>
        <Button>
          <Icon name="setting"></Icon>
          Settings
        </Button>
      </Link>
      <DateTimePicker date={date} defaultDate={now()} onChange={setDate} />
      <Form onSubmit={handleSubmit}>
        <DateSlot>
          <ReloadDate onClick={refreshDate}>
            <Button onClick={refreshDate}>
              <Icon name="refresh"></Icon>
              now
            </Button>
          </ReloadDate>
        </DateSlot>

        <Form.Dropdown
          label="Paid with"
          name={FieldName.paidWith}
          value={paidWith}
          options={formAccounts}
          inline={true}
          onChange={handleAccountChange}
        />

        <Form.Group inline>
          <Form.Input
            type="number"
            placeholder="Amount"
            name={FieldName.amount}
            value={amount}
            step="any"
            onChange={handleAmountChange}
          />
          <Form.Dropdown
            name={FieldName.currency}
            value={currency}
            options={formCurrencies}
            onChange={handleCurrencyChange}
          />
        </Form.Group>

        <Description onChange={setDescription} />

        <Checkbox
          inline
          checked={shared}
          label="Splitwise"
          onChange={(event) => {
            const isChecked = (event.target as HTMLInputElement).checked;
            setShared(isChecked);
          }}
        />
        <Checkbox
          inline
          checked={pending}
          label="Pending"
          onChange={(event) => {
            const isChecked = (event.target as HTMLInputElement).checked;
            setPending(isChecked);
          }}
        />

        <BlueprintButton
          large
          text="Add expense"
          loading={submitting}
          onClick={handleSubmit}
        />
      </Form>

      <DownloadJson expenses={expenses} />

      <ExpenseQueue
        expenses={expenses}
        onDelete={(id: ExpenseId) => expenseManager.delete(id)}
      />

      <pre>
        {JSON.stringify(
          {
            paidWith,
            amount,
            currency,
            shared,
            pending,
            date,
            description,
          },
          null,
          2
        )}
      </pre>
    </CenteredPage>
  );
}

export default ExpensesForm;
