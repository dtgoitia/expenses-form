import { ErrorMessage, errorsService } from "../services/errors";
import { Button } from "./Button";
import { useEffect, useState } from "react";

export function ErrorPanel() {
  const [errors, setErrors] = useState<ErrorMessage[]>([]);

  useEffect(() => {
    const subscription = errorsService.errorsFeed$.subscribe(setErrors);
    return subscription.unsubscribe;
  }, []);

  if (!errors || errors.length === 0) return null;

  return (
    <div className="p-3">
      <div className="flex flex-row justify-end pb-3">
        <Button
          text="Clear all error messages"
          onClick={() => errorsService.deleteAll()}
        />
      </div>

      <div className="flex flex-col gap-2" role="error-list">
        {errors.map((error, i) => (
          <Error key={`error-${i}`} error={error} />
        ))}
      </div>
    </div>
  );
}

interface ErrorsProps {
  error: ErrorMessage;
}

function Error({ error: { header, description } }: ErrorsProps) {
  return (
    <div className={"p-3 bg-gray-100 dark:bg-red-800"} role="error">
      <div className={"font-bold"} role="error-header">
        {header}
      </div>
      <div className={""} role="error-description">
        {description}
      </div>
    </div>
  );
}
