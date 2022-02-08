import { AccountId, CurrencyCode } from "../domain";
import getHasuraContext from "./hasuraContext";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

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

interface AddExpenseProps {
  paidWith: AccountId;
  datetime: Date;
  amount: number;
  currency: CurrencyCode;
  description: string;
  shared: boolean;
  pending: boolean;
}

export default function useAddExpense(expense: AddExpenseProps) {
  const [runMutation] = useMutation(MUTATION_ADD_EXPENSE, {
    context: getHasuraContext(),
  });

  const { paidWith, ...remainingVariables } = expense;

  function execute() {
    return runMutation({
      variables: {
        paid_with: paidWith,
        ...remainingVariables,
      },
    });
  }

  return execute;
}
