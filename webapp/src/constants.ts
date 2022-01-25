import { Account, AccountName, Currency, CurrencyCode } from "./domain";
import LoadEnvVar from "./environment";

export const PREDEFINED_OPTIONS_DATA = [
  {
    name: "Sainsbury's",
    description: "Groceries with @AngelaPerez at @Sainsburys #groceries",
  },
  {
    name: "Morrisons's",
    description: "Groceries with @AngelaPerez at @Morrinsons #groceries",
  },
  {
    name: "Lidl",
    description: "Groceries with @AngelaPerez at @Lidl #groceries",
  },
  {
    name: "Tesco",
    description: "Groceries with @AngelaPerez at @Tesco #groceries",
  },
  {
    name: "TfL",
    description: "Transport at @TfL #transport",
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

export enum ApiEndpoints {
  OAUTH_TOKEN = "/auth/token/",
  OAUTH_VALIDATE_TOKEN = "/api/v1/test/",
  USERS_TO_SUSPEND = "/api/v1/users-to-suspend/",
}
