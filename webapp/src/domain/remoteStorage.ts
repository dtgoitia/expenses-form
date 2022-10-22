import { ExpenseAdded, ExpenseDeleted, ExpenseManager } from "./expenses";
import { Expense, ExpenseId } from "./model";
import { interval, merge, Subject } from "rxjs";

interface RemoteStorageProps {
  expenseManager: ExpenseManager;
}

export class RemoteStorage {
  private expenseManager: ExpenseManager;

  // Queue changes in a retry queue, where operations are attempted in order, so that there is no problem
  private commandQueue: Command[] = [];
  private inflightCommand: Command | undefined;
  private adhocTrigger = new Subject<void>();

  constructor({ expenseManager }: RemoteStorageProps) {
    this.expenseManager = expenseManager;

    this.expenseManager.change$.subscribe((change) => {
      console.debug(`RemoteStorage.expenseManager.changes: ${change}`);
      switch (true) {
        case change instanceof ExpenseAdded:
          return this.handleExpenseAdded(change);
        case change instanceof ExpenseDeleted:
          return this.handleExpenseDeleted(change);
        default:
          throw new Error(`BrowserStorage: unsupported change: ${change}`);
      }
    });

    // TODO: Every so often, if there is connection, retry commands in order
    const RETRY_INTERVAL_IN_MINS = 5; // TODO: move to settings
    // const retry_internal_ms = RETRY_INTERVAL_IN_MINS * 60 * 1000;
    const retry_internal_ms = 1000;
    const ticker = interval(retry_internal_ms);

    merge(ticker, this.adhocTrigger).subscribe(async (_) => {
      if (this.shouldProcessCommands() === false) return;

      // TODO: find a way of holding the processing and do not process the next command
      // until the previous one has finished
      // use a lock in memory - something that says "I'm processing something, just come back later"

      // TODO: optimization 2: you can parallelize Commands that are independent - aka:
      //                       Commands that belong to different Expenses

      await this.runCommandProcessor();
    });
  }

  private async runCommandProcessor(): Promise<void> {
    console.debug(`RemoteStorage.runCommandProcessor`);

    // TODO: build stage machine
    /**
     * Get first item in queue, but don't dequeue it
     * process it
     */

    // Unblock the thread for 300m and then it continues processing commands
    if (this.shouldProcessCommands()) {
      setTimeout(() => this.forceRunCommandProcessor(), 300);
    }
  }

  private shouldProcessCommands(): boolean {
    if (this.commandQueue.length) return true;

    if (this.inflightCommand !== undefined) {
      return true;
    }

    return false;
  }

  private forceRunCommandProcessor(): boolean {
    return this.commandQueue.length > 0;
  }

  private handleExpenseAdded(change: ExpenseAdded): void {
    console.log("RemoteStorage.handleExpenseAdded", change);
    const expense = this.expenseManager.get(change.expenseId);
    const command = new CreateExpenseInRemote(expense);
    this.commandQueue.push(command);
  }

  private handleExpenseDeleted(change: ExpenseDeleted): void {
    console.log("RemoteStorage.handleExpenseDeleted::", change);
    const command = new DeleteExpenseFromRemote(change.expenseId);
    this.commandQueue.push(command);
  }
}

class CreateExpenseInRemote {
  constructor(public readonly expense: Expense) {}
}
class DeleteExpenseFromRemote {
  constructor(public readonly expenseId: ExpenseId) {}
}

type Command = CreateExpenseInRemote | DeleteExpenseFromRemote;
