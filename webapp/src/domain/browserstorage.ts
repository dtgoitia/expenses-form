import { Storage } from "../localStorage";
import { ExpenseAdded, ExpenseDeleted, ExpenseManager } from "./expenses";
import { Expense, ExpenseId } from "./model";

type GenericObject = { [key: string]: any };

interface BrowserStorageParams {
  client: Storage;
  expenseManager: ExpenseManager;
}
export class BrowserStorage {
  private client: Storage;
  private expenseManager: ExpenseManager;

  constructor({ expenseManager, client }: BrowserStorageParams) {
    this.client = client;
    this.expenseManager = expenseManager;

    this.expenseManager.change$.subscribe((change) => {
      console.debug(`BrowserStorage.expenseManager.changes: ${change}`);
      switch (true) {
        case change instanceof ExpenseAdded:
          return this.handleExpenseAdded(change);
        case change instanceof ExpenseDeleted:
          return this.handleExpenseDeleted(change);
        default:
          throw new Error(`BrowserStorage: unsupported change: ${change}`);
      }
    });
  }

  public readExpenses(): Expense[] {
    console.debug(`BrowserStorage.readExpenses()`);
    const current = this.client.expenses.read() || {};
    const expenses: Expense[] = [];
    for (const storedItem of Object.values(current)) {
      const expense: Expense = {
        id: storedItem.id,
        amount: storedItem.amount,
        currency: storedItem.currency,
        description: storedItem.description,
        datetime: new Date(storedItem.datetime),
        paid_with: storedItem.paid_with,
        shared: storedItem.shared,
        pending: storedItem.pending,
      };
      expenses.push(expense);
    }
    return expenses;
  }

  private persistExpense(expense: Expense): void {
    // Overwrites any existing value
    const current: GenericObject = this.client.expenses.read() || {};
    const updated = { ...current, [expense.id]: expense };
    this.client.expenses.set(updated);
  }

  private deleteExpense(id: ExpenseId): void {
    console.debug(`BrowserStorage.deleteExpense::id=${id}`);
    const current: GenericObject = this.client.expenses.read() || {};
    const updated = { ...current };
    delete updated[id];
    this.client.expenses.set(updated);
  }

  private handleExpenseAdded(change: ExpenseAdded): void {
    const expense = this.expenseManager.get(change.expenseId);
    this.persistExpense(expense);
  }

  private handleExpenseDeleted(change: ExpenseDeleted): void {
    this.deleteExpense(change.expenseId);
  }
}
