import { useEffect, useState } from "react";
import { App } from "../../domain/app";
import { CurrencyCode } from "../../domain/model";
import { todo, unreachable } from "../../lib/devex";
import { Button } from "../../components/Button";
import { Label } from "../../components/Label";
import { TextInput } from "../../components/TextInput";

interface Props {
  app: App;
}

export function CurrenciesForm({ app }: Props) {
  const [currencies, setCurrencies] = useState<CurrencyCode[]>([]);
  const [currencyToBeAdded, setCurrencyToBeAdded] = useState<CurrencyCode | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const subscription = app.currencyManager.change$.subscribe((_) => {
      setCurrencies([...app.currencyManager.getAll()].sort());
    });

    setCurrencies([...app.currencyManager.getAll()].sort());

    return () => {
      subscription.unsubscribe();
    };
  }, [app]);

  function handleCurrencyToBeAddedChange(value: string | undefined): void {
    setError(undefined);
    setCurrencyToBeAdded(value);
  }

  function handleAddCurrency(): void {
    const isValid = validateCurrency(currencyToBeAdded);
    if (isValid.ok === false) {
      throw unreachable(
        `attempted to add an invalid currency (invalid currency reason: ${isValid.reason})`
      );
    }

    const currency = currencyToBeAdded as CurrencyCode;
    const result = app.currencyManager.add(currency);
    if (result.ok === false) {
      setError(result.reason);
      return;
    }

    setCurrencyToBeAdded(undefined);
  }

  function handleDeleteCurrency(currency: CurrencyCode): void {
    const result = app.deleteCurrencySafe(currency);
    if (result.ok === false) {
      alert(result.reason);
      return;
    }
  }

  const isValid = validateCurrency(currencyToBeAdded);

  return (
    <div className="flex flex-col gap-3 ">
      <h2>Currencies</h2>
      <div className="flex flex-row flex-wrap gap-3">
        {currencies.length === 0 ? (
          <p>no currencies, please add some below</p>
        ) : (
          currencies.map((currency) => (
            <div key={`currency-${currency.toLowerCase()}`}>
              <Button
                icon="bin"
                text={currency}
                onClick={() => handleDeleteCurrency(currency)}
              />
            </div>
          ))
        )}
      </div>

      <Label htmlFor="new-currency-code" text="Currency code: *">
        <TextInput
          id="new-currency-code"
          value={currencyToBeAdded}
          placeholder="USD, EUR..."
          onChange={handleCurrencyToBeAddedChange}
          className="mt-1"
        />
        {error && <div>ERROR: {error}</div>}
      </Label>

      <div className="flex justify-end p-4">
        <Button
          text={isValid.ok ? "Add" : "Invalid currency"}
          // icon="floppy-disk"
          onClick={handleAddCurrency}
          disabled={isValid.ok === false}
        />
      </div>
    </div>
  );
}

function validateCurrency(raw: any): { ok: true } | { ok: false; reason: string } {
  const isEmptyText = [undefined, null, ""].includes(raw);
  if (isEmptyText) {
    return {
      ok: false,
      reason: "expected a 3 uppercase character, but got an empty string",
    };
  }

  const validCurrencyPattern = /^[ABCDEFGHIJKLMNOPQRSTUVWXZ]{3}$/;
  const matches = validCurrencyPattern.exec(raw);
  if (matches === null) {
    return {
      ok: false,
      reason: `expected a 3 uppercase character, but got "${raw}" instead`,
    };
  }

  return { ok: true };
}
