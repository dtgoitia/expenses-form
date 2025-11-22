export type ExpenseId = string;
export type DateISOString = string; // "2022-01-17"
export type DatetimeISOString = string; // "2022-01-17T08:19:26+00:00"
export type DatetimeCustomISOString = string; // "2022-01-17 08:19:26 +00:00"

export type CurrencyAmount = number;

export interface Expense {
  id: ExpenseId;
  amount: CurrencyAmount;
  currency: string;
  originalAmount: CurrencyAmount | undefined;
  originalCurrency: string | undefined;
  description: string;
  datetime: DatetimeISOString;
  paid_with: PaymentAccountId;
  shared: boolean;
  pending: boolean;
  splits: Split[];
}

export interface DraftExpense extends Omit<Expense, "amount"> {
  amount: CurrencyAmount | undefined;
}

export interface Split {
  person: PersonName;
  owed: CurrencyAmount | undefined;
  paid: CurrencyAmount | undefined;
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

export type PaymentAccountIsVisible = boolean;
export type PaymentAccountIsTheDefaultOne = boolean;
export interface PaymentAccount {
  id: PaymentAccountId;
  name: PaymentAccountName; // the one displayed in the UI dropdown
  ledgerName: LedgerAccountName;
  currency: CurrencyCode;
  isVisible: PaymentAccountIsVisible;
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

export type ShortcutButtonName = string;
export type ShortcutMainDescription = string;

export interface Shortcut {
  id: ShortcutId;
  buttonName: ShortcutButtonName;
  main: ShortcutMainDescription;
  people: PersonName[];
  seller: Seller | undefined;
  tags: TagName[];
}

export type ValidDraftShortcut = Omit<Shortcut, "id">;
export type DraftShortcut = Omit<ValidDraftShortcut, "main"> & {
  main: ShortcutMainDescription | undefined;
};

export type SplitwiseId = string;
