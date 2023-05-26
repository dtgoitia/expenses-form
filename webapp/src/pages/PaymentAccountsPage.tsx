import CenteredPage from "../components/CenteredPage";
import styled from "styled-components";

const CenteredItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 3.5rem;
  height: 100vh;
`;

export default function PaymentAccountsPage() {
  return (
    <CenteredPage>
      <CenteredItem>
        <h1>PaymentAccountsPage</h1>
      </CenteredItem>
    </CenteredPage>
  );
}
