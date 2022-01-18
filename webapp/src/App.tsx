import Description from "./Description";
import ExpensesQueue from "./ExpenseQueue";
import PredefinedOptions from "./PredefinedButtons";
import { API_ADMIN_SECRET, PREDEFINED_OPTIONS_DATA } from "./constants";
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
  Icon,
  InputOnChangeData,
} from "semantic-ui-react";
import styled from "styled-components";

const DEFAULT_PAYMENT_METHOD = "amex";

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

const DEFAULT_DATA = {
  accounts: [
    {
      id: 1,
      name: "monzo",
    },
    {
      id: 2,
      name: "revolut business",
    },
    {
      id: 3,
      name: "amex",
    },
    {
      id: 4,
      name: "evo",
    },
    {
      id: 5,
      name: "evo bizum",
    },
    {
      id: 6,
      name: "revolut personal GBP",
    },
    {
      id: 7,
      name: "revolut personal EUR",
    },
    {
      id: 8,
      name: "cash EUR",
    },
    {
      id: 9,
      name: "cash GBP",
    },
  ],
  currencies: [
    {
      code: "GBP",
    },
    {
      code: "EUR",
    },
    {
      code: "USD",
    },
  ],
};

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

const QUERY_GET_SUBMITTED_EXPENSES = gql`
  query GetExpenses {
    expenses {
      id
      amount
      currency
      description
      datetime
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

interface SubmittedExpense {
  __typename: string;
  id: string;
  amount: number;
  currency: string;
  description: string;
  datetime: string;
}
interface SubmittedExpenses {
  expenses: SubmittedExpense[];
}

enum FieldName {
  date = "date",
  paidWith = "paidWith",
  amount = "amount",
  currency = "currency",
  pending = "pending",
  shared = "shared",
}

const CenteredPage = styled.div`
  margin: 0 0.5rem;
`;

const DateSlot = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const ReloadDate = styled.div`
  margin-bottom: 1rem;
`;

function App() {
  const [paidWith, setPaidWith] = useState<AccountName>(DEFAULT_PAYMENT_METHOD);
  const now = new Date(new Date().setMilliseconds(0));
  const [date, setDate] = useState<Date>(now);
  const [amount, setAmount] = useState<number>();
  const [currency, setCurrency] = useState<CurrencyCode>("GBP");
  const [description, setDescription] = useState<string | undefined>();
  const [pending, setPending] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [queue, setQueue] = useState<any[]>([]);
  const [submittedQueue, setSubmittedQueue] = useState<SubmittedExpense[]>([]);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [rawResponse, setRawResponse] = useState<any>();

  const [
    loadPrefedinedData,
    {
      loading: loadingPredefinedData,
      error: errorLoadingPredefinedData,
      data: fetchedData,
    },
  ] = useLazyQuery<PredefinedData>(QUERY_GET_PREDEFINED_DATA, {
    context: DEFAULT_CONTEXT,
  });

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [loadSubmittedExpenses, _] = useLazyQuery<SubmittedExpenses>(
    QUERY_GET_SUBMITTED_EXPENSES,
    {
      context: DEFAULT_CONTEXT,
    }
  );

  const [runMutation] = useMutation(MUTATION_ADD_EXPENSE, {
    context: DEFAULT_CONTEXT,
  });

  useEffect(() => {
    console.debug(`Loading submitted expenses from server`);
    loadSubmittedExpenses().then((result) => {
      const rawExpenses = result.data?.expenses;
      if (!rawExpenses) return;

      setSubmittedQueue(rawExpenses);
    });
    console.debug(`Loading accounts and currencies from server`);
    loadPrefedinedData();
  }, [loadPrefedinedData, loadSubmittedExpenses]);

  if (errorLoadingPredefinedData) {
    return (
      <div>
        <h3>ERROR</h3>
        <pre>{JSON.stringify(errorLoadingPredefinedData, null, 2)}</pre>
      </div>
    );
  }

  let data = fetchedData ? fetchedData : DEFAULT_DATA;

  const formAccounts = data.accounts
    .map((account) => account.name)
    .map((name) => ({
      key: name,
      value: name,
      text: name,
    })) as unknown as DropdownItemProps[];

  const formCurrencies = data.currencies
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

  function addToQueue(item: any) {
    const updatedQueue = [...queue, item];
    setQueue(updatedQueue);
  }

  function handleSubmit() {
    const accountIndex = (data as PredefinedData).accounts.filter(
      (account) => account.name === paidWith
    )[0].id;

    const formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const formattedTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const formattedDatetime = `${formattedDate}  ${formattedTime}`;

    setSubmitting(true);
    addToQueue({
      submitted: false,
      description: `${formattedDatetime}   ${description}`,
      data: { todo: 1234 },
    });

    // runMutation({
    //   variables: {
    //     paid_with: accountIndex,
    //     datetime: date,
    //     amount,
    //     currency,
    //     description: description ? description : "",
    //     shared,
    //     pending,
    //   },
    // }).then((response) => {
    //   setSubmitting(false);
    //   console.dir(response);
    //   setRawResponse(response);
    // });
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
      <div>
        {loadingPredefinedData
          ? "Loading accounts and currencies from server..."
          : "Accounts and currencies loaded from server"}
      </div>
      <Button onClick={refreshPage}>
        <Icon name="refresh"></Icon>
        reload PWA
      </Button>
      <PredefinedOptions
        data={PREDEFINED_OPTIONS_DATA}
        select={(description: string) => setDescription(description)}
      />
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
            onChange={handleChange}
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

      <ExpensesQueue queue={queue} submitted={submittedQueue} />

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

export default App;
