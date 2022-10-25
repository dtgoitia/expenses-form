import { generatePrefixedId } from "./idGeneration";
import { Expense, ExpenseId } from "./model";
import { Observable, Subject } from "rxjs";

export type NewExpense = Omit<Expense, "id">;

export class ExpenseManager {
  public change$: Observable<ExpenseChange>;

  private changeSubject: Subject<ExpenseChange>;
  private expenses: Map<ExpenseId, Expense>;

  constructor() {
    this.changeSubject = new Subject<ExpenseChange>();
    this.change$ = this.changeSubject.asObservable();

    this.expenses = new Map<ExpenseId, Expense>();
  }

  public add(newExpense: NewExpense): void {
    console.debug(`ExpenseManager.add()`);
    const id = this.generateId();
    const expense: Expense = { id, ...newExpense };

    this.expenses.set(id, expense);
    this.changeSubject.next(new ExpenseAdded(id));
  }

  public get(id: ExpenseId): Expense {
    const expense = this.expenses.get(id);
    if (expense === undefined) {
      throw new Error(
        `Expected a ${id} Expense ID in ${ExpenseManager.name}, but not found`
      );
    }

    return expense;
  }

  public getAll(): Expense[] {
    console.debug(`ExpenseManager.getAll()`);
    const expenses: Expense[] = [];
    for (const expense of this.expenses.values()) {
      expenses.push(expense);
    }

    return expenses.sort((a: Expense, b: Expense) => {
      // TODO: this needs a tidy up: move -1/0/1 to an easy-to-read enum
      if (a.datetime < b.datetime) return -1;
      return 0;
    });
  }

  public update(expense: Expense): void {
    throw new Error("Not implemented yet");
  }

  public delete(id: ExpenseId): void {
    console.debug(`ExpenseManager.delete::id=${id}`);
    this.expenses.delete(id);
    this.changeSubject.next(new ExpenseDeleted(id));
  }

  public initialize({ expenses }: { expenses: Expense[] }): void {
    console.debug(`ExpenseManager.initialize()`);
    const ids = new Set<ExpenseId>();
    expenses.forEach((expense) => {
      const id = expense.id;

      if (ids.has(id)) {
        throw new Error(`IDs must be unique, and ${id} is repeated`);
      }

      ids.add(id);
      this.expenses.set(id, expense);
    });
  }

  private generateId(): ExpenseId {
    return generatePrefixedId("exp");
  }
}

export class ExpenseAdded {
  constructor(public readonly expenseId: ExpenseId) {}
}

export class ExpenseDeleted {
  constructor(public readonly expenseId: ExpenseId) {}
}

type ExpenseChange = ExpenseAdded | ExpenseDeleted;
