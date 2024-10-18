import { ErrorMessage, errorsService } from "../services/errors";
import { Button } from "./Button";
import { Callout } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface ErrorsProps {
  error: ErrorMessage;
}

function Error({ error: { header, description } }: ErrorsProps) {
  return <Callout title={header}>{description}</Callout>;
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
      <Button text="Clear all error messages" onClick={() => errorsService.deleteAll()} />

      {errors.map((error, i) => (
        <Error key={`error-${i}`} error={error} />
      ))}
    </ErrorsContainer>
  );
}
