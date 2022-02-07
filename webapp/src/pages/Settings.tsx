import CenteredPage from "../components/CenteredPage";
import storage from "../localStorage";
import { useEffect, useState } from "react";

function SettingsPage() {
  const [hasuraApiToken, setHasuraApiToken] = useState<string | null>(null);

  useEffect(() => {
    if (storage.hasuraApiToken.exists()) {
      setHasuraApiToken(storage.hasuraApiToken.read());
    }
  }, []);

  return (
    <CenteredPage>
      <div>Settings</div>
      <p>Hasura API token: {JSON.stringify(hasuraApiToken)}</p>
    </CenteredPage>
  );
}

export default SettingsPage;
