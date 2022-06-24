import { DEFAULT_CURRENCY, DEFAULT_PAYMENT_METHOD } from "../constants";
import { default as realStorage } from "../localStorage";
import ExpensesForm, {
  deserializeExpenseStatus,
  ExpensesFormState,
  ExpenseStatus,
  InvalidExpenseStatus,
  IStorage,
} from "./expenses-form-domain";

function mockNow(): Date {
  return new Date(2022, 1, 1, 0, 2, 3, 456);
}

interface ICreateForm {
  previousState?: ExpensesFormState;
  testStorage?: IStorage;
}
function createForm({
  previousState,
  testStorage,
}: ICreateForm = {}): ExpensesForm {
  const storage = testStorage ? testStorage : realStorage;

  storage.form.delete();

  if (previousState) {
    storage.form.set(previousState);
  }

  return new ExpensesForm(mockNow, storage);
}

function generateFormState(): ExpensesFormState {
  return {
    expenses: [
      {
        paidWith: "foo-account",
        date: mockNow(),
        amount: 12.56,
        currency: "GBP",
        description: "Groceries",
        pending: false,
        shared: false,
        status: ExpenseStatus.Submitted,
      },
    ],
    loaded: 0,
  };
}

describe("Expenses form domain", () => {
  describe("focused expense paidWith", () => {
    test("has default value if no previous state", () => {
      const form = createForm();
      expect(form.loadedExpense.paidWith).toEqual(DEFAULT_PAYMENT_METHOD);
    });

    test("has previous state value if previous state exists", () => {
      const previous = generateFormState();
      previous.expenses[0].paidWith = "super duper account";
      const form = createForm({ previousState: previous });
      expect(form.loadedExpense.paidWith).toEqual("super duper account");
    });

    test("updates value", () => {
      const form = createForm();
      form.setPaidWith("myaccount");
      expect(form.loadedExpense.paidWith).toEqual("myaccount");
      expect((realStorage.form.read() as any).expenses[0].paidWith).toEqual(
        "myaccount"
      );
    });

    test.skip("fails if tries to set invalid value", () => {});
  });

  describe("focused expense date", () => {
    test("has default value if no previous state", () => {
      const form = createForm();
      expect(form.loadedExpense.date).toEqual(mockNow());
    });

    test("has previous state value if previous state exists", () => {
      const previous = generateFormState();
      const date = new Date(2021, 1, 2, 3, 4, 5);
      previous.expenses[0].date = date;
      const form = createForm({ previousState: previous });
      expect(form.loadedExpense.date).toEqual(date);
    });

    test("updates value", () => {
      const form = createForm();
      const date = new Date(2022, 1, 2, 0, 2, 3, 456);
      form.setDate(date);
      expect(form.loadedExpense.date).toEqual(date);
      expect((realStorage.form.read() as any).expenses[0].date).toEqual(
        date.toISOString()
      );
    });

    test.skip("fails if tries to set invalid value", () => {});
  });

  describe("focused expense amount", () => {
    test("has default value if no previous state", () => {
      const form = createForm();
      expect(form.loadedExpense.amount).toEqual(undefined);
    });

    test("has previous state value if previous state exists", () => {
      const previous = generateFormState();
      previous.expenses[0].amount = 1234.56;
      const form = createForm({ previousState: previous });
      expect(form.loadedExpense.amount).toEqual(1234.56);
    });

    test("updates value to number and then undefined", () => {
      const form = createForm();

      form.setAmount(12.34);
      expect(form.loadedExpense.amount).toEqual(12.34);
      expect((realStorage.form.read() as any).expenses[0].amount).toEqual(
        12.34
      );

      form.setAmount(undefined);
      expect(form.loadedExpense.amount).toEqual(undefined);
      expect((realStorage.form.read() as any).expenses[0].amount).toEqual(
        undefined
      );
    });

    test.skip("fails if tries to set invalid value", () => {});
  });

  describe("focused expense currency", () => {
    test("has default value if no previous state", () => {
      const form = createForm();
      expect(form.loadedExpense.currency).toEqual(DEFAULT_CURRENCY);
    });

    test("has previous state value if previous state exists", () => {
      const previous = generateFormState();
      previous.expenses[0].currency = "ABC";
      const form = createForm({ previousState: previous });
      expect(form.loadedExpense.currency).toEqual("ABC");
    });

    test("updates value", () => {
      const form = createForm();

      form.setCurrency("ABC");
      expect(form.loadedExpense.currency).toEqual("ABC");
      expect((realStorage.form.read() as any).expenses[0].currency).toEqual(
        "ABC"
      );
    });

    test.skip("fails if tries to set invalid value", () => {});
  });

  describe("focused expense description", () => {
    test("has default value if no previous state", () => {
      const form = createForm();
      expect(form.loadedExpense.description).toEqual(undefined);
    });

    test("has previous state value if previous state exists", () => {
      const previous = generateFormState();
      previous.expenses[0].description = "foo";
      const form = createForm({ previousState: previous });
      expect(form.loadedExpense.description).toEqual("foo");
    });

    test("updates value", () => {
      const form = createForm();
      expect(form.loadedExpense.description).toEqual(undefined);

      // write any text
      form.setDescription("foo");
      expect(form.loadedExpense.description).toEqual("foo");
      expect((realStorage.form.read() as any).expenses[0].description).toEqual(
        "foo"
      );

      // delete text
      form.setDescription(undefined);
      expect(form.loadedExpense.description).toEqual(undefined);
      expect((realStorage.form.read() as any).expenses[0].description).toEqual(
        undefined
      );
    });

    test.skip("fails if tries to set invalid value", () => {});
  });

  describe("focused expense shared", () => {
    test("has default value if no previous state", () => {
      const form = createForm();
      expect(form.loadedExpense.shared).toEqual(false);
    });

    test("has previous state value if previous state exists", () => {
      const previous = generateFormState();
      previous.expenses[0].shared = true;
      const form = createForm({ previousState: previous });
      expect(form.loadedExpense.shared).toEqual(true);
    });

    test("updates value", () => {
      const form = createForm();
      expect(form.loadedExpense.shared).toEqual(false);

      form.setShared(true);

      expect(form.loadedExpense.shared).toEqual(true);
      expect((realStorage.form.read() as any).expenses[0].shared).toEqual(true);
    });

    test.skip("fails if tries to set invalid value", () => {});
  });

  describe("focused expense status", () => {
    test("has default value if no previous state", () => {
      const form = createForm();
      expect(form.loadedExpense.status).toEqual(ExpenseStatus.Draft);
    });

    test("has previous state value if previous state exists", () => {
      const previous = generateFormState();
      previous.expenses[0].status = ExpenseStatus.Editing;
      const form = createForm({ previousState: previous });
      expect(form.loadedExpense.status).toEqual(ExpenseStatus.Editing);
    });

    test("updates value", () => {
      const form = createForm();
      expect(form.loadedExpense.status).toEqual(ExpenseStatus.Draft);

      form.setStatus(ExpenseStatus.Submitted);

      expect(form.loadedExpense.status).toEqual(ExpenseStatus.Submitted);
      expect((realStorage.form.read() as any).expenses[0].status).toEqual(
        "SUBMITTED"
      );
    });

    test.skip("fails if tries to set invalid value", () => {});
  });

  describe("add new expense", () => {
    test("expenses are in chronological order", () => {
      const t1 = new Date("2000-02-01T01:00:00Z");
      const t2 = new Date("2000-02-01T01:03:00Z");
      const t3 = new Date("2000-02-01T01:07:00Z");
      const defaultExpenseValues = {
        paidWith: "foo-account",
        amount: 1,
        currency: "GBP",
        description: undefined,
        pending: false,
        shared: false,
        status: ExpenseStatus.Draft,
      };
      const form = createForm({
        previousState: {
          expenses: [
            { date: t1, ...defaultExpenseValues },
            { date: t3, ...defaultExpenseValues },
          ],
          loaded: 1,
        },
      });
      const newExpense = { date: t2, ...defaultExpenseValues };

      form.addExpense(newExpense);

      expect(form.state).toEqual({
        expenses: [
          { date: t1, ...defaultExpenseValues },
          { date: t2, ...defaultExpenseValues },
          { date: t3, ...defaultExpenseValues },
        ],
        loaded: 2, // <-- `loaded` index also adjusts because expenses get sorted
      });
    });
    test("fail if new expense status is not draft", () => {
      const form = createForm();

      expect(() => {
        form.addExpense({
          paidWith: "foo-account",
          date: mockNow(),
          amount: 1,
          currency: "GBP",
          description: undefined,
          pending: false,
          shared: false,
          status: ExpenseStatus.Submitted, // <-- wrong! should be Draft
        });
      }).toThrowError(InvalidExpenseStatus);
    });
  });

  describe("draft expense is submitted", () => {
    test(`expense status changes to ${ExpenseStatus.Submitting}`, () => {});
    test(`hasura client requests to add a new expense`, () => {});
  });

  describe(`expense submission succeeds`, () => {
    test(`expense status changes to ${ExpenseStatus.Submitted}`, () => {});
  });

  describe(`expense submission fails`, () => {
    test(`expense status changes to ${ExpenseStatus.Draft}`, () => {});
  });

  describe(`submitted expense is edited`, () => {
    test(`expense status changes to ${ExpenseStatus.Editing}`, () => {});
  });

  describe(`changes in edited expense are discarded`, () => {
    test(`expense status changes to ${ExpenseStatus.Submitted}`, () => {});
  });

  describe(`edited expense is submitted`, () => {
    test(`expense status changes to ${ExpenseStatus.Updating}`, () => {});
    test(`hasura client requests to mutate the existing expense`, () => {});
  });

  describe(`expense update succeeds`, () => {
    test(`expense status changes to ${ExpenseStatus.Submitted}`, () => {});
  });

  describe(`expense update fails`, () => {
    test(`expense status changes to ${ExpenseStatus.Editing}`, () => {});
  });

  describe(`submitted expense is deleted`, () => {
    test(`expense status changes to ${ExpenseStatus.Deleting}`, () => {});
  });

  describe(`submitted expense deletion succeeds`, () => {
    test(`expense is not present anymore`, () => {});
  });

  describe(`submitted expense deletion fails`, () => {
    test(`expense status changes to ${ExpenseStatus.Submitted}`, () => {});
  });

  describe("remove expense by index", () => {
    test("expenses are in chronological order", () => {
      const t1 = new Date("2000-02-01T01:00:00Z");
      const t2 = new Date("2000-02-01T01:03:00Z");
      const t3 = new Date("2000-02-01T01:07:00Z");
      const defaultExpenseValues = {
        paidWith: "foo-account",
        amount: 1,
        currency: "GBP",
        description: undefined,
        pending: false,
        shared: false,
        status: ExpenseStatus.Draft,
      };
      const form = createForm({
        previousState: {
          expenses: [
            { date: t1, ...defaultExpenseValues },
            { date: t2, ...defaultExpenseValues },
            { date: t3, ...defaultExpenseValues },
          ],
          loaded: 1,
        },
      });

      const oldest = 0;
      form.removeExpenseByIndex(oldest);

      expect(form.state).toEqual({
        expenses: [
          { date: t2, ...defaultExpenseValues },
          { date: t3, ...defaultExpenseValues },
        ],
        loaded: 0, // <-- `loaded` index also adjusts because expenses are shifted
      });
    });

    test.skip("what happens if you try to remove the loaded expense?", () => {});
  });

  describe("deserialize expense status", () => {
    test("works with valid value", () => {
      expect(() =>
        deserializeExpenseStatus(ExpenseStatus.Draft)
      ).not.toThrowError();
    });
    test("fails with invalid value", () => {
      expect(() => deserializeExpenseStatus("foo")).toThrowError(
        InvalidExpenseStatus
      );
    });
  });
});
