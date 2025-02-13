enum ValueType {
  string = "string",
  number = "number",
  object = "object",
}

class StoredItem<T> {
  private key: string;
  private type: string;
  constructor(key: string, type: ValueType) {
    this.key = key;
    this.type = type;
  }

  public exists(): boolean {
    const rawValue = window.localStorage.getItem(this.key);
    return !!rawValue;
  }

  public read(): T | undefined {
    const rawValue = window.localStorage.getItem(this.key);

    if (rawValue === null) {
      return undefined;
    }

    switch (this.type) {
      case ValueType.string:
        return rawValue as unknown as T;

      case ValueType.number:
        return Number(rawValue) as unknown as T;

      case ValueType.object:
        return JSON.parse(rawValue);

      default:
        throw new Error(`Type ${this.type} is not supported yet`);
    }
  }

  public set(value: T) {
    this.assertType(value);

    let serializedValue = "";

    switch (this.type) {
      case ValueType.string:
        serializedValue = value as unknown as string;
        break;

      case ValueType.number:
        serializedValue = (value as unknown as number).toString();
        break;

      case ValueType.object:
        serializedValue = JSON.stringify(value);
        break;

      default:
        throw new Error(`Type ${this.type} is not supported yet`);
    }

    window.localStorage.setItem(this.key, serializedValue);
  }

  public delete() {
    if (!this.exists()) return;
    window.localStorage.removeItem(this.key);
  }

  private assertType(value: T): void {
    const actualType = typeof value;
    const expectedType = this.type;
    if (actualType !== expectedType) {
      throw new Error(`Expected ${expectedType}, got ${actualType} instead`);
    }
  }
}

export class Storage {
  splitwiseApiToken: StoredItem<string | undefined>;
  tripTags: StoredItem<string[] | undefined>;
  people: StoredItem<object[] | undefined>;
  expenses: StoredItem<object | undefined>;
  paymentAccounts: StoredItem<object[] | undefined>;
  defaultPaymentAccountId: StoredItem<string | undefined>;
  firestoreConfig: StoredItem<object | undefined>;
  currencies: StoredItem<string | undefined>;

  constructor() {
    this.splitwiseApiToken = new StoredItem("exp_splitwise_api_token", ValueType.string);
    this.tripTags = new StoredItem("exp__trip_tags", ValueType.object);
    this.people = new StoredItem("exp__people", ValueType.object);
    this.expenses = new StoredItem("exp__expenses", ValueType.object);
    this.paymentAccounts = new StoredItem("exp__payment_accounts", ValueType.object);
    this.defaultPaymentAccountId = new StoredItem(
      "exp__default_payment_account_id",
      ValueType.string
    );
    this.firestoreConfig = new StoredItem("exp__firestore_config", ValueType.object);
    this.currencies = new StoredItem("exp__currencies", ValueType.string);
  }
}

const storage = new Storage();

export default storage;
