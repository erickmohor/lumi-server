export class UnableToReadThePdfError extends Error {
  constructor() {
    super('Unable to read the pdf.')
  }
}