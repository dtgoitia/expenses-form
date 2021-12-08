import { API_ADMIN_SECRET } from "./constants";
import { useLazyQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { SyntheticEvent, useEffect, useState } from "react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import { SemanticDatepickerProps } from "react-semantic-ui-datepickers/dist/types";
import {
  Button,
  DropdownItemProps,
  DropdownProps,
  Form,
  InputOnChangeData,
} from "semantic-ui-react";

const DEFAULT_CONTEXT = {
  headers: { "x-hasura-admin-secret": API_ADMIN_SECRET },
};

// const QUERY_GET_EXPENSES = gql`
//   query GetExpenses {
//     expenses {
//       amount
//       currency
//       datetime
//       description
//       id
//       account {
//         ledger_name
//       }
//     }
//   }
// `;

const QUERY_GET_PREDEFINED_DATA = gql`
  query GetAllAccounts {
    accounts {
      id
      name
    }
    currencies {
      code
    }
  }
`;

const MUTATION_ADD_EXPENSE = gql`
  mutation AddExpense(
    $paid_with: Int
    $description: String
    $currency: currencies_enum
    $datetime: timestamptz
    $amount: numeric
  ) {
    insert_expenses(
      objects: {
        amount: $amount
        currency: $currency
        description: $description
        datetime: $datetime
        paid_with: $paid_with
      }
    ) {
      returning {
        id
      }
    }
  }
`;

type AccountName = string;
type CurrencyCode = string;

interface PredefinedData {
  accounts: {
    __typename: string;
    id: string;
    name: AccountName;
  }[];
  currencies: {
    code: CurrencyCode;
  }[];
}

enum FieldName {
  date = "date",
  paidWith = "paidWith",
  amount = "amount",
  currency = "currency",
  description = "description",
  pending = "pending",
  shared = "shared",
}

function App() {
  const [paidWith, setPaidWith] = useState<AccountName>("monzo");
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState<number>();
  const [currency, setCurrency] = useState<CurrencyCode>("GBP");
  const [description, setDescription] = useState<string | undefined>();
  const [pending, setPending] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [rawResponse, setRawResponse] = useState<any>();

  const [loadPrefedinedData, { loading, error, data }] =
    useLazyQuery<PredefinedData>(QUERY_GET_PREDEFINED_DATA, {
      context: DEFAULT_CONTEXT,
    });

  const [runMutation] = useMutation(MUTATION_ADD_EXPENSE, {
    context: DEFAULT_CONTEXT,
  });

  useEffect(() => {
    loadPrefedinedData();
  }, [loadPrefedinedData]);

  if (error) {
    return (
      <div>
        <h3>ERROR</h3>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  const formAccounts = data?.accounts
    .map((account) => account.name)
    .map((name) => ({
      key: name,
      value: name,
      text: name,
    })) as unknown as DropdownItemProps[];

  const formCurrencies = data?.currencies
    .map((currency) => currency.code)
    .map((name) => ({
      key: name,
      value: name,
      text: name,
    })) as unknown as DropdownItemProps[];

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

  function handleChange(_: any, { name, value }: InputOnChangeData): void {
    console.debug(`handleChange(name=${name}, value=${value})`);
    if (value === undefined) {
      return;
    }

    switch (name) {
      case FieldName.paidWith:
        setPaidWith(value);
        break;
      case FieldName.amount:
        setAmount(Number(value));
        break;
      case FieldName.description:
        setDescription(value);
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
    const accountIndex = (data as PredefinedData).accounts.filter(
      (account) => account.name === paidWith
    )[0].id;

    setSubmitting(true);
    runMutation({
      variables: {
        paid_with: accountIndex,
        datetime: date,
        amount,
        currency,
        description: description ? description : "",
        shared,
        pending,
      },
    }).then((response) => {
      setSubmitting(false);
      console.dir(response);
      setRawResponse(response);
    });
  }

  return (
    <div>
      <Form loading={loading} onSubmit={handleSubmit}>
        <SemanticDatepicker onChange={handleDateChange} value={date} />

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
            onChange={handleChange}
          />
          <Form.Dropdown
            name={FieldName.currency}
            value={currency}
            options={formCurrencies}
            onChange={handleCurrencyChange}
          />
        </Form.Group>

        <Form.Input
          name={FieldName.description}
          placeholder="Foo with @JohnDoe,@JaneDoe at @BigCorp"
          value={description}
          onChange={handleChange}
        />

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
      <pre>
        {JSON.stringify(
          { paidWith, amount, currency, shared, pending, date },
          null,
          2
        )}
      </pre>
      {rawResponse ? <pre>{JSON.stringify(rawResponse, null, 2)}</pre> : null}
    </div>
  );
}

export default App;
