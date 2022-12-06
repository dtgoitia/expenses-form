import { DEFAULT_PAYMENT_METHOD, PAYMENT_ACCOUNTS } from "../constants";
import storage from "../localStorage";
import { Account, AccountAlias, AccountId } from "./model";

const accountsById = new Map<AccountId, Account>();
const accountsByAlias = new Map<AccountAlias, Account>();
for (const account of PAYMENT_ACCOUNTS) {
  accountsById.set(account.id, account);
  accountsByAlias.set(account.alias, account);
}

export function getAccountById(id: AccountId): Account {
  const account = accountsById.get(id);
  if (account === undefined) {
    // TODO: return Result
    throw new Error(
      `Expected to find an account with ID='${id}', but none found`
    );
  }

  return account;
}

export function getAccountByAlias(alias: AccountAlias): Account {
  const account = accountsByAlias.get(alias);
  if (account === undefined) {
    // TODO: return Result
    throw new Error(
      `Expected to find an account with alias='${alias}', but none found`
    );
  }

  return account;
}

export function getInitialPaymentMethod(): Account {
  const alias = storage.defaultPaymentAccount.read() || DEFAULT_PAYMENT_METHOD;
  return getAccountByAlias(alias);
}
