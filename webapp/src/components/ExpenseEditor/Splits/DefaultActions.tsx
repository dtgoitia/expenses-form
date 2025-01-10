import { Split } from "../../../domain/model";
import { divideEqually, validateSplits } from "../../../domain/splits";
import { Button } from "../../Button";

interface Props {
  splits: Split[];
  onChange: (splits: Split[]) => void;
}

export function DefaultActions({ splits, onChange: update }: Props) {
  function handleSplitEqually(): void {
    const updatedSplits = divideEqually(splits);
    update(updatedSplits);
  }

  const splitValidation = validateSplits(splits);

  return (
    <div role="split-default-actions" className="p-3">
      <div className="flex flex-column justify-center">
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
