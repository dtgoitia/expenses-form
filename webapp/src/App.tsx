import ErrorPanel from "./components/ErrorPanel";
import { initialize } from "./domain/init";
import ExpensesForm from "./pages/ExpensesForm";
import PageNotFound from "./pages/PageNotFound";
import SettingsPage from "./pages/Settings";
import Paths from "./routes";
import { Route, Routes } from "react-router-dom";

function App() {
  const { expenseManager } = initialize();
  return (
    <div>
      <ErrorPanel />
      <Routes>
        <Route
          path={Paths.root}
          element={<ExpensesForm expenseManager={expenseManager} />}
        />
        <Route path={Paths.settings} element={<SettingsPage />} />
        <Route path={Paths.notFound} element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
