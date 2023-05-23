import { Expense, ExpenseId } from "./model";
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import {
  DocumentData,
  DocumentReference,
  Firestore,
  deleteDoc,
  doc,
  getFirestore,
  setDoc,
  writeBatch,
} from "firebase/firestore";

export class FirestoreClient {
  private expenseCollection: string;
  private app: FirebaseApp;
  private db: Firestore;

  constructor({ config }: { config: FirebaseOptions }) {
    this.expenseCollection = "expenses";
    this.app = initializeApp(config);
    this.db = getFirestore(this.app);
  }

  public async addExpense(expense: Expense): Promise<void> {
    console.debug(`FirestoreClient.addExpense::`, expense);
    const ref = this.getExpenseDocRef(expense.id);
    await setDoc(ref, expense);
    console.debug(`FirestoreClient.addExpense::completed without error`);
  }

  public async deleteExpense(expenseId: ExpenseId): Promise<void> {
    console.debug(`FirestoreClient.deleteExpense::expenseId=`, expenseId);
    const ref = this.getExpenseDocRef(expenseId);
    await deleteDoc(ref);
    console.debug(`FirestoreClient.deleteExpense:: completed without error`);
  }

  public async setAll(expenses: Expense[]): Promise<void> {
    const batch = writeBatch(this.db);
    expenses.map(dropUndefinedFields).forEach((expense) => {
      const ref = this.getExpenseDocRef(expense.id);
      batch.set(ref, expense);
    });
    await batch.commit();
  }

  private getExpenseDocRef(expenseId: ExpenseId): DocumentReference<DocumentData> {
    return doc(this.db, this.expenseCollection, expenseId);
  }
}

function dropUndefinedFields(expense: Expense): any {
  return Object.entries(expense)
    .filter(([key, value]) => value !== undefined)
    .reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {} as any);
}
