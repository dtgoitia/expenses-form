import {
  CurrencyAmount,
  CurrencyCode,
  DraftExpense,
  PersonName,
  Split,
} from "../../../domain/model";
import { App } from "../../../domain/app";
import { SplitsForm } from "../../../components/ExpenseEditor/Splits/SplitsForm";
import { useEffect, useState } from "react";
import { unreachable } from "../../../lib/devex";
import { Button } from "../../../components/Button";

interface Props {
  app: App;
  expense: DraftExpense;
  onUpdate: (expense: DraftExpense) => void;
}

export function ExpenseSplitsEditor({ app, expense, onUpdate: update }: Props) {
  function getPotentialParticipants(app: App): PersonName[] {
    return app.peopleManager.getAll().map((person) => person.name);
  }

  const [people, setPeople] = useState<PersonName[]>(getPotentialParticipants(app));
  const [amount, setAmount] = useState<CurrencyAmount | undefined>(
    inferAmountFromExpense(expense)
  );
  const [splits, setSplits] = useState<Split[]>(expense.splits);

  useEffect(() => {
    const peopleSubscription = app.peopleManager.change$.subscribe((_) => {
      setPeople(getPotentialParticipants(app));
    });

    setPeople(getPotentialParticipants(app));

    return () => {
      peopleSubscription.unsubscribe();
    };
  }, [app]);

  useEffect(() => {
    setAmount(inferAmountFromExpense(expense));
  }, [expense.amount]);

  useEffect(() => {
    setSplits(expense.splits);
  }, [expense.splits]);

  function handleSplitsChange(splits: Split[]): void {
    console.debug(`ExpenseSplitsEditor::handleSplitsChange::expense`, expense);
    const updated = { ...expense, splits };
    app.expenseManager.update(updated);
  }

  function handleAmountSelection(amount: CurrencyAmount): void {
    console.debug(`>> ExpenseSplits.Editor.handleAmountSelection::amount: ${amount}`);
    setAmount(amount);
    const updatedSplits = resetSplits(splits);
    console.log(
      `>> ExpenseSplits.Editor.handleAmountSelection::updatedSplits:`,
      JSON.stringify(updatedSplits)
    );
    setSplits(updatedSplits);
    handleSplitsChange(updatedSplits);
  }

  if (expense.shared === false) {
    return (
      <div>
        To assign splits, the expense <code>{expense.id}</code> is must be marked as
        "shared", and it's not.
      </div>
    );
  }

  const scenario = identifyScenario({
    amountInAccountCurrency: expense.amount,
    amountInMerchantCurrency: expense.originalAmount,
    merchantCurrency: expense.originalCurrency,
  });

  return (
    <>
      <div role="payment-currency-selector">
        <PaymentCurrencySelector
          scenario={scenario}
          selectedAmount={amount}
          amountInAccountCurrency={expense.amount}
          accountCurrency={expense.currency}
          amountInMerchantCurrency={expense.originalAmount}
          merchantCurrency={expense.originalCurrency}
          onSelect={handleAmountSelection}
        />
      </div>
      <div role="split-editor">
        {amount !== undefined && (
          <SplitsForm
            splits={splits}
            amount={amount}
            selectablePeople={people}
            onChange={handleSplitsChange}
          />
        )}
      </div>
    </>
  );
}

function inferAmountFromExpense(expense: DraftExpense): CurrencyAmount | undefined {
  const scenario = identifyScenario({
    amountInAccountCurrency: expense.amount,
    amountInMerchantCurrency: expense.originalAmount,
    merchantCurrency: expense.originalCurrency,
  });

  if (expense.splits.length === 0) {
    switch (scenario) {
      case "useAccountCurrency":
        return expense.amount as CurrencyAmount;
      case "useMerchantCurrency":
        return expense.originalAmount as CurrencyAmount;
      case "allowUserToChooseCurrency":
        return undefined;
      default:
        throw unreachable(
          `scenario=${scenario} - failed to infer amount from expense=${JSON.stringify(
            expense,
            null,
            2
          )}`
        );
    }
  }

  const amount = expense.splits
    .map((split) => split.paid || 0)
    .reduce((accumulated, paid) => accumulated + paid, 0);
  return amount;
}

function resetSplits(splits: Split[]): Split[] {
  return splits.map((split) => ({
    person: split.person,
    paid: undefined,
    owed: undefined,
  }));
}

function PaymentCurrencySelector({
  scenario,
  selectedAmount,
  amountInAccountCurrency,
  accountCurrency,
  amountInMerchantCurrency,
  merchantCurrency,
  onSelect: selectAmount,
}: {
  scenario: Scenario;
  selectedAmount: CurrencyAmount | undefined;
  amountInAccountCurrency: CurrencyAmount | undefined;
  accountCurrency: CurrencyCode;
  amountInMerchantCurrency: CurrencyAmount | undefined;
  merchantCurrency: CurrencyCode | undefined;
  onSelect: (amount: CurrencyAmount) => void;
}) {
  switch (scenario) {
    case "useAccountCurrency": {
      return `splitting ${amountInAccountCurrency} ${accountCurrency}`;
    }
    case "useMerchantCurrency":
      return `splitting ${amountInMerchantCurrency} ${merchantCurrency}`;
    case "allowUserToChooseCurrency": {
      if (amountInAccountCurrency === undefined) throw unreachable();
      if (amountInMerchantCurrency === undefined) throw unreachable();
      if (merchantCurrency === undefined) throw unreachable();
      return (
        <div className="flex flex-row justify-center gap-x-3">
          <Button
            key={`split-currency-${accountCurrency.toLowerCase()}`}
            text={`${amountInAccountCurrency} ${accountCurrency}`}
            onClick={() => selectAmount(amountInAccountCurrency)}
            disabled={selectedAmount === amountInAccountCurrency}
          />
          <Button
            key={`split-currency-${merchantCurrency.toLowerCase()}`}
            text={`${amountInMerchantCurrency} ${merchantCurrency}`}
            onClick={() => selectAmount(amountInMerchantCurrency)}
            disabled={selectedAmount === amountInMerchantCurrency}
          />
        </div>
      );
    }
  }
}

type Scenario =
  | "allowUserToChooseCurrency"
  | "useAccountCurrency"
  | "useMerchantCurrency"
  | "invalidAppState";

export function identifyScenario({
  amountInAccountCurrency,
  amountInMerchantCurrency,
  merchantCurrency,
}: {
  amountInAccountCurrency: CurrencyAmount | undefined;
  amountInMerchantCurrency: CurrencyAmount | undefined;
  merchantCurrency: CurrencyCode | undefined;
}): Scenario {
  const paidInDifferentCurrency = merchantCurrency !== undefined;

  if (paidInDifferentCurrency === false) {
    return "useAccountCurrency";
  }

  const accountAmountIsSet = amountInAccountCurrency !== undefined;
  const merchantAmountIsSet = amountInMerchantCurrency !== undefined;

  if (accountAmountIsSet) {
    if (merchantAmountIsSet) {
      return "allowUserToChooseCurrency";
    } else {
      return "useAccountCurrency";
    }
  } else {
    if (merchantAmountIsSet) {
      return "useMerchantCurrency";
    } else {
      return "invalidAppState"; // user should only be able to split once at least one amount is set
    }
  }
}
