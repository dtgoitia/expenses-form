import LoadEnvVar from "./environment";

export const PREDEFINED_OPTIONS_DATA = [
  {
    name: "Sainsbury's @AngelaPerez",
    description: "Groceries with @AngelaPerez at @Sainsburys #groceries",
  },
  {
    name: "Morrisons's @AngelaPerez",
    description: "Groceries with @AngelaPerez at @Morrinsons #groceries",
  },
  {
    name: "Lidl @AngelaPerez",
    description: "Groceries with @AngelaPerez at @Lidl #groceries",
  },
  {
    name: "Tesco @AngelaPerez",
    description: "Groceries with @AngelaPerez at @Tesco #groceries",
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
