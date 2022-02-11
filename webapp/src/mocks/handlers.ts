import { graphql } from "msw";

export const handlers = [
  graphql.mutation("AddExpense", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.data({
        insert_expenses: {
          returning: [
            {
              id: 236,
              __typename: "expenses",
            },
          ],
          __typename: "expenses_mutation_response",
        },
      })
    );
  }),
  graphql.query("GetExpenses", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.data({
        expenses: [
          {
            id: 168,
            amount: 4.0,
            currency: "GBP",
            description: "Lunch takeaway at @PizzaChicken #eatout #ocio",
            datetime: "2022-01-24T15:44:40+00:00",
            __typename: "expenses",
          },
          {
            id: 177,
            amount: 16.09,
            currency: "GBP",
            description: "Groceries with @AngelaPerez at @Morrisons #groceries",
            datetime: "2022-01-25T14:18:15+00:00",
            __typename: "expenses",
          },
          {
            id: 179,
            amount: 0.95,
            currency: "GBP",
            description: "Groceries with @AngelaPerez at @Tesco #groceries",
            datetime: "2022-01-25T14:57:07+00:00",
            __typename: "expenses",
          },
          {
            id: 178,
            amount: 100,
            currency: "GBP",
            description: "Fooooo",
            datetime: "2022-07-25T14:33:33+00:00",
            __typename: "expenses",
          },
        ],
      })
    );
  }),
];
