import ErrorPanel from "../components/ErrorPanel";
import { CURRENCIES } from "../constants";
import { CurrencyCode, DatetimeISOString, Expense } from "../domain";
import { ErrorMessage, errorsService } from "../services/errors";
import { SyntheticEvent, useState } from "react";
import {
  CheckboxProps,
  DropdownItemProps,
  Form,
  InputOnChangeData,
} from "semantic-ui-react";
import styled from "styled-components";

const CenteredFullPage = styled.div`
  margin: 0 auto;
  padding: 1rem 0.5rem;
  /* justify-content: center; */
  /* align-items: center; */
  border: 1px black solid;
`;

function strToBool(value: "string"): boolean {
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  throw new Error(
    `Expected '${value}' to be a string that can be casted into a boolean, but it cannot be casted :S`
  );
}

const MOCK: Expense = {
  id: 1,
  amount: 1,
  currency: "GBP",
  description: "description",
  datetime: "2022-01-17T08:19:26+00:00",
  submitted: true,
};

const formCurrencies = CURRENCIES.map((currency) => currency.code).map(
  (name) => ({
    key: name,
    value: name,
    text: name,
  })
) as unknown as DropdownItemProps[];

function EditExpensePage() {
  const [id, setId] = useState<number>(MOCK.id || 1234);
  const [date, setDate] = useState<DatetimeISOString>(MOCK.datetime);
  const [amount, setAmount] = useState<number | undefined>(MOCK.amount);
  const [currency, setCurrency] = useState<CurrencyCode>(MOCK.currency);
  const [submitted, setSubmitted] = useState<boolean>(MOCK.submitted);
  const [description, setDescription] = useState<string | undefined>(
    MOCK.description
  );

  function handleAmountChange({ target: { value } }: any): void {
    if (value === undefined || value === null || value === "") {
      setAmount(undefined);
      return;
    }

    setAmount(Number(value));
  }

  function handleSubmittedChange(
    _: SyntheticEvent,
    { checked }: CheckboxProps
  ) {
    if (checked === undefined) return;
    setSubmitted(checked);
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    let errorsFound = false;
    if (!amount) {
      errorsService.add({
        header: "Amount missing",
        description: "Amount is required",
      });
      errorsFound = true;
    }
    if (errorsFound) return;

    alert("TODO: call API");
  }

  const expense = { id, date, amount, currency, description, submitted };

  return (
    <CenteredFullPage>
      <h3>Edit expense</h3>

      <Form.Group onSubmit={handleSubmit}>
        <Form.Input
          type="number"
          placeholder="Amount"
          value={amount}
          step="any"
          onChange={handleAmountChange}
        />

        <Form.Input
          type="text"
          placeholder="Description"
          value={description}
          step="any"
          onChange={(event: any) => setDescription(event.target.value)}
        />

        <Form.Checkbox
          type="checkbox"
          label="submitted"
          checked={submitted}
          step="any"
          onChange={handleSubmittedChange}
        />

        <Form.Button onClick={handleSubmit}>Submit</Form.Button>
      </Form.Group>

      <pre>{JSON.stringify(expense, null, 2)}</pre>
    </CenteredFullPage>
  );
}

export default EditExpensePage;
