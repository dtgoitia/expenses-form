import Paths from "../routes";
import { Alignment, Navbar, Tab, Tabs } from "@blueprintjs/core";
import { useLocation, useNavigate } from "react-router-dom";

function NavBar() {
  let navigate = useNavigate();
  const location = useLocation();

  function handleTabClick(rawPath: string): void {
    navigate(rawPath);
  }

  return (
    <Navbar>
      <Navbar.Group>
        <Navbar.Heading>expenses</Navbar.Heading>
      </Navbar.Group>

      <Navbar.Group align={Alignment.RIGHT}>
        {/*  */}
        <Tabs
          id="TabsExample"
          onChange={handleTabClick}
          selectedTabId={location.pathname}
        >
          <Tab id={`${Paths.root}`} title="Expenses" />
          <Tab id={`${Paths.paymentAccounts}`} title="Accounts" />
          <Tab id={`${Paths.settings}`} title="Settings" />
          <Tabs.Expander />
        </Tabs>
      </Navbar.Group>
    </Navbar>
  );
}

export default NavBar;
