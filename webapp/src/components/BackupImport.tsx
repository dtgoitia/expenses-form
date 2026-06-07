import { ChangeEvent, useState } from "react";
import { App } from "../domain/app";
import { Export } from "../localStorage";
import { Button } from "./Button";

interface Props {
  app: App;
}

export function BackupImport({ app }: Props) {
  const [dataToImport, setDataToImport] = useState<Export | undefined>();
  const [isImported, setIsImported] = useState<boolean>(false);

  function handleImportUpload(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (!file) {
      alert("ERROR: file undefined");
      return;
    }

    setDataToImport(undefined);
    setIsImported(false);

    const reader = new FileReader();

    reader.onloadstart = () => console.log("BackupImport::loading started...");
    reader.onprogress = (e) =>
      console.log(`BackupImport::progress... ${e.loaded}/${e.total} bytes`);

    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === "string") {
          const json = JSON.parse(text) as Export;
          setDataToImport(json);
          setIsImported(false);
        }
      } catch (err) {
        alert("File is not in a valid JSON format");
      }
    };

    reader.onerror = (e) => {
      alert("failed to read the file");
    };

    reader.readAsText(file);
    reader.onloadend;
    reader.onloadend = () => {
      console.log("BackupImport::load completed.");
      setIsImported(false);
    };
  }

  function importAppData(): void {
    if (dataToImport === undefined) {
      console.debug(
        `BackupImport::attempted to import loaded data, but loaded data was undefined, aborting...`
      );
      return;
    }

    app.browserStorage.import(dataToImport);
    setIsImported(true);
    setDataToImport(undefined);
  }

  return (
    <div>
      <div className="flex flex-col gap-y-2">
        <input
          type="file"
          accept=".json,application/json"
          onChange={handleImportUpload}
        />
        {dataToImport !== undefined && (
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-row justify-center">Data successfully loaded</div>
            <div className="flex flex-row justify-center">
              <Button
                text="Import loaded data"
                onClick={() => importAppData()}
                disabled={dataToImport === undefined}
              />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-y-2">
          {isImported ? (
            <>
              <div className="flex flex-row justify-center">
                Backup successfully restored!
              </div>
              <div className="flex flex-row justify-center">Reload to apply changes</div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
