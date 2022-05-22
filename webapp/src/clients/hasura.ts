import { API_BASE_URL } from "../constants";
import { AccountId, CurrencyCode, ExpenseId } from "../domain";
import storage from "../localStorage";
import { errorsService } from "../services/errors";
import {
  ApolloClient,
  gql,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import {
  BehaviorSubject,
  filter,
  first,
  from,
  map,
  Observable,
  zip,
} from "rxjs";

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
    $shared: Boolean
    $pending: Boolean
  ) {
    insert_expenses(
      objects: {
        amount: $amount
        currency: $currency
        description: $description
        datetime: $datetime
        paid_with: $paid_with
        shared: $shared
        pending: $pending
      }
    ) {
      returning {
        id
      }
    }
  }
`;

interface RawExpense {
  __typename: string;
  id: ExpenseId;
  amount: number;
  currency: string;
  description: string;
  datetime: string;
}

interface AddExpenseProps {
  paidWith: AccountId;
  datetime: Date;
  amount: number;
  currency: CurrencyCode;
  description: string;
  shared: boolean;
  pending: boolean;
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
  id: ExpenseId;
  amount: number;
  currency: string;
  description: string;
  datetime: string;
  submitted: boolean;
}

interface FetchedExpenses {
  loading: boolean;
  data: HasuraExpense[] | undefined;
}

interface AddExpenseResponse {
  insert_expenses: {
    returning: [
      {
        __typename: "expenses";
        id: ExpenseId;
      }
    ];
    __typename: "expenses_mutation_response";
  };
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
              submitted: true,
            })
          );
          this.expenses$.next({ loading: false, data: expenses });
        },
        error: (error) => {
          errorsService.add({
            header: "Fetching submitted expenses",
            description: JSON.stringify(error, null, 2),
          });
        },
        complete: () => {
          console.debug("Get expenses request observable completed");
          subscription.unsubscribe();
        },
      });
  }

  public addExpense$(expense: AddExpenseProps): Observable<void> {
    const tempId: ExpenseId = -1;

    this.addInflightExpense(expense, tempId);
    const newExpenseId = this.submitExpense(expense);

    if (!newExpenseId) return from([]);

    const expenses$ = this.expenses$.pipe(
      filter((event) => event.data !== undefined),
      map((event) => event.data)
    ) as Observable<HasuraExpense[]>;

    // Replace inflight expense with data returned in submission
    return zip([expenses$, from(newExpenseId)]).pipe(
      map((previous) => {
        const [previousExpenses, id] = previous;
        const expenses = previousExpenses.map((expense) => {
          if (expense.submitted) return expense;
          return { ...expense, id, submitted: true };
        });
        this.expenses$.next({ loading: false, data: expenses });
      })
    );
  }

  private addInflightExpense(expense: AddExpenseProps, tempId: ExpenseId) {
    const subscription = this.expenses$
      .pipe(first())
      .subscribe((previous: FetchedExpenses) => {
        let previousExpenses: HasuraExpense[] = previous.data || [];

        const newExpense: HasuraExpense = {
          id: tempId,
          amount: expense.amount,
          currency: expense.currency,
          description: expense.description,
          datetime: expense.datetime.toISOString(),
          submitted: false,
        };

        const expenses: HasuraExpense[] = [...previousExpenses, newExpense];
        this.expenses$.next({ loading: false, data: expenses });
      });

    subscription.unsubscribe();
  }

  private async submitExpense(expense: AddExpenseProps): Promise<ExpenseId> {
    const { paidWith, ...remainingVariables } = expense;

    return this.client
      .mutate<AddExpenseResponse>({
        mutation: MUTATION_ADD_EXPENSE,
        context: getHasuraContext(),
        variables: { paid_with: paidWith, ...remainingVariables },
      })
      .then((result) => {
        if (result.errors) {
          const errors = result.errors;
          console.error(errors);
          errorsService.add({
            header: "Submitting new expense",
            description: JSON.stringify(errors, null, 2),
          });
          return Promise.reject();
        }

        if (!result.data) return Promise.reject();

        const addedExpenseId = result.data.insert_expenses.returning[0].id;
        return addedExpenseId;
      })
      .catch((error) => {
        console.error(error);
        errorsService.add({
          header: "Submitting new expense",
          description: JSON.stringify(error, null, 2),
        });
        return Promise.reject();
      });
  }
}

const hasura = new HasuraClient(API_BASE_URL);

export default hasura;
