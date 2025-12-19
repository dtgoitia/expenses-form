import { Observable, Subject } from "rxjs";
import { CurrencyCode } from "./model";

export class CurrencyManager {
  public change$: Observable<CurrencyChanges>;

  private currencies: Set<CurrencyCode>;
  private changeSubject: Subject<CurrencyChanges>;

  constructor() {
    this.currencies = new Set<CurrencyCode>();
    this.changeSubject = new Subject<CurrencyChanges>();
    this.change$ = this.changeSubject.asObservable();
  }

  public initialize({ currencies }: { currencies: CurrencyCode[] }): void {
    for (const currency of currencies) {
      if ([undefined, null, ""].includes(currency)) {
        continue;
      }
      this.currencies.add(currency);
    }

    this.changeSubject.next({ kind: "CurrencyManagerInitialized" });
  }

  public getAll(): Set<CurrencyCode> {
    return new Set([...this.currencies.values()]);
  }

  public add(currency: CurrencyCode): AddCurrencyResult {
    if (this.currencies.has(currency)) {
      return { ok: false, reason: `currency ${currency} already exists` };
    }

    this.currencies.add(currency);

    this.changeSubject.next({ kind: "CurrencyAdded", currency });
    return { ok: true };
  }

  /* Internal API: use App.deleteCurrencySafe instead */
  public deleteUnsafe(currency: CurrencyCode): DeleteCurrencyResult {
    const success = this.currencies.delete(currency);
    if (success === false) {
      return {
        ok: false,
        reason: `currency ${currency} was not deleted because it did not exist`,
      };
    }

    this.changeSubject.next({ kind: "CurrencyDeleted", currency });
    return { ok: true };
  }
}

export type AddCurrencyResult = { ok: true } | { ok: false; reason: string };

export type DeleteCurrencyResult = { ok: true } | { ok: false; reason: string };

export type CurrencyChanges =
  | { kind: "CurrencyManagerInitialized" }
  | { kind: "CurrencyAdded"; currency: CurrencyCode }
  | { kind: "CurrencyDeleted"; currency: CurrencyCode };
