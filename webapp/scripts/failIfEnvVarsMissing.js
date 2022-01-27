const ENV_VAR_WHITELIST = require("../src/environment-variable-whitelist.js").default;

function exitWithError(message) {
  console.error(message);
  process.exit(1);
}

function assertEnvVarsAreSet(whitelist) {
  whitelist.forEach(name => {
    const value = process.env[name];
    if (value === undefined) {
      exitWithError(`Environment variable ${name} is missing`);
    }
  });

  console.log("Nice, all whitelisted environment variables are present :)");
}

assertEnvVarsAreSet(ENV_VAR_WHITELIST);
