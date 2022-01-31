import {
  Account,
  AccountName,
  Currency,
  CurrencyCode,
  Shortcut,
} from "./domain";
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

export const DEFAULT_PAYMENT_METHOD: AccountName = "amex";

export const DEFAULT_CURRENCY: CurrencyCode = "GBP";

export const PAYMENT_ACCOUNTS: Account[] = [
  {
    id: 1,
    name: "monzo",
  },
  {
    id: 2,
    name: "revolut business",
  },
  {
    id: 3,
    name: "amex",
  },
  {
    id: 4,
    name: "evo",
  },
  {
    id: 5,
    name: "evo bizum",
  },
  {
    id: 6,
    name: "revolut personal GBP",
  },
  {
    id: 7,
    name: "revolut personal EUR",
  },
  {
    id: 8,
    name: "cash EUR",
  },
  {
    id: 9,
    name: "cash GBP",
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
  "2201lanzarote",
  "groceries",
  "eatout",
  "social",
  "ocio",
  "drinks",
  "invite",
  "transport",
  "health",
  "present",
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
export const API_BASE_URL = LoadEnvVar.asUrl("REACT_APP_API_BASE_URL");
export const API_ADMIN_SECRET = LoadEnvVar.asUrl("REACT_APP_API_ADMIN_SECRET");
export const MOCK_APIS = LoadEnvVar.asBoolean("REACT_APP_MOCK_APIS");
export const DEVELOPMENT_MODE = process.env.NODE_ENV === "development";

export enum ApiEndpoints {
  OAUTH_TOKEN = "/auth/token/",
  OAUTH_VALIDATE_TOKEN = "/api/v1/test/",
  USERS_TO_SUSPEND = "/api/v1/users-to-suspend/",
}
