import Paths from "../routes";
import { ThemeToggle } from "./ThemeToggle";
import { useLocation, useNavigate } from "react-router-dom";

function Tab({ title, path }: { title: string; path: string }) {
  let navigate = useNavigate();
  const location = useLocation();

  function handleClick(pathPrefix: string): void {
    navigate(pathPrefix);
  }

  // assumption: `pathname` never contains query params
  const isActive = location.pathname === path;

  let css = `cursor-pointer hover:text-blue-300`;
  if (isActive) {
    // color
    css += " text-blue-800 dark:text-blue-300";

    // underline (decoration = line thickness)
    css += " underline underline-offset-8 decoration-2";
  }

  return (
    <div className={css} onClick={() => handleClick(path)}>
      {title}
    </div>
  );
}

function NavBar() {
  return (
    <div className="flex flex-row justify-between p-4 pr-6">
      <div className="mr-6">expenses</div>
      <div id="nav-bar" className="flex flex-row gap-5">
        <Tab title="Expenses" path={Paths.root} />
        <Tab title="Accounts" path={Paths.paymentAccounts} />
        <Tab title="Settings" path={Paths.settings} />
        <ThemeToggle />
      </div>
    </div>
  );
}

export default NavBar;
