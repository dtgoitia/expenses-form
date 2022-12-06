import { generatePrefixedId } from "./idGeneration";
import { DraftExpense, ExpenseId } from "./model";
import { Observable, Subject } from "rxjs";

export type AddExpenseArgs = Omit<DraftExpense, "id">;

/**
 * As opposed to `Expense` - which is a domain-only concept, agnostic to the expense
 * being successfully persisted or not -, the `AppExpense` is aware of the expense
 * lifecycle withing the application, e.g.: expense is draft, submitted, etc.
 */
export interface AppExpense {
  expense: DraftExpense;
  status: ExpenseStatus;
  readyToPublish: boolean;
}

export enum ExpenseStatus {
  local = "local",
  pushed = "pushed",
  changedSincePushed = "changedSincePushed",
}

export class ExpenseManager {
  public change$: Observable<ExpenseChange>;

  private changeSubject: Subject<ExpenseChange>;
  private expenses: Map<ExpenseId, AppExpense>;

  constructor() {
    this.changeSubject = new Subject<ExpenseChange>();
    this.change$ = this.changeSubject.asObservable();

    this.expenses = new Map<ExpenseId, AppExpense>();
  }

  public add(newExpense: AddExpenseArgs): void {
    console.debug(`ExpenseManager.add::newExpense:`, newExpense);
    const id = this.generateId();
    const expense: DraftExpense = { id, ...newExpense };

    const appExpense: AppExpense = {
      expense,
      status: ExpenseStatus.local,
      readyToPublish: false,
    };

    this.expenses.set(id, appExpense);
    this.changeSubject.next(new ExpenseAdded(id));
  }

  public get(id: ExpenseId): AppExpense {
    const expense = this.expenses.get(id);
    if (expense === undefined) {
      throw new Error(
        `Expected a ${id} Expense ID in ${ExpenseManager.name}, but not found`
      );
    }

    return expense;
  }

  public getAll(): AppExpense[] {
    console.debug(`ExpenseManager.getAll()`);
    const appExpenses: AppExpense[] = [];
    for (const appExpense of this.expenses.values()) {
      appExpenses.push(appExpense);
    }

    return appExpenses.sort((a: AppExpense, b: AppExpense) => {
      // TODO: this needs a tidy up: move -1/0/1 to an easy-to-read enum
      if (a.expense.datetime < b.expense.datetime) return -1;
      return 0;
    });
  }

  public update(expense: DraftExpense): void {
    console.debug(`ExpenseManager.update::expense:`, expense);

    const { id } = expense;

    const previous = this.expenses.get(id);
    if (previous === undefined) {
      throw new Error(`Expected an Expense with ID ${id}, but none found.`);
    }

    const updated: AppExpense = {
      ...previous,
      expense,
      readyToPublish: isReadyToPublish(expense),
    };

    this.expenses.set(id, updated);
    this.changeSubject.next(new ExpenseUpdated(id));
  }

  public delete(id: ExpenseId): void {
    console.debug(`ExpenseManager.delete::id=${id}`);
    this.expenses.delete(id);
    this.changeSubject.next(new ExpenseDeleted(id));
  }

  public initialize({ appExpenses }: { appExpenses: AppExpense[] }): void {
    console.debug(`ExpenseManager.initialize::Starting initialization...`);

    const ids = new Set<ExpenseId>();
    appExpenses.forEach((appExpense) => {
      const id = appExpense.expense.id;

      if (ids.has(id)) {
        throw new Error(`IDs must be unique, and ${id} is repeated`);
      }

      ids.add(id);
      this.expenses.set(id, appExpense);
    });

    console.debug(`ExpenseManager.initialize::Run to completion`);
  }

  private generateId(): ExpenseId {
    return generatePrefixedId("exp");
  }
}

export class ExpenseAdded {
  constructor(public readonly expenseId: ExpenseId) {}
}

export class ExpenseUpdated {
  constructor(public readonly expenseId: ExpenseId) {}
}

export class ExpenseDeleted {
  constructor(public readonly expenseId: ExpenseId) {}
}

type ExpenseChange = ExpenseAdded | ExpenseUpdated | ExpenseDeleted;

function isReadyToPublish(draft: DraftExpense): boolean {
  if (draft.amount === undefined) {
    return false;
  }

  return true;
}
