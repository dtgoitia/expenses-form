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

  public read(): T {
    if (!this.exists) {
      throw new Error(`Could not find ${this.key} in local storage`);
    }

    const rawValue = window.localStorage.getItem(this.key) as string;

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
  hasuraApiToken: StoredItem<string | undefined>;
  splitwiseApiToken: StoredItem<string | undefined>;
  tripTags: StoredItem<string[] | undefined>;
  people: StoredItem<string[] | undefined>;
  defaultPaymentAccount: StoredItem<string | undefined>;
  expenses: StoredItem<object | undefined>;
  firestoreConfig: StoredItem<object | undefined>;

  constructor() {
    this.hasuraApiToken = new StoredItem("hasura_api_token", ValueType.string);
    this.splitwiseApiToken = new StoredItem(
      "splitwise_api_token",
      ValueType.string
    );
    this.tripTags = new StoredItem("trip_tags", ValueType.object);
    this.people = new StoredItem("people", ValueType.object);
    this.defaultPaymentAccount = new StoredItem(
      "defaultPaymentAccount",
      ValueType.string
    );
    this.expenses = new StoredItem("exp__expenses", ValueType.object);
    this.firestoreConfig = new StoredItem(
      "exp__firestore_config",
      ValueType.object
    );
  }
}

const storage = new Storage();

export default storage;
