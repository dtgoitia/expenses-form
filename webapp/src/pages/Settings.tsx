import CenteredPage from "../components/CenteredPage";
import { TextInput } from "../components/TextInput";
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

  function handleSplitwiseApiTokenChange(value: string | undefined): void {
    if (value === undefined || value === "") {
      setSplitwiseToken(undefined);
      storage.splitwiseApiToken.delete();
      return;
    }

    setSplitwiseToken(value);
    storage.splitwiseApiToken.set(value);
  }

  function handleTripTagsChange(value: string | undefined): void {
    if (value === undefined || value === "") {
      setTripTags(undefined);
      storage.tripTags.delete();
      return;
    }

    setTripTags(value);

    const tags = inputFieldToList(value);
    storage.tripTags.set(tags);
  }

  function handlePeopleChange(value: string | undefined): void {
    if (value === undefined || value === "") {
      setPeople(undefined);
      storage.people.delete();
      return;
    }

    setPeople(value.replaceAll(",,", ",").trim());

    const peopleNames = inputFieldToList(value);
    storage.people.set(peopleNames);
  }

  function handleFirestoreConfigChange(value: string | undefined): void {
    if (value === undefined || value === "") {
      setFirestoreConfig(undefined);
      storage.firestoreConfig.delete();
      return;
    }

    setFirestoreConfig(value);
    const config = JSON.parse(value);
    storage.firestoreConfig.set(config);
  }

  function handleCurrenciesChange(value: string | undefined): void {
    if (value === undefined || value === "") {
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
        <TextInput
          id="splitwise-api-token"
          value={splitwiseToken}
          placeholder="Splitwise API token"
          onChange={handleSplitwiseApiTokenChange}
        />
      </Label>

      <Label htmlFor="trip-tags">
        Trip tags
        <TextInput
          id="trip-tags"
          value={tripTags}
          placeholder="trip tags"
          onChange={handleTripTagsChange}
        />
      </Label>

      <Label htmlFor="people">
        People
        <TextInput
          id="people"
          value={people}
          placeholder="JohnDoe,JaneDoe"
          onChange={handlePeopleChange}
        />
      </Label>

      <Label htmlFor="firestore-config">
        Firestore config
        <TextInput
          id="firestore-config"
          value={firestoreConfig}
          placeholder={`{"a":1,"b":2}`}
          onChange={handleFirestoreConfigChange}
          isCode
        />
      </Label>

      <Label htmlFor="currencies">
        Currencies
        <TextInput
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
