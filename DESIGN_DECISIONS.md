user a adds

UI --> ExpenseManager.add()
ExpenseManager.changes$ --> LocalStorage.expenseManager.changes$ --> update localstorage
ExpenseManager.changes$ --> Hasura.expenseManager.changes$ --> call Hasura API
if fails?
how can the user retry?

UI state

- expenseManager.changes$ - status=saved to manager
- LocalStorage.changes$ - status=saved to localstorage
- API.changes$ - status=saved to API
- retryAPI(id: ExpenseId) -->

first stage, download csv - aseguras
second stage - con tranquilidad haces una API (p2p o DynamoDB, lo que sea)
