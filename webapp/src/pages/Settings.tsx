import CenteredPage from "../components/CenteredPage";
import { AccountAlias } from "../domain/model";
import storage from "../localStorage";
import Paths from "../routes";
import { SyntheticEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Icon, InputOnChangeData } from "semantic-ui-react";

function listToInputField(items: string[]): string {
  return items.join(",");
}

function inputFieldToList(inputValue: string): string[] {
  const quotedItems = inputValue
    .split(",")
    .filter((tag) => tag !== "") // because  value="foo,," --> ["foo","",""]
    .map((tag) => `"${tag}"`)
    .join(",");
  const items = JSON.parse(`[${quotedItems}]`);
  return items;
}

function SettingsPage() {
  const [hasuraToken, setHasuraToken] = useState<string | undefined>(undefined);
  const [splitwiseToken, setSplitwiseToken] = useState<string | undefined>(undefined);
  const [tripTags, setTripTags] = useState<string | undefined>(undefined);
  const [people, setPeople] = useState<string | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<AccountAlias | undefined>(undefined);
  const [firestoreConfig, setFirestoreConfig] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (storage.hasuraApiToken.exists()) {
      setHasuraToken(storage.hasuraApiToken.read());
    }
    if (storage.splitwiseApiToken.exists()) {
      setSplitwiseToken(storage.splitwiseApiToken.read());
    }
    if (storage.tripTags.exists()) {
      setTripTags(listToInputField(storage.tripTags.read() as string[]));
    }
    if (storage.people.exists()) {
      setPeople(listToInputField(storage.people.read() as string[]));
    }
    if (storage.defaultPaymentAccount.exists()) {
      setPaymentMethod(storage.defaultPaymentAccount.read());
    }
    if (storage.firestoreConfig.exists()) {
      const config = storage.firestoreConfig.read();
      setFirestoreConfig(JSON.stringify(config));
    }
  }, []);

  function handleHasuraApiTokenChange(_: SyntheticEvent, { value }: InputOnChangeData) {
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

  function handleTripTagsChange(_: SyntheticEvent, { value }: InputOnChangeData) {
    if (value === undefined || value === null || value === "") {
      setTripTags(undefined);
      storage.tripTags.delete();
      return;
    }

    setTripTags(value);

    const tags = inputFieldToList(value);
    storage.tripTags.set(tags);
  }

  function handlePeopleChange(_: SyntheticEvent, { value }: InputOnChangeData) {
    if (value === undefined || value === null || value === "") {
      setPeople(undefined);
      storage.people.delete();
      return;
    }

    setPeople(value.replaceAll(",,", ",").trim());

    const peopleNames = inputFieldToList(value);
    storage.people.set(peopleNames);
  }

  function handlePaymentMethodChange(_: SyntheticEvent, { value }: InputOnChangeData) {
    if (value === undefined || value === null || value === "") {
      setPaymentMethod(undefined);
      storage.defaultPaymentAccount.delete();
      return;
    }

    setPaymentMethod(value);
    storage.defaultPaymentAccount.set(value);
  }

  function handleFirestoreConfigChange(_: SyntheticEvent, { value }: InputOnChangeData) {
    if (value === undefined || value === null || value === "") {
      setFirestoreConfig(undefined);
      storage.firestoreConfig.delete();
      return;
    }

    setFirestoreConfig(value);
    const config = JSON.parse(value);
    storage.firestoreConfig.set(config);
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
      <Form.Input
        label="People"
        placeholder="JohnDoe,JaneDoe"
        name="people"
        value={people}
        fluid
        onChange={handlePeopleChange}
      />
      <Form.Input
        label="Default payment method"
        placeholder="amex"
        name="payment-method"
        value={paymentMethod}
        fluid
        onChange={handlePaymentMethodChange}
      />
      <Form.Input
        label="Firestore config"
        placeholder={`{"a":1,"b":2}`}
        name="firestore-config"
        value={firestoreConfig}
        fluid
        onChange={handleFirestoreConfigChange}
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
