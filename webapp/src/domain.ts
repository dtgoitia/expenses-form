import { default as hasura } from "./clients/hasura";
import { errorsService } from "./services/errors";
import { BehaviorSubject } from "rxjs";

export interface Expense {
  id?: string;
  amount: number;
  currency: string;
  description: string;
  datetime: string; // "2022-01-17T08:19:26+00:00"
}

export type AccountId = number;

export type AccountName = string;

export interface Account {
  id: AccountId;
  name: AccountName;
}

export type CurrencyCode = string;

export interface Currency {
  code: CurrencyCode;
}

export type ShortcutId = number;

export type Seller = string;

export type Person = string;

export type TagName = string; // TODO: make every piece of code point here

export interface Shortcut {
  id: ShortcutId;
  buttonName: string;
  main: string;
  people: Person[];
  seller: Seller;
  tags: TagName[];
}

export interface HasuraExpense {
  id: string;
  amount: number;
  currency: string;
  description: string;
  datetime: string;
}

interface GetExpensesRequest {
  inflight: boolean;
  data: HasuraExpense[] | undefined;
}
export function getExpenses(): BehaviorSubject<GetExpensesRequest> {
  const request$ = new BehaviorSubject<GetExpensesRequest>({
    inflight: true,
    data: undefined,
  });

  const submittedExpenses$ = hasura.getExpenses$();
  submittedExpenses$.subscribe({
    next: (result) => {
      const expenses: HasuraExpense[] = result.data.expenses.map(
        ({ __typename, ...rest }) => ({
          ...rest,
        })
      );
      request$.next({ inflight: false, data: expenses });
    },
    error: (error) => {
      errorsService.add({
        header: "Fetching submitted expenses",
        description: JSON.stringify(error, null, 2),
      });
    },
    complete: () => {
      console.debug("Get expenses request observable completed");
    },
  });
  return request$;
}
