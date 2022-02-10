import CenteredPage from "../components/CenteredPage";
import storage from "../localStorage";
import Paths from "../routes";
import { SyntheticEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Icon, InputOnChangeData } from "semantic-ui-react";

enum FieldName {
  hasuraApiToken = "hasura-api-token",
  splitwiseApiToken = "splitwise-api-token",
}

function SettingsPage() {
  const [hasuraApiToken, setHasuraApiToken] = useState<string | null>(null);
  const [splitwiseApiToken, setSplitwiseApiToken] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (storage.hasuraApiToken.exists()) {
      setHasuraApiToken(storage.hasuraApiToken.read());
    }
    if (storage.splitwiseApiToken.exists()) {
      setSplitwiseApiToken(storage.splitwiseApiToken.read());
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

  function handleSplitwiseApiTokenChange(
    _: SyntheticEvent,
    { value }: InputOnChangeData
  ) {
    if (value === undefined || value === null || value === "") {
      setSplitwiseApiToken(null);
      storage.splitwiseApiToken.delete();
      return;
    }

    setSplitwiseApiToken(value);
    storage.splitwiseApiToken.set(value);
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
      <Form.Input
        label="Splitwise API token"
        placeholder="Splitwise API token"
        name={FieldName.splitwiseApiToken}
        value={splitwiseApiToken}
        fluid
        onChange={handleSplitwiseApiTokenChange}
      />
      <Link to={Paths.root}>
        <Button>
          <Icon name="close"></Icon>
          Close
        </Button>
      </Link>
    </CenteredPage>
  );
}

export default SettingsPage;
