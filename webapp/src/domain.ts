export type ExpenseId = number;
export type DatetimeISOString = string;

export interface Expense {
  id?: ExpenseId;
  amount: number;
  currency: string;
  description: string;
  datetime: DatetimeISOString; // "2022-01-17T08:19:26+00:00"
  submitted: boolean;
}

export type AccountId = number;

export type AccountName = string;

export interface Account {
  id: AccountId;
  name: AccountName;
  pending: boolean; // true if usually payments are pending when paid with this account
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
