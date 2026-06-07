import CenteredPage from "../../components/CenteredPage";
import { Label } from "../../components/Label";
import { TextInput } from "../../components/TextInput";
import { App } from "../../domain/app";
import storage from "../../localStorage";
import { useEffect, useState } from "react";
import { PeopleForm } from "./PeopleForm";
import { ShortcutsForm } from "./ShortcutsForm";
import { CurrenciesForm } from "./CurrenciesForm";
import { TagsForm } from "./TagsForm";
import { BackupImport } from "../../components/BackupImport";

interface Props {
  app: App;
}

export function SettingsPage({ app }: Props) {
  const [splitwiseToken, setSplitwiseToken] = useState<string | undefined>(undefined);
  const [firestoreConfig, setFirestoreConfig] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (storage.splitwiseApiToken.exists()) {
      setSplitwiseToken(storage.splitwiseApiToken.read());
    }
    if (storage.firestoreConfig.exists()) {
      const config = storage.firestoreConfig.read();
      setFirestoreConfig(JSON.stringify(config));
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

        <TagsForm app={app} />

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

        <CurrenciesForm app={app} />

        <PeopleForm app={app} />

        <ShortcutsForm app={app} />

        <div className="pb-6">
          <b>restore</b>&nbsp; from a backup:
          <BackupImport app={app} />
        </div>
      </div>
    </CenteredPage>
  );
}
