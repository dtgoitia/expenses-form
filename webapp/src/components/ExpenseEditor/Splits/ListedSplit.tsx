import { useEffect, useState } from "react";
import { CurrencyAmount, Split } from "../../../domain/model";
import { Label } from "../../Label";
import { NumericInput } from "../../NumericInput";

interface Props {
  split: Split;
  onChange: (split: Split) => void;
}

export function ListedSplit({ split, onChange: update }: Props) {
  const [paid, setPaid] = useState<CurrencyAmount | undefined>(split.paid);
  const [owed, setOwed] = useState<CurrencyAmount | undefined>(split.owed);

  // required because the 'paid' and 'owed' values can change both via props
  // and via user inputs
  useEffect(() => {
    setPaid(split.paid);
    setOwed(split.owed);
  }, [split]);

  function handleOwedAmountChange(value: number | undefined): void {
    setOwed(value);
    update({ ...split, owed: value });
  }

  function handlePaidAmountChange(value: number | undefined): void {
    setPaid(value);
    update({ ...split, paid: value });
  }

  return (
    <li role="split" className="px-4">
      <div role="split-name" className="text-lg pt-3">
        {split.person}
      </div>
      <div className="grid grid-col-2 gap-3">
        <div role="split-paid" className="col-start-0 col-start-1">
          <Label htmlFor={`paid-${split.person}`} text="paid">
            <div className="pt-1">
              <NumericInput
                value={paid}
                placeholder="Paid amount"
                onChange={handlePaidAmountChange}
              />
            </div>
          </Label>
        </div>
        <div role="split-owed" className="col-start-1 col-start-2">
          <Label htmlFor={`paid-${split.person}`} text="owed">
            <div className="pt-1">
              <NumericInput
                value={owed}
                placeholder="Owed amount"
                onChange={handleOwedAmountChange}
              />
            </div>
          </Label>
        </div>
      </div>
    </li>
  );
}
