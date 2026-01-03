import { CurrencyAmount, PersonName, Split } from "../../../domain/model";
import { divideEqually, validateSplits } from "../../../domain/splits";
import { Button } from "../../Button";

const DAVID: PersonName = "DavidTorralba";
const ANGELA: PersonName = "AngelaPerez";

interface Props {
  splits: Split[];
  amount: CurrencyAmount;
  onChange: (splits: Split[]) => void;
}

export function DefaultActions({ splits, amount, onChange: update }: Props) {
  function handleDavidPaidAndSplitEqually(): void {
    const updatedSplits = divideEqually([
      { person: DAVID, paid: amount, owed: undefined },
      { person: ANGELA, paid: undefined, owed: undefined },
    ]);
    update(updatedSplits);
  }

  function handleAngelaPaidAndSplitEqually(): void {
    const updatedSplits = divideEqually([
      { person: ANGELA, paid: amount, owed: undefined },
      { person: DAVID, paid: undefined, owed: undefined },
    ]);
    update(updatedSplits);
  }

  function handleSplitEqually(): void {
    const updatedSplits = divideEqually(splits);
    update(updatedSplits);
  }

  const splitValidation = validateSplits(splits);

  return (
    <div role="split-default-actions" className="p-3">
      <div className="flex flex-column justify-center gap-x-3">
        <Button text="David paid" onClick={handleDavidPaidAndSplitEqually} />
        <Button text="Angela paid" onClick={handleAngelaPaidAndSplitEqually} />
        <Button text="split equally" onClick={handleSplitEqually} />
      </div>

      {splitValidation.isValid === false && (
        <div role="invalid-splits" className="pt-3 flex flex-column justify-center">
          INVALID SPLITS: {splitValidation.reason}
        </div>
      )}
    </div>
  );
}
