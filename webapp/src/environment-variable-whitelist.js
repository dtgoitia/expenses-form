// Problem: `react-scripts` do not support checking if the environment variables needed
// by the app are set in the environment on build time.
//
// Solution: this whitelist enforces a common reference between runtime and build time,
// to allow us to assert via script that at least every environment variable needed by
// the app on runtime is present on build time.
export const ENV_VAR_WHITELIST = new Set([
  "REACT_APP_SPLITWISE_API_BASE_URL",
  "REACT_APP_MOCK_APIS",
]);

// export default { envVarWhitelistModule: ENV_VAR_WHITELIST };
