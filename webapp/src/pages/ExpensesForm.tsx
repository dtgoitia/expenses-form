import ExpenseQueue from "../ExpenseQueue";
import CenteredPage from "../components/CenteredPage";
import Description from "../components/Description";
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  DEFAULT_PAYMENT_METHOD,
  PAYMENT_ACCOUNTS,
} from "../constants";
import { AccountName, CurrencyCode } from "../domain";
import useAddExpense from "../queries/useAddExpense.hook";
import Paths from "../routes";
import React, { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import { SemanticDatepickerProps } from "react-semantic-ui-datepickers/dist/types";
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

function ExpensesForm() {
  const [paidWith, setPaidWith] = useState<AccountName>(DEFAULT_PAYMENT_METHOD);
  const accountIndex = PAYMENT_ACCOUNTS.filter(
    (account) => account.name === paidWith
  )[0].id;

  const now = new Date(new Date().setMilliseconds(0));
  const [date, setDate] = useState<Date>(now);
  const [amount, setAmount] = useState<number>();
  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [description, setDescription] = useState<string | undefined>();
  const [pending, setPending] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [rawResponse, setRawResponse] = useState<any>();

  let runMutation = useAddExpense({
    paidWith: accountIndex,
    datetime: date,
    amount: amount as number,
    currency,
    description: description as string,
    shared,
    pending,
  });

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

  function handleAccountChange(_: SyntheticEvent, data: DropdownProps): void {
    setPaidWith(data.value as string);
  }

  function handleCurrencyChange(_: SyntheticEvent, data: DropdownProps): void {
    setCurrency(data.value as string);
  }

  function handleDateChange(
    _: SyntheticEvent | undefined,
    data: SemanticDatepickerProps
  ): void {
    console.dir(data.value);
    setDate(data.value as unknown as Date);
  }

  function handleAmountChange(_: SyntheticEvent, { value }: InputOnChangeData) {
    if (value === undefined || value === null || value === "") {
      setAmount(undefined);
      return;
    }

    setAmount(Number(value));
  }

  function handleChange(_: any, { name, value }: InputOnChangeData): void {
    console.debug(`handleChange(name=${name}, value=${value})`);
    if (value === undefined) {
      return;
    }

    switch (name) {
      case FieldName.paidWith:
        setPaidWith(value);
        break;
      case FieldName.pending:
        setPending(value === "true");
        break;
      case FieldName.shared:
        setShared(value === "true");
        break;
      default:
        break;
    }
  }

  function handleSubmit() {
    if (!amount) {
      // TODO: pipe errors to an error pannel
      console.error("Amount is required");
      return;
    }

    setSubmitting(true);
    runMutation().then((response) => {
      setSubmitting(false);
      if (response.errors) {
        // TODO: pipe errors to an error pannel
        console.error(response.errors);
        setRawResponse(response);
        return;
      }

      console.dir(response);
      setRawResponse(response.data);
    });
  }

  function refreshDate(e: SyntheticEvent) {
    e.preventDefault();
    setDate(now);
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
      <Form onSubmit={handleSubmit}>
        <DateSlot>
          <SemanticDatepicker
            onChange={handleDateChange}
            value={date}
            datePickerOnly={true}
          />
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

        <Form.Group inline>
          <Form.Input
            type="checkbox"
            label="Shared"
            name={FieldName.shared}
            value={!shared}
            checked={shared}
            onChange={handleChange}
          />
          <Form.Input
            type="checkbox"
            label="Pending"
            placeholder="Pending"
            name={FieldName.pending}
            value={!pending}
            checked={pending}
            onChange={handleChange}
          />

          <Button type="submit" loading={submitting}>
            Add expense
          </Button>
        </Form.Group>
      </Form>

      <ExpenseQueue />

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
      {rawResponse ? <pre>{JSON.stringify(rawResponse, null, 2)}</pre> : null}
    </CenteredPage>
  );
}

export default ExpensesForm;