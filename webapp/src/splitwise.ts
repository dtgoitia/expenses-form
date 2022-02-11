import { SPLITWISE_API_BASE_URL } from "./constants";
import storage from "./localStorage";
import axios, { AxiosInstance } from "axios";

type NumberString = string;
type DateString = string;
type EmailAddress = string;
interface CreateExpensePayload {
  // https://dev.splitwise.com/#tag/users/paths/~1get_user~1{id}/get
  cost: NumberString;
  description: string;
  date: DateString; // "Thu+Feb+10+2022+09:00:51+GMT+0000+(Greenwich+Mean+Time)"
  currency_code: string;
  group_id: 0;
  users__0__email: EmailAddress;
  users__0__paid_share: NumberString;
  users__0__owed_share: NumberString;
  users__1__email: EmailAddress;
  users__1__paid_share: NumberString;
  users__1__owed_share: NumberString;
}

export interface SplitwiseExpense {
  cost: number;
  description: string;
  date: Date;
  currency: "GBP" | "EUR";
  group_id: 0; // always zero until group support is added to the client
  users__0__email: EmailAddress;
  users__0__paid_share: number;
  users__0__owed_share: number;
  users__1__email: EmailAddress;
  users__1__paid_share: number;
  users__1__owed_share: number;
}

enum Endpoint {
  createExpense = "create_expense",
}

function numberToString(n: number): NumberString {
  return n.toFixed(2).toString();
}

function dateToString(d: Date): DateString {
  return d.toString().replaceAll(" ", "+");
}

class SplitwiseClient {
  private client: AxiosInstance;
  constructor(baseUrl: string, token: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  public async createExpense(expense: SplitwiseExpense) {
    // TODO: enforce validation on amount, it can only have 2 decimals if you are
    // adding the expense to Spitwise
    const payload: CreateExpensePayload = {
      cost: numberToString(expense.cost),
      description: expense.description,
      date: dateToString(expense.date),
      currency_code: expense.currency,
      group_id: 0,
      users__0__email: expense.users__0__email,
      users__0__paid_share: numberToString(expense.users__0__paid_share),
      users__0__owed_share: numberToString(expense.users__0__owed_share),
      users__1__email: expense.users__1__email,
      users__1__paid_share: numberToString(expense.users__1__paid_share),
      users__1__owed_share: numberToString(expense.users__1__owed_share),
    };
    return this.post(Endpoint.createExpense, payload);
  }

  private async get(path: string) {
    return this.client.get(path);
  }

  private async post(path: string, payload: object) {
    return this.client.post(path, payload);
  }
}

function getClient(): SplitwiseClient | null {
  const token = storage.splitwiseApiToken.read();
  if (token === undefined) {
    // TODO: find a way of centralizing errors/warnings and nicely
    // showing them in the UI
    console.warn(`Splitwise API token must be added to Settings`);
    return null;
  }

  return new SplitwiseClient(SPLITWISE_API_BASE_URL, token);
}

export const client = getClient();

export function splitExpense(amount: number): [number, number] {
  let myPart: number;
  let otherPart: number;

  const cents = amount * 100;

  const hasExtraCent = cents % 2 === 1;
  const iPayExtraCent = Math.random().toFixed() === "0";

  myPart = Number((amount / 2).toFixed(2));
  if (hasExtraCent && iPayExtraCent) {
    myPart += 1;
  }
  otherPart = amount - myPart;

  return [myPart, otherPart];
}
