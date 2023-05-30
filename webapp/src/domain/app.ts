import { BrowserStorage } from "./browserstorage";
import { ExpenseManager } from "./expenses";
import { PaymentAccountsManager } from "./paymentAccounts";

interface Props {
  expenseManager: ExpenseManager;
  paymentAccountsManager: PaymentAccountsManager;
  browserStorage: BrowserStorage;
}

export class App {
  public expenseManager: ExpenseManager;
  public paymentAccountsManager: PaymentAccountsManager;

  private browserStorage: BrowserStorage;

  constructor({ expenseManager, paymentAccountsManager, browserStorage }: Props) {
    this.expenseManager = expenseManager;
    this.paymentAccountsManager = paymentAccountsManager;
    this.browserStorage = browserStorage;
  }

  public initialize(): void {
    console.debug(`App.initialize::started`);

    const appExpenses = this.browserStorage.readExpenses();
    this.expenseManager.initialize({ appExpenses });

    const accounts = this.browserStorage.readPaymentAccounts();
    this.paymentAccountsManager.initialize({ accounts });
    console.debug(`App.initialize::completed`);
  }
}
