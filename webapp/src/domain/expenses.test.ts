import { formatSeller } from "./expenses";

describe("formats seller", () => {
  it("single simple words", () => {
    expect(formatSeller("aaa")).toEqual("Aaa");
    expect(formatSeller("AAA")).toEqual("Aaa");
    expect(formatSeller("aaA")).toEqual("Aaa");
    expect(formatSeller("aaA")).toEqual("Aaa");
  });

  it("numbers-only", () => {
    expect(formatSeller("123")).toEqual("123");
  });

  it("many words no weird characters", () => {
    expect(formatSeller("some shop")).toEqual("SomeShop");
    expect(formatSeller("ABC shop")).toEqual("AbcShop");
  });

  it("many words with &", () => {
    expect(formatSeller("some shop & brothers")).toEqual("SomeShopAndBrothers");
  });

  it("many words with weird characters", () => {
    expect(formatSeller("some-shop")).toEqual("SomeShop");
    expect(formatSeller("ABC-shop")).toEqual("AbcShop");
  });

  it("many words with weird characters and 'via @X'", () => {
    expect(formatSeller("some shop via airport foo")).toEqual(
      "SomeShop (via @AirportFoo)"
    );
    expect(formatSeller("ABC-shop via shopping 7-mall")).toEqual(
      "AbcShop (via @Shopping7Mall)"
    );
    expect(formatSeller("áéíóú")).toEqual("Aeiou");
    expect(formatSeller("Ăă")).toEqual("Aa");
    expect(formatSeller("Ââ")).toEqual("Aa");
    expect(formatSeller("Đđ")).toEqual("Dd");
    expect(formatSeller("Êê")).toEqual("Ee");
    expect(formatSeller("Ôô")).toEqual("Oo");
    expect(formatSeller("Ơơ")).toEqual("Oo");
    expect(formatSeller("Ưư")).toEqual("Uu");

    expect(formatSeller("Ưư")).toEqual("Uu");
    expect(formatSeller("Ạạ")).toEqual("Aa");
    expect(formatSeller("Ẹẹ")).toEqual("Ee");
    expect(formatSeller("Ịị")).toEqual("Ii");
    expect(formatSeller("Ọọ")).toEqual("Oo");
    expect(formatSeller("Ụụ")).toEqual("Uu");
    expect(formatSeller("Ỵỵ")).toEqual("Yy");

    expect(formatSeller("Ảả")).toEqual("Aa");
    expect(formatSeller("Ẻẻ")).toEqual("Ee");
    expect(formatSeller("Ỉỉ")).toEqual("Ii");
    expect(formatSeller("Ỡỡ")).toEqual("Oo");
    expect(formatSeller("Ủủ")).toEqual("Uu");
    expect(formatSeller("Ỷỷ")).toEqual("Yy");
  });
});
