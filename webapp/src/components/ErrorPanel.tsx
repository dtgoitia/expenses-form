import { ErrorMessage, errorsService } from "../services/errors";
import { useEffect, useState } from "react";
import { Button, Message } from "semantic-ui-react";
import styled from "styled-components";

interface ErrorsProps {
  error: ErrorMessage;
}

function Error({ error: { header, description } }: ErrorsProps) {
  return (
    <Message negative>
      <Message.Header>{header}</Message.Header>
      <pre>{description}</pre>
    </Message>
  );
}

const ErrorsContainer = styled.div`
  margin: 0.2rem;
`;

export default function Errors() {
  const [errors, setErrors] = useState<ErrorMessage[]>([]);
  useEffect(() => {
    const subscription = errorsService.errorsFeed$.subscribe(setErrors);
    return subscription.unsubscribe;
  }, []);

  if (!errors || errors.length === 0) return null;

  return (
    <ErrorsContainer>
      <Button onClick={() => errorsService.deleteAll()}>
        Clear all error messages
      </Button>
      {errors.map((error, i) => (
        <Error key={`error-${i}`} error={error} />
      ))}
    </ErrorsContainer>
  );
}
