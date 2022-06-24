import { DEFAULT_CURRENCY, DEFAULT_PAYMENT_METHOD } from "../constants";
import { AccountName, CurrencyCode } from "../domain";
import { BehaviorSubject, filter } from "rxjs";
import { UnexpectedScenario } from "./devex";

export type ExpenseId = string;
export enum ExpenseStatus {
  /**
   *                │
   *                ▼
   *         ┌───►DRAFT──────────────────────────┐
   *         │      │                            │
   *     (failed)   │                            │
   *         │      ▼                            │
   *         └──SUBMITTING                       │
   *                │                            │
   *                ▼                            ▼
   *  ┌────────►SUBMITTED───────►DELETING────►(gone)
   *  │           ▲ │ ▲             │
   *  │      ┌────┘ │ └──(failed)───┘
   *  │      │      │
   *  │  (discard)  │
   *  │      │      ▼
   *  │      └───EDITING◄────┐
   *  │             │        │
   *  │             │    (failed)
   *  │             ▼        │
   *  └──────────UPDATING────┘
   */
  Draft = "DRAFT",
  Submitting = "SUBMITTING",
  Submitted = "SUBMITTED",
  Editing = "EDITING",
  Updating = "UPDATING",
  Deleting = "DELETING",
}

interface Expense {
  id: ExpenseId;
  paidWith: AccountName;
  date: Date;
  amount: number | undefined;
  currency: CurrencyCode;
  description: string | undefined;
  pending: boolean;
  shared: boolean;
  status: ExpenseStatus;
  focused: boolean;
}

type ExpenseWithoutId = Omit<Expense, "id" | "focused">;

export interface ExpensesFormState {
  expenses: Expense[];
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
  id: string;
  paidWith: string;
  date: string;
  amount: number | null;
  currency: string;
  description: string | null;
  pending: boolean;
  shared: boolean;
  status: string;
  focused: boolean;
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

export class DataIntegrityError extends Error {
  constructor(message: string) {
    super(message);

    // because we are extending a built-in class
    Object.setPrototypeOf(this, InvalidExpenseStatus.prototype);
  }
}

export class InvalidExpenseStatus extends Error {
  constructor(message: string) {
    super(message);

    // because we are extending a built-in class
    Object.setPrototypeOf(this, InvalidExpenseStatus.prototype);
  }
}

export function deserializeExpenseStatus(raw: string): ExpenseStatus {
  if (!Object.values(<any>ExpenseStatus).includes(raw)) {
    throw new InvalidExpenseStatus(
      `The value ${raw} is not a valid ExpenseStatus`
    );
  }

  const status = raw as ExpenseStatus;

  return status;
}

function deserializeExpense(raw: RawStoredExpense): Expense {
  return {
    id: raw.id as ExpenseId,
    paidWith: raw.paidWith as AccountName,
    date: new Date(raw.date),
    amount: setUndefinedIfNull(raw.amount),
    currency: raw.currency,
    description: setUndefinedIfNull(raw.description),
    pending: raw.pending,
    shared: raw.shared,
    status: deserializeExpenseStatus(raw.status),
    focused: raw.focused,
  };
}

function deserializeState(raw: RawStoredState): ExpensesFormState | undefined {
  if (!raw) {
    return undefined;
  }

  return {
    expenses: raw.expenses.map(deserializeExpense),
  };
}

export default class ExpensesForm {
  private storage: IStorage;
  public state: ExpensesFormState; // TODO: make this private and only expose state via Observable
  private state$: BehaviorSubject<ExpensesFormState>;
  private now: () => Date; // TODO: what is this used for??

  constructor(now: () => Date, storageClient: IStorage) {
    this.now = now;

    this.storage = storageClient;
    const previous = deserializeState(
      this.storage.form.read() as RawStoredState
    );

    if (previous) {
      this.state = previous;
    } else {
      this.state = {
        expenses: [
          {
            id: generateExpenseId(),
            paidWith: DEFAULT_PAYMENT_METHOD,
            date: this.now(),
            amount: undefined,
            currency: DEFAULT_CURRENCY,
            description: undefined,
            pending: true,
            shared: false,
            status: ExpenseStatus.Draft,
            focused: true,
          },
        ],
      };
      this.storage.form.set(this.state);
    }

    // this.loadedExpense = this.state.expenses[this.state.focused];
    this.state$ = new BehaviorSubject(this.state);
    // TODO: pass errorService on constructor, to emit errors as needed
  }

  public getFocusedExpense(): Expense {
    this.assertOnlyOneExpenseIsFocused();
    return this.state.expenses.filter((expense) => expense.focused === true)[0];
  }

  public focusExpense(id: ExpenseId): void {
    this.assertOnlyOneExpenseIsFocused();

    let expenseFound = false;
    const updatedExpenses = this.state.expenses.map((expense) => {
      if (expense.id === id) {
        expenseFound = true;
        return { ...expense, focused: true };
      }

      return { ...expense, focused: false };
    });

    if (!expenseFound) {
      throw new Error(`No expense found with id ${id}`);
    }

    this.update({ ...this.state, expenses: updatedExpenses });
  }

  public setPaidWith(paidWith: AccountName): void {
    // TODO: validate if account is supported
    this.updateFocusedExpense(
      (expense: Expense): Expense => ({ ...expense, paidWith })
    );
  }

  public setDate(date: Date): void {
    this.updateFocusedExpense(
      (expense: Expense): Expense => ({ ...expense, date })
    );
  }

  public setAmount(amount: number | undefined): void {
    this.updateFocusedExpense(
      (expense: Expense): Expense => ({ ...expense, amount })
    );
  }

  public setCurrency(currency: CurrencyCode): void {
    this.updateFocusedExpense(
      (expense: Expense): Expense => ({ ...expense, currency })
    );
  }

  public setDescription(description: string | undefined): void {
    this.updateFocusedExpense(
      (expense: Expense): Expense => ({ ...expense, description })
    );
  }

  public setShared(shared: boolean): void {
    this.updateFocusedExpense(
      (expense: Expense): Expense => ({ ...expense, shared })
    );
  }

  public setStatus(status: ExpenseStatus): void {
    this.updateFocusedExpense(
      (expense: Expense): Expense => ({ ...expense, status })
    );
  }

  public addExpense(expense: ExpenseWithoutId): void {
    /**
     * Add expense maintaining chronological order and update `loader` pointer
     * as required.
     */

    if (expense.status !== ExpenseStatus.Draft) {
      throw new InvalidExpenseStatus(
        `Every new entry must start with a ${ExpenseStatus.Draft} status`
      );
    }

    const newExpense: Expense = {
      ...expense,
      id: generateExpenseId(),
      focused: false, // the added expense must be automatically focused
    };

    // Unfocus every other expense
    const existingExpenses = this.state.expenses.map((expense) => {
      expense.focused = false;
      return expense;
    });

    this.update({
      expenses: [...existingExpenses, newExpense].sort(SorterExpenseByDate),
    });
  }

  // public removeExpenseById(id: ExpenseId): void {
  //   /**
  //    * Remove expense and update `loader` pointer as required.
  //    *
  //    * Assumption: expenses are in chronological order
  //    */
  //   let expenseRemoved = false;
  //   this.state.expenses.filter((expense, n) => {
  //     if (n === index) {
  //       expenseRemoved = true;
  //       return;
  //     }

  //     // Update `newLoaded` value on the go using `expenseRemoved`
  //     if (n === this.state.focused) {
  //       if (expenseRemoved) {
  //         // The loaded expense was after the removed item, the pointer
  //         // needs to be shifted one to the right (forward in time)
  //         newLoaded = previousLoaded - 1;
  //       } else {
  //         // The loaded expense was before the removed item, so no need
  //         // to update the pointer
  //         newLoaded = previousLoaded;
  //       }
  //     }

  //     updatedExpenses.push(expense);
  //   });

  //   this.update({ expenses: updatedExpenses });
  // }

  private assertOnlyOneExpenseIsFocused(): void {
    const focusedExpenses = this.state.expenses.filter(
      (expense) => expense.focused
    );
    const amount = focusedExpenses.length;
    if (amount === 0) {
      throw new DataIntegrityError(
        `Expected one focused expense, but none were found`
      );
    }

    if (amount > 1) {
      throw new DataIntegrityError(
        `Expected one focused expense, but multiple were found`
      );
    }
  }

  private updateFocusedExpense(func: ExpenseUpdater): void {
    const newState = {
      ...this.state,
      expenses: this.state.expenses.map((expense) => {
        return expense.focused ? func(expense) : expense;
      }),
    };
    this.update(newState);
  }

  private update(state: ExpensesFormState): void {
    this.state = state;
    this.storage.form.set(state);
    this.state$.next(state);
  }
}

// React subscribes to changes in this.state$, and updates its local state each time something changes.

// how to subscribe react component to Observable: https://stackoverflow.com/a/57309032/8038693

/**
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
function hashCode(str) {
  // source: https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return `${hash}`;
}

export function generateExpenseId(): ExpenseId {
  const randomString = new Date().toISOString();
  const hash = hashCode(randomString);
  return hash;
}

function SorterExpenseByDate(a: Expense, b: Expense): number {
  const [date_a, date_b] = [a.date, b.date];
  if (date_a < date_b) return -1;
  if (date_a === date_b) return 0;
  return 1;
}
