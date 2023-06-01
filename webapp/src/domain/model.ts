export type ExpenseId = string;
export type DatetimeISOString = string; // "2022-01-17T08:19:26+00:00"

export interface Expense {
  id: ExpenseId;
  amount: number;
  currency: string;
  originalAmount: number | undefined;
  originalCurrency: string | undefined;
  description: string;
  datetime: Date;
  // The domain should not contain data about the persistence layer, instead, the
  // orchestration layer should enrich/wrap/attach the value with any extra data
  // required
  // submitted: boolean;
  paid_with: number;
  shared: boolean;
  pending: boolean;
}

export interface DraftExpense extends Omit<Expense, "amount"> {
  amount: number | undefined;
}

export type AccountId = number;

export type AccountAlias = string;

export interface Account {
  id: AccountId;
  alias: AccountAlias;
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
