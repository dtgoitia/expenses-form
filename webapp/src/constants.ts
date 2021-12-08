import LoadEnvVar from "./environment";

export const API_BASE_URL = LoadEnvVar.asUrl("REACT_APP_API_BASE_URL");
export const API_ADMIN_SECRET = LoadEnvVar.asUrl("REACT_APP_API_ADMIN_SECRET");

export enum ApiEndpoints {
  OAUTH_TOKEN = "/auth/token/",
  OAUTH_VALIDATE_TOKEN = "/api/v1/test/",
  USERS_TO_SUSPEND = "/api/v1/users-to-suspend/",
}
