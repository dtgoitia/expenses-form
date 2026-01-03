import { Observable, Subject } from "rxjs";
import { unreachable } from "../lib/devex";
import { SortAction } from "../sort";
import { generatePrefixedId } from "./idGeneration";
import { DateISOString, DraftExpense, ExpenseId, Seller } from "./model";

export type AddExpenseArgs = Omit<DraftExpense, "id">;

/**
 * As opposed to `Expense` - which is a domain-only concept, agnostic to the expense
 * being successfully persisted or not -, the `AppExpense` is aware of the expense
 * lifecycle withing the application, e.g.: expense is draft, submitted, etc.
 */
export interface AppExpense {
  expense: DraftExpense;
  status: ExpenseStatus;
  readyToPublish: boolean;
}

export enum ExpenseStatus {
  local = "local",
  pushed = "pushed",
  changedSincePushed = "changedSincePushed",
}

export class ExpenseManager {
  public change$: Observable<ExpenseChange>;

  private changeSubject: Subject<ExpenseChange>;
  private expenses: Map<ExpenseId, AppExpense>;

  constructor() {
    this.changeSubject = new Subject<ExpenseChange>();
    this.change$ = this.changeSubject.asObservable();

    this.expenses = new Map<ExpenseId, AppExpense>();
  }

  public add(newExpense: AddExpenseArgs): void {
    console.debug(`ExpenseManager.add::newExpense:`, newExpense);
    const id = this.generateId();
    const expense: DraftExpense = { id, ...newExpense };

    const appExpense: AppExpense = {
      expense,
      status: ExpenseStatus.local,
      readyToPublish: false,
    };

    this.expenses.set(id, appExpense);
    this.changeSubject.next({ kind: "ExpenseAdded", expenseId: id });
  }

  public get(id: ExpenseId): AppExpense {
    const expense = this.expenses.get(id);
    if (expense === undefined) {
      throw new Error(
        `Expected a ${id} Expense ID in ${ExpenseManager.name}, but not found`
      );
    }

    return expense;
  }

  public getAll(): AppExpense[] {
    console.debug(`ExpenseManager.getAll()`);
    const appExpenses: AppExpense[] = [];
    for (const appExpense of this.expenses.values()) {
      appExpenses.push(appExpense);
    }

    return appExpenses.sort((a: AppExpense, b: AppExpense) => {
      return a.expense.datetime < b.expense.datetime
        ? SortAction.SwapOrder
        : SortAction.KeepOrder;
    });
  }

  public update(expense: DraftExpense): void {
    console.debug(`ExpenseManager.update::expense:`, expense);

    const { id } = expense;

    const previous = this.expenses.get(id);
    if (previous === undefined) {
      throw new Error(`Expected an Expense with ID ${id}, but none found.`);
    }

    const updated: AppExpense = {
      ...previous,
      expense,
      readyToPublish: isReadyToPublish(expense),
    };

    this.expenses.set(id, updated);
    this.changeSubject.next({ kind: "ExpenseUpdated", expenseId: id });
  }

  public delete(id: ExpenseId): void {
    console.debug(`ExpenseManager.delete::id=${id}`);
    this.expenses.delete(id);
    this.changeSubject.next({ kind: "ExpenseDeleted", expenseId: id });
  }

  public initialize({ appExpenses }: { appExpenses: AppExpense[] }): void {
    console.debug(`ExpenseManager.initialize::Starting initialization...`);

    const ids = new Set<ExpenseId>();
    appExpenses.forEach((appExpense) => {
      const id = appExpense.expense.id;

      if (ids.has(id)) {
        throw new Error(`IDs must be unique, and ${id} is repeated`);
      }

      ids.add(id);
      this.expenses.set(id, appExpense);
    });

    console.debug(`ExpenseManager.initialize::Run to completion`);
  }

  private generateId(): ExpenseId {
    return generatePrefixedId("exp");
  }
}

export class ExpenseDeleted {
  constructor(public readonly expenseId: ExpenseId) {}
}

type ExpenseChange =
  | { kind: "ExpenseAdded"; expenseId: ExpenseId }
  | { kind: "ExpenseUpdated"; expenseId: ExpenseId }
  | { kind: "ExpenseDeleted"; expenseId: ExpenseId };

function isReadyToPublish(draft: DraftExpense): boolean {
  if (draft.amount === undefined) {
    return false;
  }

  return true;
}

type ExpensesPerDay = [DateISOString, AppExpense[]];

export function groupExpensesByLocalDate(expenses: AppExpense[]): ExpensesPerDay[] {
  function getLocalDate(expense: AppExpense): DateISOString {
    return expense.expense.datetime.slice(0, 10);
  }

  const map = new Map<DateISOString, AppExpense[]>();

  for (const expense of expenses) {
    const date = getLocalDate(expense);
    const previous = map.get(date) || [];
    map.set(date, [...previous, expense]);
  }

  const dates = [...map.keys()].sort().reverse();

  return dates.map((date) => [date, map.get(date) as AppExpense[]]);
}

const VALID_CHARACTERS = new Set<string>(
  "abcçdefghijklmnñopqrstuvwxyz0123456789".split("")
);

export function formatSeller(raw: string): Seller {
  const EMPTY_STRING = "";
  const SINGLE_SPACE = " ";

  function isWeirdCharacter(character: string): boolean {
    return VALID_CHARACTERS.has(character.toLowerCase()) === false;
  }

  function weirdCharacterToSpace(character: string): string {
    return isWeirdCharacter(character) ? SINGLE_SPACE : character;
  }

  function toCamelCase(word: string): string {
    return word
      .split(EMPTY_STRING)
      .map((character, index) =>
        index === 0 ? character.toUpperCase() : character.toLowerCase()
      )
      .join(EMPTY_STRING);
  }

  function cleanChunk(chunk: string): string {
    return chunk
      .normalize("NFD") // split letters and diacritics
      .replace(/[\u0300-\u036f]/g, "") // remove diacritic marks
      .replaceAll("Đ", "d")
      .replaceAll("đ", "d")
      .replaceAll("&", "And")
      .split(EMPTY_STRING)
      .map(weirdCharacterToSpace)
      .join(EMPTY_STRING)
      .split(SINGLE_SPACE)
      .map(toCamelCase)
      .join(EMPTY_STRING);
  }

  const viaFound = raw.includes(" via ");
  const chunks = viaFound ? raw.split(" via ") : [raw];

  if (chunks.length === 0) throw unreachable("expected 1 or 2 chunks, but got 0");

  const cleanChunks = chunks.map(cleanChunk);
  switch (cleanChunks.length) {
    case 1:
      return cleanChunks[0];
    case 2:
      const [main, via] = cleanChunks;
      return `${main} (via @${via})`;
    default:
      throw unreachable(`expected 1 or 2 chunks, but got ${cleanChunks.length}`);
  }
}
