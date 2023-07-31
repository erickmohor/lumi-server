export class EnergyBillAlreadyExistsError extends Error {
  constructor() {
    super('Invoice number already exists for this user.')
  }
}