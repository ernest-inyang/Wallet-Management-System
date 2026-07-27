import Decimal from 'decimal.js';

export class Money {
  static add(a: Decimal.Value, b: Decimal.Value): string {
    return new Decimal(a).plus(b).toFixed(2);
  }

  static subtract(a: Decimal.Value, b: Decimal.Value): string {
    return new Decimal(a).minus(b).toFixed(2);
  }

  static greaterThanOrEqual(
    a: Decimal.Value,
    b: Decimal.Value,
  ): boolean {
    return new Decimal(a).greaterThanOrEqualTo(b);
  }
}