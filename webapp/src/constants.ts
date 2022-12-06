import {
  Account,
  AccountAlias,
  Currency,
  CurrencyCode,
  Shortcut,
} from "./domain/model";
import LoadEnvVar from "./environment";

export const SHORTCUTS: Shortcut[] = [
  {
    id: 1,
    buttonName: "Sainsbury's",
    main: "Groceries",
    people: ["AngelaPerez"],
    seller: "Sainsburys",
    tags: ["groceries"],
  },
  {
    id: 2,
    buttonName: "Morrisons's",
    main: "Groceries",
    people: ["AngelaPerez"],
    seller: "Morrisons",
    tags: ["groceries"],
  },
  {
    id: 3,
    buttonName: "Lidl",
    main: "Groceries",
    people: ["AngelaPerez"],
    seller: "Lidl",
    tags: ["groceries"],
  },
  {
    id: 4,
    buttonName: "Tesco",
    main: "Groceries",
    people: ["AngelaPerez"],
    seller: "Tesco",
    tags: ["groceries"],
  },
  {
    id: 5,
    buttonName: "TfL",
    main: "Transport",
    people: [],
    seller: "TfL",
    tags: ["transport"],
  },
];

export const DEFAULT_PAYMENT_METHOD: AccountAlias = "monzo";

export const DEFAULT_CURRENCY: CurrencyCode = "GBP";

export const PAYMENT_ACCOUNTS: Account[] = [
  {
    id: 1,
    alias: "monzo",
    pending: true,
  },
  {
    id: 2,
    alias: "revolut business",
    pending: true,
  },
  {
    id: 3,
    alias: "amex",
    pending: true,
  },
  {
    id: 4,
    alias: "evo",
    pending: false,
  },
  {
    id: 5,
    alias: "evo bizum",
    pending: false,
  },
  {
    id: 6,
    alias: "revolut personal GBP",
    pending: false,
  },
  {
    id: 7,
    alias: "revolut personal EUR",
    pending: false,
  },
  {
    id: 8,
    alias: "cash EUR",
    pending: false,
  },
  {
    id: 9,
    alias: "cash GBP",
    pending: false,
  },
  {
    id: 10,
    alias: "paid by Angela GBP",
    pending: false,
  },
  {
    id: 11,
    alias: "paid by Angela EUR",
    pending: false,
  },
  {
    id: 12,
    alias: "paid by somebody else",
    pending: false,
  },
  {
    id: 13,
    alias: "chase",
    pending: true,
  },
];

export const CURRENCIES: Currency[] = [
  {
    code: "GBP",
  },
  {
    code: "EUR",
  },
  {
    code: "USD",
  },
];

export const TAGS = [
  "expenses",
  "groceries",
  "eatout",
  "social",
  "ocio",
  "drinks",
  "invite",
  "transport",
  "health",
  "present",
  "home",
];

export const DEFAULT_PEOPLE = ["AngelaPerez"];
export const SELLERS = [
  "Amazon",
  "AWS",
  "GiffGaff",
  "Lidl",
  "Morrisons",
  "Sainsbury",
  "Tesco",
  "TfL",
];

export const BASE_URL = "expenses-form"; // must match "homepage" field in package.json
export const API_BASE_URL = LoadEnvVar.asUrl("REACT_APP_API_BASE_URL");
export const SPLITWISE_API_BASE_URL = LoadEnvVar.asUrl(
  "REACT_APP_SPLITWISE_API_BASE_URL"
);
export const MOCK_APIS = LoadEnvVar.asBoolean("REACT_APP_MOCK_APIS");
export const DEVELOPMENT_MODE = process.env.NODE_ENV === "development";

export enum ApiEndpoints {
  OAUTH_TOKEN = "/auth/token/",
  OAUTH_VALIDATE_TOKEN = "/api/v1/test/",
  USERS_TO_SUSPEND = "/api/v1/users-to-suspend/",
}
