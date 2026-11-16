import assert from 'node:assert/strict';
import test from 'node:test';
import { parseExpenses } from '../src/features/expenses/parser.ts';
const now = new Date(2026, 0, 1, 12);

test('extracts merchant, category, amount, and yesterday across a year boundary', () => {
  const [expense] = parseExpenses('Paid €35 for groceries at Lidl yesterday.', now);
  assert.equal(expense.amountCents, 3500);
  assert.equal(expense.merchant, 'Lidl');
  assert.equal(expense.category, 'Groceries');
  assert.equal(expense.date, '2025-12-31');
});
test('supports multiple expenses and explicit currencies', () => {
  const result = parseExpenses('I spent 15 euros on groceries and 4 euros on coffee', now);
  assert.deepEqual(result.map((e) => e.amountCents), [1500, 400]);
  assert.deepEqual(result.map((e) => e.category), ['Groceries', 'Food & drink']);
  assert.deepEqual(parseExpenses('$12 lunch; £4 bus', now).map((e) => e.currency), ['USD', 'GBP']);
});
test('supports suffix amounts, decimal commas, and explicit dates', () => {
  assert.equal(parseExpenses('Bought groceries for 45 euros.', now)[0].amountCents, 4500);
  assert.equal(parseExpenses('Coffee €4,25 on 2024-02-29', now)[0].date, '2024-02-29');
});
test('rejects missing, ambiguous, negative, malformed, and partial amounts', () => {
  for (const input of ['coffee', 'coffee 4', '€4 coffee and groceries', '€-4 coffee', '-€4 coffee', '€0 coffee', '€1.234 coffee', '€1,000 coffee', '€4 coffee 5', '€4 coffee last Monday', '€4 coffee 2025-02-29']) assert.throws(() => parseExpenses(input, now), input);
});
