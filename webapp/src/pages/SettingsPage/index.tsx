import CenteredPage from "../../components/CenteredPage";
import { Label } from "../../components/Label";
import { TextInput } from "../../components/TextInput";
import { App } from "../../domain/app";
import storage from "../../localStorage";
import { useEffect, useState } from "react";
import { PeopleForm } from "./PeopleForm";
import { ShortcutsForm } from "./ShortcutsForm";

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

interface Props {
  app: App;
}

export function SettingsPage({ app }: Props) {
  const [splitwiseToken, setSplitwiseToken] = useState<string | undefined>(undefined);
  const [tripTags, setTripTags] = useState<string | undefined>(undefined);
  const [firestoreConfig, setFirestoreConfig] = useState<string | undefined>(undefined);
  const [currencies, setCurrencies] = useState<string | undefined>();

  useEffect(() => {
    if (storage.splitwiseApiToken.exists()) {
      setSplitwiseToken(storage.splitwiseApiToken.read());
    }
    if (storage.tripTags.exists()) {
      setTripTags(listToInputField(storage.tripTags.read() as string[]));
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
      <div className="px-3 flex flex-col gap-4">
        <Label htmlFor="splitwise-api-token" text="Splitwise API token">
          <TextInput
            id="splitwise-api-token"
            value={splitwiseToken}
            placeholder="Splitwise API token"
            onChange={handleSplitwiseApiTokenChange}
            className="mt-1"
          />
        </Label>

        <Label htmlFor="trip-tags" text="Trip tags">
          <TextInput
            id="trip-tags"
            value={tripTags}
            placeholder="trip tags"
            onChange={handleTripTagsChange}
            className="mt-1"
          />
        </Label>

        <Label htmlFor="firestore-config" text="Firestore config">
          <TextInput
            id="firestore-config"
            value={firestoreConfig}
            placeholder={`{"a":1,"b":2}`}
            onChange={handleFirestoreConfigChange}
            isCode
            className="mt-1"
          />
        </Label>

        <Label htmlFor="currencies" text="Currencies">
          <TextInput
            id="currencies"
            value={currencies}
            placeholder={`GBP,EUR,USD`}
            onChange={handleCurrenciesChange}
            className="mt-1"
          />
        </Label>

        <PeopleForm app={app} />

        <ShortcutsForm app={app} />
      </div>
    </CenteredPage>
  );
}
