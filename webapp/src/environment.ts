import { default as envVarWhitelistModule } from "./environment-variable-whitelist";

// @ts-ignore:next-line
const ENV_VAR_WHITELIST = envVarWhitelistModule.default as Set<string>;
const REACT_CUSTOM_ENVVAR_DOCS =
  "https://create-react-app.dev/docs/adding-custom-environment-variables/";

function assertEnvVarsAreSet(whitelist: Set<string>) {
  whitelist.forEach((name: string) => {
    const value = process.env[name];
    if (value === undefined) {
      throw new Error(`Environment variable ${name} is missing`);
    }
  });
}

function assertIsWhitelisted(name: string) {
  const isWhitelisted = ENV_VAR_WHITELIST.has(name);
  if (!isWhitelisted) {
    throw new Error(`Environment variable ${name} must be whitelisted`);
  }
}

function readEnvironmentVariable(name: string): string {
  assertIsWhitelisted(name);

  const envvar = process.env[name];
  if (!envvar) {
    throw new Error(
      [
        `Environment variable ${name} must be set.`,
        `For more details, check ${REACT_CUSTOM_ENVVAR_DOCS}`,
      ].join(" "),
    );
  }

  return envvar;
}

class LoadEnvVar {
  public static asUrl(name: string): string {
    const value = readEnvironmentVariable(name);
    const withoutTrailingSlash = value.replace(/\/$/, "");
    return withoutTrailingSlash;
  }
}

// Must be executed on module load
assertEnvVarsAreSet(ENV_VAR_WHITELIST);
export default LoadEnvVar;
