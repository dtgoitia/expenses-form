import ExpenseQueue from "../ExpenseQueue";
import CenteredPage from "../components/CenteredPage";
import DateTimePicker from "../components/DateTimePicker";
import Description from "../components/Description";
import DownloadJson from "../components/DownloadJson";
import { CURRENCIES, DEFAULT_CURRENCY, PAYMENT_ACCOUNTS } from "../constants";
import { now } from "../datetimeUtils";
import { unreachable } from "../devex";
import { getAccountByAlias, getInitialPaymentMethod } from "../domain/accounts";
import { ExpenseManager, AddExpenseArgs, AppExpense } from "../domain/expenses";
import {
  Account,
  AccountAlias,
  CurrencyCode,
  ExpenseId,
} from "../domain/model";
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

interface ExpensesFormProps {
  expenseManager: ExpenseManager;
}

function ExpensesForm({ expenseManager }: ExpensesFormProps) {
  const [appExpenses, setAppExpenses] = useState<AppExpense[]>([]);
  const [expenseUnderEdition, setExpenseUnderEdition] = useState<
    ExpenseId | undefined
  >(undefined);
  const [account, setAccount] = useState<Account>(getInitialPaymentMethod());

  const [date, setDate] = useState<Date>(now());
  const [amount, setAmount] = useState<number>();
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [description, setDescription] = useState<string | undefined>();
  const [shared, setShared] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState<boolean>(false);

  const formAccounts = PAYMENT_ACCOUNTS.map((account) => account.alias).map(
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
      setAppExpenses(expenseManager.getAll());
    });

    setAppExpenses(expenseManager.getAll());

    return subscription.unsubscribe;
  }, [expenseManager]);

  function handleAccountChange(_: any, data: DropdownProps): void {
    const alias = data.value as AccountAlias;

    const account = getAccountByAlias(alias);
    setAccount(account);

    if (expenseUnderEdition === undefined) {
      return;
    }

    const previous = expenseManager.get(expenseUnderEdition);
    if (previous === undefined) {
      throw unreachable(
        `expected Expense ${expenseUnderEdition} to exist, but not found in ExpenseManager.`
      );
    }

    expenseManager.update({
      ...previous.expense,
      paid_with: account.id,
    });
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

    setSubmitting(true);
    expenseManager.change$.pipe(first()).subscribe((_) => {
      setSubmitting(false);
    });

    const newExpense: AddExpenseArgs = {
      datetime: date,
      amount: amount as number,
      currency,
      description: description as string,
      shared,
      pending: account.pending,
      paid_with: account.id,
    };

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

  function handleOnEditExpense(id: ExpenseId): void {
    setExpenseUnderEdition(id);
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
          value={account.alias}
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

        <BlueprintButton
          large
          text="Add expense"
          loading={submitting}
          onClick={handleSubmit}
        />
      </Form>

      <DownloadJson
        expenses={appExpenses.map((appExpense) => appExpense.expense)}
      />

      <ExpenseQueue
        expenses={appExpenses}
        underEdition={expenseUnderEdition}
        onEditExpense={handleOnEditExpense}
        onDelete={(id: ExpenseId) => expenseManager.delete(id)}
      />

      <pre>
        {JSON.stringify(
          {
            paidWith: account.alias,
            amount,
            currency,
            shared,
            pending: account.pending,
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
