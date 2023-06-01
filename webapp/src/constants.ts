import { Shortcut } from "./domain/model";
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
