export const EXPENSE_ID = ":expenseId";

enum Paths {
  root = "/",
  expenseEditor = `/expenses/${EXPENSE_ID}`,
  expenseSplitsEditor = `/expenses/${EXPENSE_ID}/splits`,
  paymentAccounts = "/payment-accounts",
  settings = "/settings",
  notFound = "/*",
}

export default Paths;
