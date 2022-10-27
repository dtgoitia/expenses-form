import { Expense } from "./model";
import * as axios from "axios";

interface transferToLaptopArgs {
  url: string;
  expenses: Expense[];
}
interface Result {
  success: boolean;
}
export async function postExpensesToLaptop({
  url,
  expenses,
}: transferToLaptopArgs): Promise<Result> {
  const fullUrl = `${url}/expenses`;
  console.dir(fullUrl);
  const result = await axios.default.post(fullUrl, expenses);
  const success = result.status === 200;
  if (success === false) {
    console.dir(result);
  }
  return { success };
}
