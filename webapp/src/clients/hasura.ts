import { API_BASE_URL } from "../constants";
import storage from "../localStorage";
import {
  ApolloClient,
  gql,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";

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
interface Expense {
  __typename: string;
  id: string;
  amount: number;
  currency: string;
  description: string;
  datetime: string;
}

interface GetExpensesData {
  expenses: Expense[];
}

function getHasuraContext() {
  const token = storage.hasuraApiToken.read();
  if (token === null) {
    // TODO: find a way of centralizing errors/warnings and nicely
    // showing them in the UI
    console.warn(`Hasura API token must be added to Settings`);
  }

  const context = {
    headers: { "x-hasura-admin-secret": token },
  };

  return context;
}

class HasuraClient {
  private client: ApolloClient<NormalizedCacheObject>;
  constructor(baseUrl: string) {
    this.client = new ApolloClient({
      uri: `${baseUrl}/graphql`,
      cache: new InMemoryCache(),
    });
  }

  public getExpenses$() {
    const query$ = this.client.watchQuery<GetExpensesData>({
      query: QUERY_GET_SUBMITTED_EXPENSES,
      context: getHasuraContext(),
    });
    return query$;
  }
}

const client = new HasuraClient(API_BASE_URL);

export default client;
