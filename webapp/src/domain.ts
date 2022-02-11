export type ExpenseId = number;

export interface Expense {
  id?: ExpenseId;
  amount: number;
  currency: string;
  description: string;
  datetime: string; // "2022-01-17T08:19:26+00:00"
  submitted: boolean;
}

export type AccountId = number;

export type AccountName = string;

export interface Account {
  id: AccountId;
  name: AccountName;
}

export type CurrencyCode = "GBP" | "EUR" | "USD";

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

export function addExpense(expense: Expense) {
  // TODO: set expenses$ outside these functions, so that anyone can subscribe and get
  //       updates as new expenses are added.
}
