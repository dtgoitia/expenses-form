import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { NumericInput } from "./NumericInput";

let user: UserEvent;
let returnedValue: number | undefined;

function storeReturnedValue(x: number | undefined): void {
  returnedValue = x;
}

beforeEach(() => {
  user = userEvent.setup();
  returnedValue = undefined;
});

async function testCase(
  initial: number | undefined,
  typed: string,
  expectedReturnedValue: number | undefined,
  expectedValueInInput: string
): Promise<void> {
  render(<NumericInput value={initial} onChange={storeReturnedValue} />);
  const inputBox = screen.getByRole("textbox");
  await user.type(inputBox, typed);
  expect(returnedValue).toEqual(expectedReturnedValue);
  expect(screen.getByRole("textbox")).toHaveValue(expectedValueInInput);
}

describe("given no value", () => {
  it("when the user types a number, the number is appended to the integers", async () => {
    await testCase(undefined, "7", 7, "7");
  });
  it("when the user types '.', a leading zero is added", async () => {
    await testCase(undefined, ".", 0, "0.");
  });
  it("when the user types '-', a minus is shown but no value is emitted", async () => {
    await testCase(undefined, "-", undefined, "-");
  });
  it("when the user types many '.', only one leading zero and a '.' are shown", async () => {
    // preparation
    render(
      <NumericInput
        value={undefined}
        onChange={(value) => {
          returnedValue = value;
        }}
      />
    );
    const inputBox = screen.getByRole("textbox");
    await user.type(inputBox, ".");
    expect(returnedValue).toEqual(0);
    expect(screen.getByRole("textbox")).toHaveValue("0.");

    // test
    await user.type(inputBox, ".");
    expect(returnedValue).toEqual(undefined); // no changes are emitted
    expect(screen.getByRole("textbox")).toHaveValue("0.");
  });
});

describe("given a single digit integer", () => {
  it("when the user types a number, the number is appended to the integers", async () => {
    await testCase(1, "2", 12, "12");
  });
  it("when the user deletes the number, the input is empty", async () => {
    await testCase(1, "{backspace}", undefined, "");
  });
});

describe("given an integer >= 1,000", () => {
  it("when the user types a number, the number is appended to the integers", async () => {
    await testCase(1234, "5", 12345, "12,345");
  });
  it("when the user deletes a number, the last integer is dropped", async () => {
    await testCase(12345, "{backspace}", 1234, "1,234");
  });
  it("when the user types '.', the '.' is appended after the integers", async () => {
    await testCase(12345, ".", 12345, "12,345.");
  });
});

describe("given a number with a single-digit fraction", () => {
  it("when the user types a number, the number is appended to the fraction digits", async () => {
    await testCase(12.3, "4", 12.34, "12.34");
  });
  it("when the user types '.', no more '.' is added", async () => {
    await testCase(12.3, ".", 12.3, "12.3");
  });
  it("when the user presses delete, the last fraction digit is dropped and the decimal delimiter is preserved", async () => {
    await testCase(12.3, "{backspace}", 12, "12.");
  });
});

describe("given a number with a multi-digit fraction", () => {
  it("when the user types a number, the number is appended to the fraction digits", async () => {
    await testCase(12.345, "6", 12.3456, "12.3456");
  });
  it("when the user types a zero, the number is appended to the fraction digits", async () => {
    await testCase(12.345, "0", 12.345, "12.3450");
  });
  it("when the user types '.', no more '.' is added", async () => {
    await testCase(12.345, ".", 12.345, "12.345");
  });
  it("when the user presses delete, the last fraction digit is dropped", async () => {
    await testCase(12.345, "{backspace}", 12.34, "12.34");
  });
  it("when the user types '.' and a number, the last typed '.' is ignored but the numbers are added", async () => {
    // preparation
    render(
      <NumericInput
        value={12.345}
        onChange={(value) => {
          returnedValue = value;
        }}
      />
    );
    const inputBox = screen.getByRole("textbox");
    await user.type(inputBox, ".");
    expect(returnedValue).toEqual(12.345);
    expect(screen.getByRole("textbox")).toHaveValue("12.345");

    // test
    await user.type(inputBox, "0");
    expect(returnedValue).toEqual(12.345);
    expect(screen.getByRole("textbox")).toHaveValue("12.3450");
  });
});

describe("given a number with fraction delimiter (.) but no fraction digits", () => {
  let inputBox: HTMLElement;
  beforeEach(async () => {
    render(<NumericInput value={1234} onChange={storeReturnedValue} />);
    inputBox = screen.getByRole("textbox");
    await user.type(inputBox, ".");
    expect(returnedValue).toEqual(1234);
    expect(screen.getByRole("textbox")).toHaveValue("1,234.");
  });

  it("when the user types '.' again, no more '.' is added", async () => {
    await user.type(inputBox, ".");
    expect(returnedValue).toEqual(1234);
    expect(screen.getByRole("textbox")).toHaveValue("1,234.");
  });

  it("when the user types zero, a trailing zero is added", async () => {
    await user.type(inputBox, "0");
    expect(returnedValue).toEqual(1234);
    expect(screen.getByRole("textbox")).toHaveValue("1,234.0");
  });
});

describe("given a negative symbol without numbers", () => {
  let inputBox: HTMLElement;
  beforeEach(async () => {
    render(<NumericInput value={undefined} onChange={storeReturnedValue} />);
    inputBox = screen.getByRole("textbox");
    await user.type(inputBox, "-");
    expect(returnedValue).toEqual(undefined);
    expect(screen.getByRole("textbox")).toHaveValue("-");
  });

  it("when the user types a number, the number is appended to the integers", async () => {
    await user.type(inputBox, "6");
    expect(returnedValue).toEqual(-6);
    expect(screen.getByRole("textbox")).toHaveValue("-6");
  });

  it("when the user types '.', a zero is inserted between the '-' and the '.'", async () => {
    await user.type(inputBox, ".");
    expect(returnedValue).toEqual(0);
    expect(screen.getByRole("textbox")).toHaveValue("-0.");
  });
});

describe("given a single-digit negative integer", () => {
  it("when the user types a number, the number is appended to the integers", async () => {
    await testCase(-1, "2", -12, "-12");
  });
  it("when the user deletes the number, the input is empty", async () => {
    await testCase(-1, "{backspace}", undefined, "-");
  });
});

describe("given an integer <= -1,000", () => {
  it("when the user types a number, the number is appended to the integers", async () => {
    await testCase(-123, "4", -1234, "-1,234");
  });
  it("when the user deletes a number, the last integer is dropped", async () => {
    await testCase(-12345, "{backspace}", -1234, "-1,234");
  });
  it("when the user types '.', the '.' is appended after the integers", async () => {
    await testCase(-12345, ".", -12345, "-12,345.");
  });
});
