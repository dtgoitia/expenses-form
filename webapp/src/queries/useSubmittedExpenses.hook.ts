import { Expense } from "../domain";
import hasura from "./hasuraContext";
import { ApolloError, useQuery } from "@apollo/client";
import gql from "graphql-tag";

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

interface HasuraExpense {
  __typename: string;
  id: string;
  amount: number;
  currency: string;
  description: string;
  datetime: string;
}
interface HasuraExpenses {
  expenses: HasuraExpense[];
}

interface Return {
  loading: boolean;
  error: ApolloError | undefined;
  data: Expense[];
}

export default function useSubmittedExpenses(): Return {
  const { loading, error, data } = useQuery<HasuraExpenses>(
    QUERY_GET_SUBMITTED_EXPENSES,
    {
      context: hasura,
    }
  );

  console.dir({ loading, error, data });

  if (loading || error || data === undefined) {
    return { loading, error, data: [] };
  }

  const expenses = data.expenses.map((hasuraExpense) => ({
    id: hasuraExpense.id,
    amount: hasuraExpense.amount,
    currency: hasuraExpense.currency,
    description: hasuraExpense.description,
    datetime: hasuraExpense.datetime,
  }));

  return { loading, error, data: expenses };
}
