import ErrorPanel from "./components/ErrorPanel";
import { App } from "./domain/app";
import ExpensesForm from "./pages/ExpensesForm";
import PageNotFound from "./pages/PageNotFound";
import PaymentAccountsPage from "./pages/PaymentAccountsPage";
import SettingsPage from "./pages/Settings";
import Paths from "./routes";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

interface Props {
  app: App;
}

function AppUI({ app }: Props) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    app.initialize();
    setLoading(false);
  }, [app]);

  if (loading) {
    return <div>initializing app!</div>;
  }

  return (
    <div>
      <ErrorPanel />
      <Routes>
        <Route path={Paths.root} element={<ExpensesForm app={app} />} />
        <Route path={Paths.paymentAccounts} element={<PaymentAccountsPage app={app} />} />
        <Route path={Paths.settings} element={<SettingsPage />} />
        <Route path={Paths.notFound} element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default AppUI;
