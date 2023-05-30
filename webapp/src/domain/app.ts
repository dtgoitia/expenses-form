import { BrowserStorage } from "./browserstorage";
import { CurrencyManager } from "./currencies";
import { ExpenseManager } from "./expenses";
import { PaymentAccountsManager } from "./paymentAccounts";

interface Props {
  expenseManager: ExpenseManager;
  paymentAccountsManager: PaymentAccountsManager;
  browserStorage: BrowserStorage;
  currencyManager: CurrencyManager;
}

export class App {
  public expenseManager: ExpenseManager;
  public paymentAccountsManager: PaymentAccountsManager;

  private browserStorage: BrowserStorage;
  private currencyManager: CurrencyManager;

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
  }

  public initialize(): void {
    console.debug(`App.initialize::started`);

    const appExpenses = this.browserStorage.readExpenses();
    this.expenseManager.initialize({ appExpenses });

    const currencies = this.browserStorage.readCurrencies();
    this.currencyManager.initialize({ currencies });

    const accounts = this.browserStorage.readPaymentAccounts();
    this.paymentAccountsManager.initialize({ accounts });
    console.debug(`App.initialize::completed`);
  }
}
