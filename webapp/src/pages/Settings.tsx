import CenteredPage from "../components/CenteredPage";
import storage from "../localStorage";
import { SyntheticEvent, useEffect, useState } from "react";
import { Form, InputOnChangeData } from "semantic-ui-react";

enum FieldName {
  hasuraApiToken = "hasura-api-token",
}

function SettingsPage() {
  const [hasuraApiToken, setHasuraApiToken] = useState<string | null>(null);

  useEffect(() => {
    if (storage.hasuraApiToken.exists()) {
      setHasuraApiToken(storage.hasuraApiToken.read());
    }
  }, []);

  function handleHasuraApiTokenChange(
    _: SyntheticEvent,
    { value }: InputOnChangeData
  ) {
    if (value === undefined || value === null || value === "") {
      setHasuraApiToken(null);
      storage.hasuraApiToken.delete();
      return;
    }

    setHasuraApiToken(value);
    storage.hasuraApiToken.set(value);
  }

  return (
    <CenteredPage>
      <h1>Settings</h1>
      <Form.Input
        label="Hasura API token"
        placeholder="Hasura API token"
        name={FieldName.hasuraApiToken}
        value={hasuraApiToken}
        fluid
        onChange={handleHasuraApiTokenChange}
      />
    </CenteredPage>
  );
}

export default SettingsPage;
