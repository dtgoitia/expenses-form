import { Split } from "./model";
import { divideEqually, validateSplits } from "./splits";

describe("divide expense equally", () => {
  it("with no decimals", () => {
    const splits: Split[] = [
      { person: "A", paid: 10, owed: 0 },
      { person: "B", paid: 0, owed: 0 },
    ];
    const result = divideEqually(splits);
    expect(result).toEqual([
      { person: "A", paid: 10, owed: 5 },
      { person: "B", paid: 0, owed: 5 },
    ]);
  });

  it("with decimals that split perfectly", () => {
    const splits: Split[] = [
      { person: "A", paid: 1, owed: 0 },
      { person: "B", paid: 0, owed: 0 },
    ];
    const result = divideEqually(splits);
    expect(result).toEqual([
      { person: "A", paid: 1, owed: 0.5 },
      { person: "B", paid: 0, owed: 0.5 },
    ]);
  });

  it("with decimals that do not split perfectly", () => {
    const splits: Split[] = [
      { person: "A", paid: 1, owed: 0 },
      { person: "B", paid: 0, owed: 0 },
      { person: "C", paid: 0, owed: 0 },
    ];
    const result = divideEqually(splits);

    // order of owed amount is random
    const owedAmounts = result.map((split) => split.owed).sort();
    expect(owedAmounts).toEqual([0.33, 0.33, 0.34]);
  });

  it("with only one person with a 'paid' value", () => {
    const splits: Split[] = [
      { person: "A", paid: 3, owed: undefined },
      { person: "B", paid: undefined, owed: undefined },
      { person: "C", paid: undefined, owed: undefined },
    ];
    const result = divideEqually(splits);
    expect(result).toEqual([
      { person: "A", paid: 3, owed: 1 },
      { person: "B", paid: 0, owed: 1 },
      { person: "C", paid: 0, owed: 1 },
    ]);
  });
});

describe("validate splits", () => {
  describe("when paid sum matches owed sum", () => {
    it("return success", () => {
      const splits: Split[] = [
        { person: "A", paid: 10, owed: 5 },
        { person: "B", paid: 0, owed: 5 },
      ];
      const result = validateSplits(splits);
      expect(result).toEqual({ isValid: true });
    });
  });
  describe("when paid sum matches owed sum", () => {
    it("return error", () => {
      const splits: Split[] = [
        { person: "A", paid: 1, owed: 5 },
        { person: "B", paid: 2, owed: 0 },
      ];
      const result = validateSplits(splits);
      expect(result).toEqual({
        isValid: false,
        reason: `total paid amount does not match total owed amount`,
      });
    });
  });
});
