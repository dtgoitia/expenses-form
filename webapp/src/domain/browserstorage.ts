import { assertNever } from "../exhaustive-match";
import { Storage } from "../localStorage";
import { AppExpense, ExpenseManager, ExpenseStatus } from "./expenses";
import {
  CurrencyCode,
  ExpenseId,
  PaymentAccount,
  PaymentAccountId,
  Person,
  Shortcut,
} from "./model";
import { PaymentAccountsManager } from "./paymentAccounts";
import { PeopleManager } from "./people";
import { ShortcutsManager } from "./shortcuts";

type GenericObject = { [key: string]: any };

interface BrowserStorageParams {
  client: Storage;
  expenseManager: ExpenseManager;
  paymentAccountsManager: PaymentAccountsManager;
  peopleManager: PeopleManager;
  shortcutsManager: ShortcutsManager;
}

export class BrowserStorage {
  private client: Storage;
  private expenseManager: ExpenseManager;
  private paymentAccountsManager: PaymentAccountsManager;
  private peopleManager: PeopleManager;
  private shortcutsManager: ShortcutsManager;

  constructor({
    client,
    expenseManager,
    paymentAccountsManager,
    peopleManager,
    shortcutsManager,
  }: BrowserStorageParams) {
    this.client = client;
    this.expenseManager = expenseManager;
    this.paymentAccountsManager = paymentAccountsManager;
    this.peopleManager = peopleManager;
    this.shortcutsManager = shortcutsManager;

    this.expenseManager.change$.subscribe((change) => {
      console.debug(`BrowserStorage.expenseManager.changes:`, change);
      switch (change.kind) {
        case "ExpenseAdded":
          return this.handleExpenseAdded(change.expenseId);
        case "ExpenseUpdated":
          return this.handleExpenseUpdated(change.expenseId);
        case "ExpenseDeleted":
          return this.handleExpenseDeleted(change.expenseId);
        default:
          throw new Error(`BrowserStorage: unsupported change: ${change}`);
      }
    });

    this.paymentAccountsManager.change$.subscribe((change) => {
      console.debug(`BrowserStorage.paymentAccountsManager.change$:`, change);
      switch (change.kind) {
        case "PaymentAccountManagerInitialized":
          return;
        case "PaymentAccountAdded":
          return this.persistAllPaymentAccounts();
        case "PaymentAccountUpdated":
          return this.persistAllPaymentAccounts();
        case "PaymentAccountDeleted":
          return this.persistAllPaymentAccounts();
      }
    });

    this.peopleManager.change$.subscribe((change) => {
      console.debug(`BrowserStorage.peopleManager.change$:`, change);
      switch (change.kind) {
        case "PeopleManagerInitialized":
          return;
        case "PersonAdded":
          return this.persistAllPeople();
        case "PersonUpdated":
          return this.persistAllPeople();
        case "PersonDeleted":
          return this.persistAllPeople();
        default:
          assertNever(change, `unsupported PeopleChange: ${change}`);
      }
    });

    this.shortcutsManager.change$.subscribe((change) => {
      console.debug(`BrowserStorage.shortcutsManager.change$:`, change);
      switch (change.kind) {
        case "ShortcutsManagerInitialized":
          return;
        case "ShortcutAdded":
          return this.persistAllShortcuts();
        case "ShortcutUpdated":
          return this.persistAllShortcuts();
        case "ShortcutDeleted":
          return this.persistAllShortcuts();
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
          originalAmount: storedItem.expense.originalAmount,
          originalCurrency: storedItem.expense.originalCurrency,
          description: storedItem.expense.description,
          datetime: storedItem.expense.datetime,
          paid_with: storedItem.expense.paid_with,
          shared: storedItem.expense.shared,
          pending: storedItem.expense.pending,
          splits: storedItem.expense.splits,
        },
        status: ExpenseStatus[storedItem.status as keyof typeof ExpenseStatus],
        readyToPublish: storedItem.readyToPublish,
      };

      allExpenses.push(appExpense);
    }
    return allExpenses;
  }

  public readCurrencies(): CurrencyCode[] {
    console.debug(`${BrowserStorage.name}.${this.readCurrencies.name}()`);
    const raw = this.client.currencies.read() || "";
    const currencies: CurrencyCode[] = raw.split(",");
    return currencies;
  }

  public readPaymentAccounts(): PaymentAccount[] {
    console.debug(`${BrowserStorage.name}.${this.readPaymentAccounts.name}()`);
    const raw: any[] = this.client.paymentAccounts.read() || [];
    const accounts: PaymentAccount[] = [];
    for (const storedItem of raw) {
      const account: PaymentAccount = {
        id: storedItem.id,
        name: storedItem.name,
        ledgerName: storedItem.ledgerName,
        currency: storedItem.currency,
        isVisible: storedItem.isVisible === undefined ? true : storedItem.isVisible,
      };

      accounts.push(account);
    }

    return accounts;
  }

  public readDefaultAccountId(): PaymentAccountId | undefined {
    console.debug(`${BrowserStorage.name}.${this.readDefaultAccountId.name}()`);
    const id = this.client.defaultPaymentAccountId.read();
    return id;
  }

  public readPeople(): Person[] {
    console.debug(`BrowserStorage.readPeople()`);
    const raw: any[] = this.client.people.read() || [];
    const people: Person[] = [];
    for (const storedItem of raw) {
      const person: Person = {
        name: storedItem.name,
        splitwiseId: storedItem.splitwiseId,
      };
      people.push(person);
    }

    return people;
  }

  public readShortcuts(): Shortcut[] {
    console.debug(`BrowserStorage.readShortcuts()`);
    const raw: any[] = this.client.shortcuts.read() || [];
    const shortcuts: Shortcut[] = [];
    for (const storedItem of raw) {
      const shortcut: Shortcut = {
        id: storedItem.id,
        buttonName: storedItem.buttonName,
        main: storedItem.main,
        people: storedItem.people,
        seller: storedItem.seller,
        tags: storedItem.tags,
      };
      shortcuts.push(shortcut);
    }

    return shortcuts;
  }

  public setDefaultAccountId({ id }: { id: PaymentAccountId }): void {
    console.debug(`${BrowserStorage.name}.${this.setDefaultAccountId.name}()`);
    this.client.defaultPaymentAccountId.set(id);
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

  private handleExpenseAdded(expenseId: ExpenseId): void {
    const appExpense = this.expenseManager.get(expenseId);
    this.persistAppExpense(appExpense);
  }

  private handleExpenseUpdated(expenseId: ExpenseId): void {
    const appExpense = this.expenseManager.get(expenseId);
    this.persistAppExpense(appExpense);
  }

  private handleExpenseDeleted(expenseId: ExpenseId): void {
    this.deleteExpense(expenseId);
  }

  private persistAllPaymentAccounts(): void {
    const accounts = this.paymentAccountsManager.getAll();
    this.client.paymentAccounts.set(accounts);
  }

  private persistAllPeople(): void {
    const people = this.peopleManager.getAll();
    this.client.people.set(people);
  }

  private persistAllShortcuts(): void {
    const shortcuts = this.shortcutsManager.getAll();
    this.client.shortcuts.set(shortcuts);
  }
}
