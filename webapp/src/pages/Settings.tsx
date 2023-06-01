import CenteredPage from "../components/CenteredPage";
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
  const [firestoreConfig, setFirestoreConfig] = useState<string | undefined>(undefined);
  const [currencies, setCurrencies] = useState<string | undefined>();

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
    if (storage.firestoreConfig.exists()) {
      const config = storage.firestoreConfig.read();
      setFirestoreConfig(JSON.stringify(config));
    }
    if (storage.currencies.exists()) {
      setCurrencies(storage.currencies.read());
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

  function handleCurrenciesChange(event: any): void {
    const value = event.target.value;
    if (value === undefined || value === null || value === "") {
      setCurrencies(undefined);
      storage.currencies.delete();
      return;
    }

    setCurrencies(value);
    storage.currencies.set(value);
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

      <Label htmlFor="currencies">
        Currencies
        <input
          className="bp4-input bp4-fill"
          type="text"
          id="currencies"
          value={currencies}
          placeholder={`GBP,EUR,USD`}
          onChange={handleCurrenciesChange}
        />
      </Label>

      <Link to={Paths.root}>
        <Button icon="cross">Close</Button>
      </Link>
    </CenteredPage>
  );
}

export default SettingsPage;
