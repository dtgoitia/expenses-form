import {
  DEFAULT_CURRENCY,
  DEFAULT_PAYMENT_METHOD,
  PAYMENT_ACCOUNTS,
} from "../constants";
import { now } from "../datetimeUtils";
import { AccountName, CurrencyCode } from "../domain";
import { BehaviorSubject } from "rxjs";

interface Expense {
  paidWith: AccountName;
  date: Date;
  amount: number | undefined;
  currency: CurrencyCode;
  description: string | undefined;
  pending: boolean;
  shared: boolean;
  submitting: boolean;
}

export interface ExpensesFormState {
  expenses: Expense[];
  loaded: number; // index of expense loaded in form to be edited
}

type ExpenseUpdater = (expense: Expense) => Expense;

interface IStoredItem<T> {
  exists: () => boolean;
  read: () => T;
  set: (value: T) => void;
  delete: () => void;
}

export interface IStorage {
  form: IStoredItem<object>;
}

interface RawStoredExpense {
  paidWith: string;
  date: string;
  amount: number | null;
  currency: string;
  description: string | null;
  pending: boolean;
  shared: boolean;
  submitting: boolean;
}

interface RawStoredState {
  expenses: RawStoredExpense[];
  loaded: number;
}

function setUndefinedIfNull<T>(value: T | null): T | undefined {
  if (value === null) {
    return undefined;
  }

  return value;
}

function deserialzieExpense(raw: RawStoredExpense): Expense {
  return {
    paidWith: raw.paidWith as AccountName,
    date: new Date(raw.date),
    amount: setUndefinedIfNull(raw.amount),
    currency: raw.currency,
    description: setUndefinedIfNull(raw.description),
    pending: raw.pending,
    shared: raw.shared,
    submitting: raw.submitting,
  };
}

function deserialzieState(raw: RawStoredState): ExpensesFormState | undefined {
  if (!raw) {
    return undefined;
  }

  return {
    expenses: raw.expenses.map(deserialzieExpense),
    loaded: raw.loaded,
  };
}

class ExpensesForm {
  private storage: IStorage;
  public state: ExpensesFormState; // TODO: make this private and only expose state via Observable
  public loadedExpense: Expense;
  private state$: BehaviorSubject<ExpensesFormState>;
  private now: () => Date;

  constructor(now: () => Date, storageClient: IStorage) {
    this.now = now;

    this.storage = storageClient;
    const previous = deserialzieState(
      this.storage.form.read() as RawStoredState
    );

    if (previous) {
      this.state = previous;
    } else {
      this.state = {
        expenses: [
          {
            paidWith: DEFAULT_PAYMENT_METHOD,
            date: this.now(),
            amount: undefined,
            currency: DEFAULT_CURRENCY,
            description: undefined,
            pending: true,
            shared: false,
            submitting: false,
          },
        ],
        loaded: 0,
      };
      this.storage.form.set(this.state);
    }

    this.loadedExpense = this.state.expenses[this.state.loaded];
    this.state$ = new BehaviorSubject(this.state);
    // TODO: pass errorService on constructor, to emit errors as needed
  }

  public setPaidWith(paidWith: AccountName): void {
    // TODO: validate if account is supported
    this.updateNthExpense(
      this.state.loaded,
      (expense: Expense): Expense => ({ ...expense, paidWith })
    );
  }

  public setDate(date: Date): void {
    this.updateNthExpense(
      this.state.loaded,
      (expense: Expense): Expense => ({ ...expense, date })
    );
  }

  public setAmount(amount: number | undefined): void {
    this.updateNthExpense(
      this.state.loaded,
      (expense: Expense): Expense => ({ ...expense, amount })
    );
  }

  public setCurrency(currency: CurrencyCode): void {
    this.updateNthExpense(
      this.state.loaded,
      (expense: Expense): Expense => ({ ...expense, currency })
    );
  }

  public setDescription(description: string | undefined): void {
    this.updateNthExpense(
      this.state.loaded,
      (expense: Expense): Expense => ({ ...expense, description })
    );
  }

  public setPending(pending: boolean): void {}

  public setShared(shared: boolean): void {
    this.updateNthExpense(
      this.state.loaded,
      (expense: Expense): Expense => ({ ...expense, shared })
    );
  }

  public setSubmitting(submitting: boolean): void {
    this.updateNthExpense(
      this.state.loaded,
      (expense: Expense): Expense => ({ ...expense, submitting })
    );
  }

  public addExpense(expense: Expense): void {
    /**
     * Add expense maintaining chronological order and update `loader` pointer
     * as required.
     */

    const previousLoaded = this.state.loaded;

    // append new expense at the end - it's important to add it to the end, to preserve
    // existing order and therefore `loaded` still points to the right expense
    const expenses = [...this.state.expenses, expense];

    // assign `index` to every expense
    const indexed = expenses.map((expense, i) => ({ expense, index: i }));

    // sort by date
    const sorted = indexed.sort(function (a, b) {
      const [date_a, date_b] = [a.expense.date, b.expense.date];
      if (date_a < date_b) return -1;
      if (date_a === date_b) return 0;
      return 1;
    });

    // find loaded expense by `index`, and update `loaded` with its current position in array
    let newLoaded: number | undefined = undefined;
    for (let currentIndex = 0; currentIndex < sorted.length; currentIndex++) {
      const numberedExpense = sorted[currentIndex];
      if (numberedExpense.index == previousLoaded) {
        newLoaded = currentIndex;
        break;
      }
    }

    if (!newLoaded) {
      throw new Error(
        `Could not find expense by "loaded" pointer after adding a new expense`
      );
    }

    const sortedExpenses = sorted.map((numbered) => numbered.expense);

    this.update({ expenses: sortedExpenses, loaded: newLoaded });
  }

  public removeExpenseByIndex(index: number): void {
    /**
     * Remove expense and update `loader` pointer as required.
     *
     * Assumption: expenses are in chronological order
     */
    let expenseRemoved = false;
    const previousLoaded = this.state.loaded;
    let newLoaded = previousLoaded;
    const updatedExpenses: Expense[] = [];
    this.state.expenses.forEach((expense, n) => {
      if (n === index) {
        expenseRemoved = true;
        return;
      }

      // Update `newLoaded` value on the go using `expenseRemoved`
      if (n === this.state.loaded) {
        if (expenseRemoved) {
          // The loaded expense was after the removed item, the pointer
          // needs to be shifted one to the right (forward in time)
          newLoaded = previousLoaded - 1;
        } else {
          // The loaded expense was before the removed item, so no need
          // to update the pointer
          newLoaded = previousLoaded;
        }
      }

      updatedExpenses.push(expense);
    });

    this.update({ expenses: updatedExpenses, loaded: newLoaded });
  }

  private updateNthExpense(n: number, func: ExpenseUpdater): void {
    const newState = {
      ...this.state,
      expenses: this.state.expenses.map((item, i) => {
        if (i != n) return item;
        return func(item);
      }),
    };
    this.update(newState);
  }

  private update(state: ExpensesFormState): void {
    this.state = state;
    this.loadedExpense = this.state.expenses[this.state.loaded];
    this.storage.form.set(state);
    this.state$.next(state);
  }
}

// React subscribes to changes in this.state$, and updates its local state each time something changes.

// how to subscribe react component to Observable: https://stackoverflow.com/a/57309032/8038693

export default ExpensesForm;
