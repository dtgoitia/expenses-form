import { assertNever } from "../exhaustive-match";
import { BrowserStorage } from "./browserstorage";
import { CurrencyManager } from "./currencies";
import { ExpenseManager } from "./expenses";
import { PaymentAccountId } from "./model";
import {
  PaymentAccountChanges as PaymentAccountChange,
  PaymentAccountsManager,
} from "./paymentAccounts";
import { PeopleManager } from "./people";

interface Props {
  expenseManager: ExpenseManager;
  paymentAccountsManager: PaymentAccountsManager;
  browserStorage: BrowserStorage;
  currencyManager: CurrencyManager;
  peopleManager: PeopleManager;
}

export class App {
  public expenseManager: ExpenseManager;
  public paymentAccountsManager: PaymentAccountsManager;
  public currencyManager: CurrencyManager;
  public peopleManager: PeopleManager;
  public initialized: boolean = false;

  private browserStorage: BrowserStorage;

  constructor({
    expenseManager,
    paymentAccountsManager,
    browserStorage,
    currencyManager,
    peopleManager,
  }: Props) {
    this.expenseManager = expenseManager;
    this.paymentAccountsManager = paymentAccountsManager;
    this.browserStorage = browserStorage;
    this.currencyManager = currencyManager;
    this.peopleManager = peopleManager;

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

      this.initialized = true;
    }
    console.debug(`App.initialize::completed`);
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
