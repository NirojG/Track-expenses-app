import assert from 'node:assert/strict';
import test from 'node:test';
import { isValidDate, parseAmount, validateExpense, type ExpenseDraft } from '../src/features/expenses/model.ts';

test('amounts preserve cents without floating-point rounding', () => {
  assert.equal(parseAmount('0.29'), 29);
  assert.equal(parseAmount('12,50'), 1250);
  assert.equal(parseAmount('15'), 1500);
  assert.equal(parseAmount('1.5'), 150);
  for (const value of ['0', '-5', 'NaN', '1.234', '1,000', '1e4', '', '100000000']) assert.equal(parseAmount(value), null);
});

test('calendar dates reject impossible dates and support leap years', () => {
  assert.equal(isValidDate('2024-02-29'), true);
  for (const date of ['2025-02-29', '2026-04-31', '2026-13-01', '26-01-01']) assert.equal(isValidDate(date), false);
});

test('expense validation prevents invalid money and empty descriptions', () => {
  const draft: ExpenseDraft = { amountCents: 100, currency: 'EUR', description: 'Coffee', merchant: '', category: 'Food & drink', date: '2026-11-16' };
  assert.doesNotThrow(() => validateExpense(draft));
  assert.throws(() => validateExpense({ ...draft, amountCents: 1.5 }));
  assert.throws(() => validateExpense({ ...draft, description: ' ' }));
  assert.throws(() => validateExpense({ ...draft, date: '2026-02-30' }));
});
