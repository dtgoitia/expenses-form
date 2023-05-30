import { CurrencyCode } from "./model";
import { Observable, Subject } from "rxjs";

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
}

export type CurrencyChanges =
  | { kind: "CurrencyManagerInitialized" }
  | { kind: "CurrencyAdded"; currency: CurrencyCode };
