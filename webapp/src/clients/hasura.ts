import { API_BASE_URL } from "../constants";
import storage from "../localStorage";
import { errorsService } from "../services/errors";
import {
  ApolloClient,
  gql,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { BehaviorSubject } from "rxjs";

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
interface RawExpense {
  __typename: string;
  id: string;
  amount: number;
  currency: string;
  description: string;
  datetime: string;
}

interface GetExpensesData {
  expenses: RawExpense[];
}

function getHasuraContext() {
  const token = storage.hasuraApiToken.read();
  if (token === null) {
    errorsService.add({
      header: "Missing settings",
      description: `Hasura API token must be added to the Settings page`,
    });
  }

  const context = {
    headers: { "x-hasura-admin-secret": token },
  };

  return context;
}

export interface HasuraExpense {
  id: string;
  amount: number;
  currency: string;
  description: string;
  datetime: string;
}

interface FetchedExpenses {
  loading: boolean;
  data: HasuraExpense[] | undefined;
}

class HasuraClient {
  private client: ApolloClient<NormalizedCacheObject>;
  public expenses$: BehaviorSubject<FetchedExpenses>;

  constructor(baseUrl: string) {
    this.client = new ApolloClient({
      uri: `${baseUrl}/graphql`,
      cache: new InMemoryCache(),
    });

    this.expenses$ = new BehaviorSubject<FetchedExpenses>({
      loading: false,
      data: undefined,
    });
  }

  public getExpenses(): void {
    console.debug("Fetching expenses from Hasura");
    this.expenses$.next({ loading: true, data: undefined });

    const subscription = this.client
      .watchQuery<GetExpensesData>({
        query: QUERY_GET_SUBMITTED_EXPENSES,
        context: getHasuraContext(),
      })
      .subscribe({
        next: (result) => {
          const expenses: HasuraExpense[] = result.data.expenses.map(
            ({ __typename, ...rest }) => ({
              ...rest,
            })
          );
          this.expenses$.next({ loading: false, data: expenses });
        },
        error: (error) => {
          errorsService.add({
            header: "Fetching submitted expenses",
            description: JSON.stringify(error, null, 2), // TODO: improve error message
          });
        },
        complete: () => {
          console.debug("Get expenses request observable completed");
          subscription.unsubscribe();
        },
      });
  }
}

const hasura = new HasuraClient(API_BASE_URL);

export default hasura;
