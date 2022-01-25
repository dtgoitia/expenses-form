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
