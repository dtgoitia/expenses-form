import { Storage } from "../localStorage";
import {
  AppExpense,
  ExpenseAdded,
  ExpenseDeleted,
  ExpenseManager,
  ExpenseStatus,
  ExpenseUpdated,
} from "./expenses";
import { ExpenseId } from "./model";

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
        case change instanceof ExpenseUpdated:
          return this.handleExpenseUpdated(change);
        case change instanceof ExpenseDeleted:
          return this.handleExpenseDeleted(change);
        default:
          throw new Error(`BrowserStorage: unsupported change: ${change}`);
      }
    });
  }

  public readExpenses(): AppExpense[] {
    console.debug(`BrowserStorage.readExpenses()`);
    const current = this.client.expenses.read() || {};
    const allExpenses: AppExpense[] = [];
    for (const storedItem of Object.values(current)) {
      const appExpense: AppExpense = {
        expense: {
          id: storedItem.expense.id,
          amount: storedItem.expense.amount,
          currency: storedItem.expense.currency,
          description: storedItem.expense.description,
          datetime: new Date(storedItem.expense.datetime),
          paid_with: storedItem.expense.paid_with,
          shared: storedItem.expense.shared,
          pending: storedItem.expense.pending,
        },
        status: ExpenseStatus[storedItem.status as keyof typeof ExpenseStatus],
        readyToPublish: storedItem.readyToPublish,
      };

      allExpenses.push(appExpense);
    }
    return allExpenses;
  }

  private persistAppExpense(appExpense: AppExpense): void {
    // Overwrites any existing value
    const current: GenericObject = this.client.expenses.read() || {};
    const updated = { ...current, [appExpense.expense.id]: appExpense };
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
    const appExpense = this.expenseManager.get(change.expenseId);
    this.persistAppExpense(appExpense);
  }

  private handleExpenseUpdated(change: ExpenseUpdated): void {
    const appExpense = this.expenseManager.get(change.expenseId);
    this.persistAppExpense(appExpense);
  }

  private handleExpenseDeleted(change: ExpenseDeleted): void {
    this.deleteExpense(change.expenseId);
  }
}
