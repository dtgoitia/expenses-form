import { Storage } from "../localStorage";
import { BrowserStorage } from "./browserstorage";
import { ExpenseManager } from "./expenses";

export function initialize() {
  console.debug(`init.ts::initialize()`);
  const expenseManager = new ExpenseManager();
  const browserStorage = new BrowserStorage({
    expenseManager,
    client: new Storage(),
  });

  const expenses = browserStorage.readExpenses();
  expenseManager.initialize({ expenses });

  return { expenseManager, browserStorage };
}