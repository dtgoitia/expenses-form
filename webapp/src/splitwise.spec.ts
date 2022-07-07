import { descriptionToSplitwiseFormat } from "./splitwise";

describe("convert description into Splitwise format", () => {
  test("with trip tag", () => {
    expect(
      descriptionToSplitwiseFormat(
        "Groceries with @JohnDoe,@JaneDoe at @BigCorp #groceries #1234mytrip"
      )
    ).toEqual("Groceries @ BigCorp #1234mytrip");
  });
  test("without trip tag", () => {
    expect(
      descriptionToSplitwiseFormat(
        "Groceries with @JohnDoe,@JaneDoe at @BigCorp #groceries"
      )
    ).toEqual("Groceries @ BigCorp");
  });
  test.skip("without anyone else THIS SHOULD NEVER BE IN SPLITWISE", () => {});
});
