import CenteredPage from "../components/CenteredPage";
import { AccountAlias } from "../domain/model";
import storage from "../localStorage";
import Paths from "../routes";
import { Button, Label } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  const [splitwiseToken, setSplitwiseToken] = useState<string | undefined>(undefined);
  const [tripTags, setTripTags] = useState<string | undefined>(undefined);
  const [people, setPeople] = useState<string | undefined>(undefined);
  const [paymentMethod, setPaymentMethod] = useState<AccountAlias | undefined>(undefined);
  const [firestoreConfig, setFirestoreConfig] = useState<string | undefined>(undefined);

  useEffect(() => {
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

  function handleSplitwiseApiTokenChange(event: any): void {
    const value = event.target.value;
    if (value === undefined || value === null || value === "") {
      setSplitwiseToken(undefined);
      storage.splitwiseApiToken.delete();
      return;
    }

    setSplitwiseToken(value);
    storage.splitwiseApiToken.set(value);
  }

  function handleTripTagsChange(event: any): void {
    const value = event.target.value;
    if (value === undefined || value === null || value === "") {
      setTripTags(undefined);
      storage.tripTags.delete();
      return;
    }

    setTripTags(value);

    const tags = inputFieldToList(value);
    storage.tripTags.set(tags);
  }

  function handlePeopleChange(event: any): void {
    const value = event.target.value;
    if (value === undefined || value === null || value === "") {
      setPeople(undefined);
      storage.people.delete();
      return;
    }

    setPeople(value.replaceAll(",,", ",").trim());

    const peopleNames = inputFieldToList(value);
    storage.people.set(peopleNames);
  }

  function handlePaymentMethodChange(event: any): void {
    const value = event.target.value;
    if (value === undefined || value === null || value === "") {
      setPaymentMethod(undefined);
      storage.defaultPaymentAccount.delete();
      return;
    }

    setPaymentMethod(value);
    storage.defaultPaymentAccount.set(value);
  }

  function handleFirestoreConfigChange(event: any): void {
    const value = event.target.value;
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

      <Label htmlFor="splitwise-api-token">
        Splitwise API token
        <input
          className="bp4-input bp4-fill"
          type="text"
          id="splitwise-api-token"
          value={splitwiseToken}
          placeholder="Splitwise API token"
          onChange={handleSplitwiseApiTokenChange}
        />
      </Label>

      <Label htmlFor="trip-tags">
        Trip tags
        <input
          className="bp4-input bp4-fill"
          type="text"
          id="trip-tags"
          value={tripTags}
          placeholder="trip tags"
          onChange={handleTripTagsChange}
        />
      </Label>

      <Label htmlFor="people">
        People
        <input
          className="bp4-input bp4-fill"
          type="text"
          id="people"
          value={people}
          placeholder="JohnDoe,JaneDoe"
          onChange={handlePeopleChange}
        />
      </Label>

      <Label htmlFor="payment-method">
        Default payment method
        <input
          className="bp4-input bp4-fill"
          type="text"
          id="payment-method"
          value={paymentMethod}
          placeholder="amex"
          onChange={handlePaymentMethodChange}
        />
      </Label>

      <Label htmlFor="firestore-config">
        Firestore config
        <input
          className="bp4-input bp4-fill"
          type="text"
          id="firestore-config"
          value={firestoreConfig}
          placeholder={`{"a":1,"b":2}`}
          onChange={handleFirestoreConfigChange}
        />
      </Label>

      <Link to={Paths.root}>
        <Button icon="cross">Close</Button>
      </Link>
    </CenteredPage>
  );
}

export default SettingsPage;
