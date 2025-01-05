export type ExpenseId = string;
export type DatetimeISOString = string; // "2022-01-17T08:19:26+00:00"
export type DatetimeCustomISOString = string; // "2022-01-17 08:19:26 +00:00"

export interface Expense {
  id: ExpenseId;
  amount: number;
  currency: string;
  originalAmount: number | undefined;
  originalCurrency: string | undefined;
  description: string;
  datetime: DatetimeISOString;
  // The domain should not contain data about the persistence layer, instead, the
  // orchestration layer should enrich/wrap/attach the value with any extra data
  // required
  // submitted: boolean;
  paid_with: PaymentAccountId;
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

export type PaymentAccountId = string;
export type PaymentAccountName = string;
export type LedgerAccountName = string;

export interface PaymentAccount {
  id: PaymentAccountId;
  name: PaymentAccountName; // the one displayed in the UI dropdown
  ledgerName: LedgerAccountName;
  currency: CurrencyCode;
}
export type DraftPaymentAccount = Omit<PaymentAccount, "id">;

export type ShortcutId = number;

export type Seller = string;

export type PersonName = string;

export interface Person {
  name: PersonName;
  splitwiseId?: SplitwiseId;
}

export type TagName = string; // TODO: make every piece of code point here

export interface Shortcut {
  id: ShortcutId;
  buttonName: string;
  main: string;
  people: PersonName[];
  seller: Seller;
  tags: TagName[];
}

export type SplitwiseId = string;
