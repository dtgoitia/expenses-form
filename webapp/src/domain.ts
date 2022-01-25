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
