import { assertNever } from "../exhaustive-match";
import { BrowserStorage } from "./browserstorage";
import { CurrencyManager } from "./currencies";
import { ExpenseManager } from "./expenses";
import { CurrencyCode, PaymentAccountId } from "./model";
import {
  PaymentAccountChanges as PaymentAccountChange,
  PaymentAccountsManager,
} from "./paymentAccounts";
import { PeopleManager } from "./people";
import { ShortcutsManager } from "./shortcuts";

interface Args {
  expenseManager: ExpenseManager;
  paymentAccountsManager: PaymentAccountsManager;
  browserStorage: BrowserStorage;
  currencyManager: CurrencyManager;
  peopleManager: PeopleManager;
  shortcutsManager: ShortcutsManager;
}

export class App {
  public expenseManager: ExpenseManager;
  public paymentAccountsManager: PaymentAccountsManager;
  public currencyManager: CurrencyManager;
  public peopleManager: PeopleManager;
  public shortcutsManager: ShortcutsManager;
  public initialized: boolean = false;

  private browserStorage: BrowserStorage;

  constructor({
    expenseManager,
    paymentAccountsManager,
    browserStorage,
    currencyManager,
    peopleManager,
    shortcutsManager,
  }: Args) {
    this.expenseManager = expenseManager;
    this.paymentAccountsManager = paymentAccountsManager;
    this.browserStorage = browserStorage;
    this.currencyManager = currencyManager;
    this.peopleManager = peopleManager;
    this.shortcutsManager = shortcutsManager;

    this.paymentAccountsManager.change$.subscribe((change) =>
      this.handlePaymentAccountChange(change)
    );
  }

  public initialize(): void {
    console.debug(`App.initialize::started`);
    if (this.initialized) {
      console.debug(`App.initialize::already initialized`);
    } else {
      const appExpenses = this.browserStorage.readExpenses();
      this.expenseManager.initialize({ appExpenses });

      const currencies = this.browserStorage.readCurrencies();
      const accounts = this.browserStorage.readPaymentAccounts();

      this.currencyManager.initialize({
        currencies: [
          ...currencies,
          //
          // Use currencies in Account too
          ...accounts.map((account) => account.currency),
        ],
      });

      this.paymentAccountsManager.initialize({
        accounts,
        defaultAccountId: this.browserStorage.readDefaultAccountId(),
      });

      this.peopleManager.initialize({ people: this.browserStorage.readPeople() });

      this.shortcutsManager.initialize({
        shortcuts: this.browserStorage.readShortcuts(),
      });

      this.initialized = true;
    }
    console.debug(`App.initialize::completed`);
  }

  public deleteCurrencySafe(currency: CurrencyCode): DeleteCurrencyResult {
    let isUsedByAccount =
      this.paymentAccountsManager
        .getAll()
        .filter((account) => account.currency === currency).length > 0;
    if (isUsedByAccount) {
      return {
        ok: false,
        reason: `currency ${currency} was not deleted because it used by one or more account`,
      };
    }

    let isUsedByExpense =
      this.expenseManager
        .getAll()
        .filter((expense) =>
          [expense.expense.currency, expense.expense.originalCurrency].includes(currency)
        ).length > 0;
    if (isUsedByExpense) {
      return {
        ok: false,
        reason: `currency ${currency} was not deleted because it used as an 'original currency' by one or more expenses`,
      };
    }

    const unsafeResult = this.currencyManager.deleteUnsafe(currency);
    if (unsafeResult.ok === false) {
      return { ok: false, reason: unsafeResult.reason };
    }

    return unsafeResult;
  }

  private handlePaymentAccountChange(change: PaymentAccountChange): void {
    switch (change.kind) {
      case "PaymentAccountManagerInitialized":
        return;
      case "PaymentAccountAdded":
        return;
      case "PaymentAccountUpdated":
        return;
      case "PaymentAccountDeleted":
        return;
      case "DefaultPaymentAccountSet":
        return this.handleDefaultPaymentAccountChange(change.id);
      default:
        assertNever(change, `unsupported PaymentAccountChange: ${change}`);
    }
  }

  private handleDefaultPaymentAccountChange(id: PaymentAccountId): void {
    this.browserStorage.setDefaultAccountId({ id });
  }
}

type DeleteCurrencyResult = { ok: true } | { ok: false; reason: string };
