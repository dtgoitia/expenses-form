import { descriptionToString, stringToDescription } from ".";

describe("Description", () => {
  describe("convert string to description", () => {
    it("only with tags", () => {
      const raw = "Something #foo #bar";
      const description = stringToDescription({ raw });
      expect(description).toEqual({
        main: "Something",
        people: [],
        seller: undefined,
        tags: ["foo", "bar"],
      });
    });

    it("only with people", () => {
      const raw = "Something with @JohnDoe,@JaneDoe";
      const description = stringToDescription({ raw });
      expect(description).toEqual({
        main: "Something",
        people: ["JohnDoe", "JaneDoe"],
        seller: undefined,
        tags: [],
      });
    });

    it("only with seller", () => {
      const raw = "Something at @BigShop";
      const description = stringToDescription({ raw });
      expect(description).toEqual({
        main: "Something",
        people: [],
        seller: "BigShop",
        tags: [],
      });
    });

    it("with seller and tags", () => {
      const raw = "Something at @BigShop #foo #bar";
      const description = stringToDescription({ raw });
      expect(description).toEqual({
        main: "Something",
        people: [],
        seller: "BigShop",
        tags: ["foo", "bar"],
      });
    });

    it("with people and seller", () => {
      const raw = "Something with @JohnDoe,@JaneDoe at @BigShop";
      const description = stringToDescription({ raw });
      expect(description).toEqual({
        main: "Something",
        people: ["JohnDoe", "JaneDoe"],
        seller: "BigShop",
        tags: [],
      });
    });

    it("with people, seller and tags", () => {
      const raw = "Something with @JohnDoe,@JaneDoe at @BigShop #foo #bar";
      const description = stringToDescription({ raw });
      expect(description).toEqual({
        main: "Something",
        people: ["JohnDoe", "JaneDoe"],
        seller: "BigShop",
        tags: ["foo", "bar"],
      });
    });
  });

  describe("convert description to string", () => {
    it("only with tags", () => {
      const description = {
        main: "Something",
        people: [],
        seller: undefined,
        tags: ["foo", "bar"],
      };
      const str = descriptionToString(description);
      expect(str).toEqual("Something #foo #bar");
    });

    it("only with people", () => {
      const description = {
        main: "Something",
        people: ["JohnDoe", "JaneDoe"],
        seller: undefined,
        tags: [],
      };
      const str = descriptionToString(description);
      expect(str).toEqual("Something with @JohnDoe,@JaneDoe");
    });

    it("only with seller", () => {
      const description = {
        main: "Something",
        people: [],
        seller: "BigShop",
        tags: [],
      };
      const str = descriptionToString(description);
      expect(str).toEqual("Something at @BigShop");
    });

    it("with seller and tags", () => {
      const description = {
        main: "Something",
        people: [],
        seller: "BigShop",
        tags: ["foo", "bar"],
      };
      const str = descriptionToString(description);
      expect(str).toEqual("Something at @BigShop #foo #bar");
    });

    it("with people and seller", () => {
      const description = {
        main: "Something",
        people: ["JohnDoe", "JaneDoe"],
        seller: "BigShop",
        tags: [],
      };
      const str = descriptionToString(description);
      expect(str).toEqual("Something with @JohnDoe,@JaneDoe at @BigShop");
    });

    it("with people, seller and tags", () => {
      const description = {
        main: "Something",
        people: ["JohnDoe", "JaneDoe"],
        seller: "BigShop",
        tags: ["foo", "bar"],
      };
      const str = descriptionToString(description);
      expect(str).toEqual(
        "Something with @JohnDoe,@JaneDoe at @BigShop #foo #bar"
      );
    });
  });

  describe("edge cases", () => {
    it("no main description, but has seller", () => {
      const before = {
        main: undefined,
        people: [],
        seller: "BigShop",
        tags: [],
      };
      const raw = descriptionToString(before);
      expect(raw).toEqual("at @BigShop");
      const after = stringToDescription({ raw });
      expect(after).toEqual(before);
    });

    it("no main description, but has people", () => {
      const before = {
        main: undefined,
        people: ["JohnDoe", "JaneDoe"],
        seller: undefined,
        tags: [],
      };
      const raw = descriptionToString(before);
      expect(raw).toEqual("with @JohnDoe,@JaneDoe");
      const after = stringToDescription({ raw });
      expect(after).toEqual(before);
    });

    it("no main description, but has tags", () => {
      const before = {
        main: undefined,
        people: [],
        seller: undefined,
        tags: ["foo", "bar"],
      };
      const raw = descriptionToString(before);
      expect(raw).toEqual("#foo #bar");
      const after = stringToDescription({ raw });
      expect(after).toEqual(before);
    });
  });
});
