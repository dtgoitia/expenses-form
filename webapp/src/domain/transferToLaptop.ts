import { errorsService } from "../services/errors";
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
  let success = false;

  try {
    const result = await axios.default.post(`${url}/expenses`, expenses);
    success = result.status === 200;
    if (success === false) {
      console.dir(result);
      errorsService.add({
        header: "Failed to POST expenses to server",
        description: JSON.stringify(result),
      });
    }
  } catch (error) {
    errorsService.add({
      header: "Failed to POST expenses to server",
      description: `${error}`,
    });
  }

  return { success };
}
