import { formatSeller } from "./expenses";

describe("formats seller", () => {
  it("single simple words", () => {
    expect(formatSeller("aaa")).toEqual({ ok: true, seller: "Aaa" });
    expect(formatSeller("AAA")).toEqual({ ok: true, seller: "Aaa" });
    expect(formatSeller("aaA")).toEqual({ ok: true, seller: "Aaa" });
    expect(formatSeller("aaA")).toEqual({ ok: true, seller: "Aaa" });
  });

  it("numbers-only", () => {
    expect(formatSeller("123")).toEqual({ ok: true, seller: "123" });
  });

  it("many words no weird characters", () => {
    expect(formatSeller("some shop")).toEqual({ ok: true, seller: "SomeShop" });
    expect(formatSeller("ABC shop")).toEqual({ ok: true, seller: "AbcShop" });
  });

  it("many words with &", () => {
    expect(formatSeller("some shop & brothers")).toEqual({
      ok: true,
      seller: "SomeShopAndBrothers",
    });
  });

  it("many words with weird characters", () => {
    expect(formatSeller("some-shop")).toEqual({ ok: true, seller: "SomeShop" });
    expect(formatSeller("ABC-shop")).toEqual({ ok: true, seller: "AbcShop" });
  });

  it("many words with weird characters and 'via @X'", () => {
    expect(formatSeller("some shop via airport foo")).toEqual({
      ok: true,
      seller: "SomeShop (via @AirportFoo)",
    });
    expect(formatSeller("ABC-shop via shopping 7-mall")).toEqual({
      ok: true,
      seller: "AbcShop (via @Shopping7Mall)",
    });
  });
});
