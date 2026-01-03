import { identifyScenario } from ".";
import { CurrencyAmount, CurrencyCode } from "../../../domain/model";

const ANY_AMOUNT: CurrencyAmount = 1234;
const ANY_CURRENCY: CurrencyCode = "FOO";

describe("identify scenario", () => {
  describe("given the payment is in the same currency as the account currency", () => {
    describe("and the amount is not set", () => {
      it("then the split amount matches the amount in the account currency", () => {
        const scenario = identifyScenario({
          amountInAccountCurrency: undefined,
          amountInMerchantCurrency: undefined, // payment currency matches account currency
          merchantCurrency: undefined, // payment currency matches account currency
        });
        expect(scenario).toEqual("useAccountCurrency");
      });
    });

    describe("and the amount is set", () => {
      it("then the split amount matches the amount in the account currency", () => {
        const scenario = identifyScenario({
          amountInAccountCurrency: ANY_AMOUNT,
          amountInMerchantCurrency: undefined, // payment currency matches account currency
          merchantCurrency: undefined, // payment currency matches account currency
        });
        expect(scenario).toEqual("useAccountCurrency");
      });
    });
  });

  describe("given the payment is not in the same currency as the account currency", () => {
    describe("and the amount in the account currency is not set", () => {
      describe("and the amount in the merchant currency is not set", () => {
        it("then the app reached an invalid state", () => {
          const scenario = identifyScenario({
            amountInAccountCurrency: undefined,
            amountInMerchantCurrency: undefined,
            merchantCurrency: ANY_CURRENCY,
          });
          expect(scenario).toEqual("invalidAppState");
        });
      });
      describe("and the amount in the merchant currency is set", () => {
        it("then the split amount matches the amount in the merchant currency", () => {
          const scenario = identifyScenario({
            amountInAccountCurrency: undefined,
            amountInMerchantCurrency: ANY_AMOUNT,
            merchantCurrency: ANY_CURRENCY,
          });
          expect(scenario).toEqual("useMerchantCurrency");
        });
      });
    });

    describe("and the amount in the account currency is set", () => {
      describe("and the amount in the merchant currency is not set", () => {
        it("then the split amount matches the amount in the account currency", () => {
          const scenario = identifyScenario({
            amountInAccountCurrency: ANY_AMOUNT,
            amountInMerchantCurrency: undefined,
            merchantCurrency: ANY_CURRENCY,
          });
          expect(scenario).toEqual("useAccountCurrency");
        });
      });
      describe("and the amount in the merchant currency is set", () => {
        it("then the user must choose which currency it wants to use in the splits", () => {
          const scenario = identifyScenario({
            amountInAccountCurrency: 1234,
            amountInMerchantCurrency: 5678,
            merchantCurrency: ANY_CURRENCY,
          });
          expect(scenario).toEqual("allowUserToChooseCurrency");
        });
      });
    });
  });
});
