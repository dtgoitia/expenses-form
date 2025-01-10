import { SPLIT_DECIMAL_NUMBER } from "../constants";
import { Split } from "./model";

export function divideEqually(splits: Split[]): Split[] {
  /**
   * Algorithm:
   *
   *  1. Divide the amount (X) equally per person
   *  2. Round down to the desired decimal.
   *  3. Add all rounded down values ( = Y )
   *  4. Calculate difference between X and Y
   *  5. Spread Y across the splits
   *
   */
  const base = Math.pow(10, SPLIT_DECIMAL_NUMBER);

  const paid = splits.map((s) => s.paid || 0).reduce((acc, x) => acc + x, 0);
  const participantAmount = splits.length;

  const minPerPerson = (base * paid) / participantAmount;
  const _floor = Math.floor(minPerPerson);

  const reminder = paid * base - _floor * splits.length;
  const step = 1;

  const values: number[] = [];
  let reminder_acc = 0;
  for (let index = 0; index < splits.length; index++) {
    if (reminder_acc < reminder) {
      reminder_acc += step;
      values.push(_floor + step);
    } else {
      values.push(_floor);
    }
  }

  const result = splits.map((split, i) => ({ ...split, owed: values[i] / base }));
  return result;
}

export function validateSplits(
  splits: Split[]
): { isValid: true } | { isValid: false; reason: string } {
  let paid = 0;
  let owed = 0;
  for (const split of splits) {
    paid += split.paid || 0;
    owed += split.owed || 0;
  }

  if (paid !== owed) {
    return {
      isValid: false,
      reason: `total paid amount does not match total owed amount`,
    };
  }

  return { isValid: true };
}
