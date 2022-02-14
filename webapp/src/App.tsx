import ErrorPanel from "./components/ErrorPanel";
import DebugPage from "./pages/DebugPage";
import ExpensesForm from "./pages/ExpensesForm";
import PageNotFound from "./pages/PageNotFound";
import SettingsPage from "./pages/Settings";
import Paths from "./routes";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <ErrorPanel />
      <Routes>
        <Route path={Paths.root} element={<ExpensesForm />} />
        <Route path={Paths.settings} element={<SettingsPage />} />
        <Route path={Paths.debug} element={<DebugPage />} />
        <Route path={Paths.notFound} element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
