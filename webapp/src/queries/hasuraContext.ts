import storage from "../localStorage";

function getHasuraContext() {
  const token = storage.hasuraApiToken.read();
  if (token === null) {
    // TODO: find a way of centralizing errors/warnings and nicely
    // showing them in the UI
    console.warn(`Hasura API token must be added to Settings`);
  }

  const context = {
    headers: { "x-hasura-admin-secret": token },
  };

  return context;
}

export default getHasuraContext;
