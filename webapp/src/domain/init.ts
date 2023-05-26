import { Storage } from "../localStorage";
import { BrowserStorage } from "./browserstorage";
import { ExpenseManager } from "./expenses";
import { PaymentAccountsManager } from "./paymentAccounts";

export function initialize() {
  console.debug(`init.ts::initialize()`);
  const expenseManager = new ExpenseManager();
  const paymentAccountsManager = new PaymentAccountsManager();
  const browserStorage = new BrowserStorage({
    expenseManager,
    paymentAccountsManager,
    client: new Storage(),
  });

  const appExpenses = browserStorage.readExpenses();
  expenseManager.initialize({ appExpenses });

  const accounts = browserStorage.readPaymentAccounts();
  paymentAccountsManager.initialize({ accounts });

  return { expenseManager, browserStorage, paymentAccountsManager };
}
