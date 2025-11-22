import { Observable, Subject } from "rxjs";
import { SortAction } from "../sort";
import { ExpenseManager } from "./expenses";
import { generatePrefixedId } from "./idGeneration";
import {
  DraftPaymentAccount,
  ExpenseId,
  PaymentAccount,
  PaymentAccountId,
} from "./model";

interface Args {
  expenseManager: ExpenseManager;
}

export class PaymentAccountsManager {
  public change$: Observable<PaymentAccountChanges>;

  private accounts: Map<PaymentAccountId, PaymentAccount>;
  private changeSubject: Subject<PaymentAccountChanges>;
  private defaultAccountId: PaymentAccountId | undefined;
  private expensesPerAccount: Map<PaymentAccountId, ExpenseId[]>;

  private expenseManager: ExpenseManager;

  constructor({ expenseManager }: Args) {
    this.expenseManager = expenseManager;

    this.accounts = new Map<PaymentAccountId, PaymentAccount>();
    this.expensesPerAccount = new Map<PaymentAccountId, ExpenseId[]>();
    this.changeSubject = new Subject<PaymentAccountChanges>();
    this.change$ = this.changeSubject.asObservable();
    this.defaultAccountId = undefined;

    this.change$.subscribe((change) =>
      console.debug(`${PaymentAccountsManager.name}.change$:`, change)
    );

    this.expenseManager.change$.subscribe((change) => {
      switch (change.kind) {
        case "ExpenseAdded":
          return this.updateAccountToExpenseIndex();
        case "ExpenseUpdated":
          return this.updateAccountToExpenseIndex();
        case "ExpenseDeleted":
          return this.updateAccountToExpenseIndex();
        default:
          throw new Error(`PaymentAccountsManager: unsupported change: ${change}`);
      }
    });
  }

  public initialize({
    accounts,
    defaultAccountId,
  }: {
    accounts: PaymentAccount[];
    defaultAccountId: PaymentAccountId | undefined;
  }): void {
    console.debug(`PaymentAccountsManager.initialize::started`);
    console.debug(
      `PaymentAccountsManager.initialize::defaultAccountId`,
      defaultAccountId
    );
    for (const account of accounts) {
      const { id } = account;

      if (this.accounts.has(id)) {
        throw new Error(
          `PaymentAccountsManager.initialize::same PaymentAccountId found at least twice: ${id}`
        );
      }

      this.accounts.set(id, account);
    }

    if (defaultAccountId && this.accounts.has(defaultAccountId) === false) {
      throw new Error(
        `PaymentAccountsManager.initialize::no account ID matches the defaultAccountId='${defaultAccountId}'`
      );
    }

    this.updateAccountToExpenseIndex();

    this.defaultAccountId = defaultAccountId;

    this.changeSubject.next({ kind: "PaymentAccountManagerInitialized" });
  }

  public get({ id }: { id: PaymentAccountId }): PaymentAccount | undefined {
    return this.accounts.get(id);
  }

  public setDefault({ id }: { id: PaymentAccountId }): void {
    if (this.accounts.has(id) === false) {
      throw new Error(
        `PaymentAccountsManager.setDefault::'${id}' must match an existing Payment Account ID`
      );
    }

    this.defaultAccountId = id;

    this.changeSubject.next({ kind: "DefaultPaymentAccountSet", id });
  }

  public getDefault(): PaymentAccount | undefined {
    if (this.accounts.size === 0) {
      return undefined;
    }

    if (this.accounts.size === 1) {
      return [...this.accounts.values()][0];
    }

    if (this.defaultAccountId === undefined) {
      return undefined;
    }

    return this.accounts.get(this.defaultAccountId);
  }

  public getAll(): PaymentAccount[] {
    return [...this.accounts.values()].sort(sortPaymentAccountsByName);
  }

  public add({ draft }: { draft: DraftPaymentAccount }): void {
    const id = this.generatePaymentAccountId();
    const account: PaymentAccount = { id, ...draft };
    this.accounts.set(id, account);
    this.changeSubject.next({ kind: "PaymentAccountAdded", id });
  }

  public update({ account }: { account: PaymentAccount }): PaymentAccountUpdateResult {
    const { id } = account;

    if (this.accounts.has(id) === false) {
      return {
        ok: false,
        reason: `cannot update account because it does not exist, id=${id}`,
      };
    }

    if (account.isVisible === false && this.isAccountUsedByExpense(id)) {
      return {
        ok: false,
        reason: `cannot save account as hidden because it is used by at least one expense`,
      };
    }

    this.accounts.set(id, account);

    this.changeSubject.next({ kind: "PaymentAccountUpdated", id });
    return { ok: true };
  }

  public delete({ id }: { id: PaymentAccountId }): PaymentAccountDeleteResult {
    if (this.accounts.has(id) === false) {
      return {
        ok: false,
        reason: `cannot delete account because it does not exist, id=${id}`,
      };
    }

    if (this.isAccountUsedByExpense(id)) {
      return {
        ok: false,
        reason: `cannot delete account because it is used by at least one expense`,
      };
    }

    this.accounts.delete(id);

    this.changeSubject.next({ kind: "PaymentAccountDeleted", id });
    return { ok: true };
  }

  private generatePaymentAccountId(): PaymentAccountId {
    while (true) {
      const id = generatePrefixedId("pay");
      if (this.accounts.has(id) === false) {
        return id;
      }
    }
  }

  private updateAccountToExpenseIndex(): void {
    const expensesPerAccount = new Map<PaymentAccountId, ExpenseId[]>();
    for (const appExpense of this.expenseManager.getAll()) {
      const expense = appExpense.expense;
      const id: PaymentAccountId = expense.paid_with;
      const previous = expensesPerAccount.get(id);
      if (previous === undefined) {
        expensesPerAccount.set(id, [expense.id]);
      } else {
        expensesPerAccount.set(id, [...previous, expense.id]);
      }
    }
    this.expensesPerAccount = expensesPerAccount;
  }

  private isAccountUsedByExpense(id: PaymentAccountId): boolean {
    return this.expensesPerAccount.has(id);
  }
}

function sortPaymentAccountsByName(a: PaymentAccount, b: PaymentAccount): SortAction {
  return a.name <= b.name ? SortAction.KeepOrder : SortAction.SwapOrder;
}

export type PaymentAccountUpdateResult = { ok: true } | { ok: false; reason: string };
export type PaymentAccountDeleteResult = { ok: true } | { ok: false; reason: string };

export type PaymentAccountChanges =
  | { kind: "PaymentAccountManagerInitialized" }
  | { kind: "PaymentAccountAdded"; id: PaymentAccountId }
  | { kind: "PaymentAccountUpdated"; id: PaymentAccountId }
  | { kind: "PaymentAccountDeleted"; id: PaymentAccountId }
  | { kind: "DefaultPaymentAccountSet"; id: PaymentAccountId };
