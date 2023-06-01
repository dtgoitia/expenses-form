import { assertNever } from "../exhaustive-match";
import { BrowserStorage } from "./browserstorage";
import { CurrencyManager } from "./currencies";
import { ExpenseManager } from "./expenses";
import { PaymentAccountId } from "./model";
import {
  PaymentAccountChanges as PaymentAccountChange,
  PaymentAccountsManager,
} from "./paymentAccounts";

interface Props {
  expenseManager: ExpenseManager;
  paymentAccountsManager: PaymentAccountsManager;
  browserStorage: BrowserStorage;
  currencyManager: CurrencyManager;
}

export class App {
  public expenseManager: ExpenseManager;
  public paymentAccountsManager: PaymentAccountsManager;
  public currencyManager: CurrencyManager;

  private browserStorage: BrowserStorage;

  constructor({
    expenseManager,
    paymentAccountsManager,
    browserStorage,
    currencyManager,
  }: Props) {
    this.expenseManager = expenseManager;
    this.paymentAccountsManager = paymentAccountsManager;
    this.browserStorage = browserStorage;
    this.currencyManager = currencyManager;

    this.paymentAccountsManager.change$.subscribe((change) =>
      this.handlePaymentAccountChange(change)
    );
  }

  public initialize(): void {
    console.debug(`App.initialize::started`);

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
