export class UnexpectedScenario extends Error {
  constructor(message: string) {
    super(message);

    // because we are extending a built-in class
    Object.setPrototypeOf(this, UnexpectedScenario.prototype);
  }
}
