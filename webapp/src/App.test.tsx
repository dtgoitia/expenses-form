import App from "./App";
import { API_BASE_URL } from "./constants";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "@testing-library/jest-dom";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { graphql } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  // TODO: ensure you cl

  // TODO: how do you know against which URL is this request being matched? <=========
  graphql.query("GetExpenses", (req, res, ctx) => {
    return res(
      ctx.data({
        expenses: [
          {
            id: 1,
            amount: 1000.12,
            currency: "EUR",
            description: "Fooooo",
            datetime: "2020-01-01T00:00:00+00:00",
            __typename: "expenses",
          },
          {
            id: 2,
            amount: 12.34,
            currency: "GBP",
            description: "Groceries with @AngelaPerez at @Morrisons #groceries",
            datetime: "2022-01-25T14:18:15+00:00",
            __typename: "expenses",
          },
        ],
      })
    );
  })
);

// TODO: clear cache before each tests if you use graphql
// https://mswjs.io/docs/faq#apollo-client
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("User journey", () => {
  test("loads and displays greeting", async () => {
    const client = new ApolloClient({
      uri: `${API_BASE_URL}/graphql`,
      cache: new InMemoryCache(),
    });

    render(
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    );

    const spinner = screen.getByTestId("loading-expenses");
    expect(spinner).toHaveTextContent(
      "Loading submitted expenses from server..."
    );

    await waitFor(() => screen.getByTestId("expense-1"));
    // IT WORKS UNTIL HERE

    // TODO: assert list of submitted expenses is rendered after fetching

    // expect(screen.getByTestId("queued-expense-1")).not.toBeEmptyDOMElement();

    // TODO: type expense amoun
    // TODO: submit expense
    // TODO: see expencted response
  });
});
