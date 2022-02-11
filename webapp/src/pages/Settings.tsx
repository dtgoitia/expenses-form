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
  const [hasuraToken, setHasuraToken] = useState<string | undefined>(undefined);
  const [splitwiseToken, setSplitwiseToken] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (storage.hasuraApiToken.exists()) {
      setHasuraToken(storage.hasuraApiToken.read());
    }
    if (storage.splitwiseApiToken.exists()) {
      setSplitwiseToken(storage.splitwiseApiToken.read());
    }
  }, []);

  function handleHasuraApiTokenChange(
    _: SyntheticEvent,
    { value }: InputOnChangeData
  ) {
    if (value === undefined || value === null || value === "") {
      setHasuraToken(undefined);
      storage.hasuraApiToken.delete();
      return;
    }

    setHasuraToken(value);
    storage.hasuraApiToken.set(value);
  }

  function handleSplitwiseApiTokenChange(
    _: SyntheticEvent,
    { value }: InputOnChangeData
  ) {
    if (value === undefined || value === null || value === "") {
      setSplitwiseToken(undefined);
      storage.splitwiseApiToken.delete();
      return;
    }

    setSplitwiseToken(value);
    storage.splitwiseApiToken.set(value);
  }

  return (
    <CenteredPage>
      <h1>Settings</h1>
      <Form.Input
        label="Hasura API token"
        placeholder="Hasura API token"
        name={FieldName.hasuraApiToken}
        value={hasuraToken}
        fluid
        onChange={handleHasuraApiTokenChange}
      />
      <Form.Input
        label="Splitwise API token"
        placeholder="Splitwise API token"
        name={FieldName.splitwiseApiToken}
        value={splitwiseToken}
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
