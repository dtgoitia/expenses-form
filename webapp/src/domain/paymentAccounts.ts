import { SortAction } from "../sort";
import { generatePrefixedId } from "./idGeneration";
import { DraftPaymentAccount, PaymentAccount, PaymentAccountId } from "./model";
import { Observable, Subject } from "rxjs";

export class PaymentAccountsManager {
  public change$: Observable<PaymentAccountChanges>;

  private accounts: Map<PaymentAccountId, PaymentAccount>;
  private changeSubject: Subject<PaymentAccountChanges>;
  private defaultAccountId: PaymentAccountId | undefined;

  constructor() {
    this.accounts = new Map<PaymentAccountId, PaymentAccount>();
    this.changeSubject = new Subject<PaymentAccountChanges>();
    this.change$ = this.changeSubject.asObservable();
    this.defaultAccountId = undefined;

    this.change$.subscribe((change) =>
      console.debug(`${PaymentAccountsManager.name}.change$:`, change)
    );
  }

  public initialize({
    accounts,
    defaultAccountId,
  }: {
    accounts: PaymentAccount[];
    defaultAccountId: PaymentAccountId | undefined;
  }): void {
    console.debug(`${PaymentAccountsManager.name}.${this.initialize.name}::started`);
    console.debug(
      `${PaymentAccountsManager.name}.${this.initialize.name}::defaultAccountId`,
      defaultAccountId
    );
    for (const account of accounts) {
      const { id } = account;

      if (this.accounts.has(id)) {
        this.error(this.initialize, `same PaymentAccountId found at least twice: ${id}`);
      }

      this.accounts.set(id, account);
    }

    if (defaultAccountId && this.accounts.has(defaultAccountId) === false) {
      this.error(
        this.initialize,
        `no account ID matches the defaultAccountId='${defaultAccountId}'`
      );
    }

    this.defaultAccountId = defaultAccountId;

    this.changeSubject.next({ kind: "PaymentAccountManagerInitialized" });
  }

  public setDefault({ id }: { id: PaymentAccountId }): void {
    if (this.accounts.has(id) === false) {
      this.error(this.setDefault, `'${id}' must match an existing Payment Account ID`);
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

  public update({ account }: { account: PaymentAccount }): void {
    const { id } = account;

    if (this.accounts.has(id) === false) {
      this.error(
        this.update,
        `Cannot update an account because it does not exist, id=${id}`
      );
    }

    this.accounts.set(id, account);

    this.changeSubject.next({ kind: "PaymentAccountUpdated", id });
  }

  public delete({ id }: { id: PaymentAccountId }): void {
    if (this.accounts.has(id) === false) {
      this.error(
        this.delete,
        `Cannot delete an account because it does not exist, id=${id}`
      );
    }

    this.accounts.delete(id);

    this.changeSubject.next({ kind: "PaymentAccountUpdated", id });
  }

  private error(caller: Function, msg: string): never {
    throw new Error(`${PaymentAccountsManager.name}.${caller.name}::${msg}`);
  }

  private generatePaymentAccountId(): PaymentAccountId {
    while (true) {
      const id = generatePrefixedId("pay");
      if (this.accounts.has(id) === false) {
        return id;
      }
    }
  }
}

function sortPaymentAccountsByName(a: PaymentAccount, b: PaymentAccount): SortAction {
  return a.name <= b.name ? SortAction.KeepOrder : SortAction.SwapOrder;
}

export type PaymentAccountChanges =
  | { kind: "PaymentAccountManagerInitialized" }
  | { kind: "PaymentAccountAdded"; id: PaymentAccountId }
  | { kind: "PaymentAccountUpdated"; id: PaymentAccountId }
  | { kind: "PaymentAccountDeleted"; id: PaymentAccountId }
  | { kind: "DefaultPaymentAccountSet"; id: PaymentAccountId };
