import { BrowserStorage } from "./browserstorage";
import { PaymentAccountId } from "./model";
import { Observable, Subject } from "rxjs";

interface Props {
  browserStorage: BrowserStorage;
}

export class Settings {
  public change$: Observable<SettingsChange>;
  public defaultPaymentAccountId: PaymentAccountId | undefined;

  private browserStorage: BrowserStorage;
  private changeSubject: Subject<SettingsChange>;

  constructor({ browserStorage }: Props) {
    this.browserStorage = browserStorage;

    this.changeSubject = new Subject<SettingsChange>();
    this.change$ = this.changeSubject.asObservable();

    this.change$.subscribe((change) => console.log(`${Settings.name}.change$:`, change));
  }

  public initialize(): void {
    this.defaultPaymentAccountId = this.browserStorage.readDefaultAccountId();
    console.debug(
      `${Settings.name}.defaultPaymentAccountId:`,
      this.defaultPaymentAccountId
    );

    this.changeSubject.next({ kind: "SettingsInitialized" });
  }

  public setDefaultPaymentAccountId(id: PaymentAccountId): void {
    this.defaultPaymentAccountId = id;
    this.changeSubject.next({ kind: "SettingsUpdated", key: "defaultAccountId" });
  }
}

type SettingsChange =
  | { kind: "SettingsInitialized" }
  | { kind: "SettingsUpdated"; key: string };
