import CenteredPage from "../components/CenteredPage";
import storage from "../localStorage";
import Paths from "../routes";
import { SyntheticEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Icon, InputOnChangeData } from "semantic-ui-react";

function tagsToInputField(tags: string[]): string {
  return tags.join(",");
}

function inputFieldToTags(inputValue: string): string[] {
  const quotedTags = inputValue
    .split(",")
    .filter((tag) => tag !== "") // because  value="foo,," --> ["foo","",""]
    .map((tag) => `"${tag}"`)
    .join(",");
  const tags = JSON.parse(`[${quotedTags}]`);
  return tags;
}

function SettingsPage() {
  const [hasuraToken, setHasuraToken] = useState<string | undefined>(undefined);
  const [splitwiseToken, setSplitwiseToken] = useState<string | undefined>(
    undefined
  );
  const [tripTags, setTripTags] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (storage.hasuraApiToken.exists()) {
      setHasuraToken(storage.hasuraApiToken.read());
    }
    if (storage.splitwiseApiToken.exists()) {
      setSplitwiseToken(storage.splitwiseApiToken.read());
    }
    if (storage.tripTags.exists()) {
      setTripTags(tagsToInputField(storage.tripTags.read() as string[]));
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

  function handleTripTagsChange(
    _: SyntheticEvent,
    { value }: InputOnChangeData
  ) {
    if (value === undefined || value === null || value === "") {
      setTripTags(undefined);
      storage.tripTags.delete();
      return;
    }

    setTripTags(value);

    const tags = inputFieldToTags(value);
    storage.tripTags.set(tags);
  }

  return (
    <CenteredPage>
      <h1>Settings</h1>
      <Form.Input
        label="Hasura API token"
        placeholder="Hasura API token"
        name="hasura-api-token"
        value={hasuraToken}
        fluid
        onChange={handleHasuraApiTokenChange}
      />
      <Form.Input
        label="Splitwise API token"
        placeholder="Splitwise API token"
        name="splitwise-api-token"
        value={splitwiseToken}
        fluid
        onChange={handleSplitwiseApiTokenChange}
      />
      <Form.Input
        label="Trip tags"
        placeholder="trip tags"
        name="trip-tags"
        value={tripTags}
        fluid
        onChange={handleTripTagsChange}
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
