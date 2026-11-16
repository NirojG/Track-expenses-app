import assert from 'node:assert/strict';
import test from 'node:test';
import { summarize, searchExpenses } from '../src/features/expenses/summary.ts';
import type { Expense } from '../src/features/expenses/model.ts';
const base: Expense = { id: '1', amountCents: 100, description: 'Coffee', merchant: 'Cafe', currency: 'EUR', category: 'Food & drink', date: '2026-11-16', createdAt: '2026-11-16T12:00:00Z' };
test('summaries separate currencies, exclude future dates, and start weeks on Monday', () => {
  const summary = summarize([base, { ...base, id: '2', date: '2026-11-15', amountCents: 200 }, { ...base, id: '3', currency: 'USD', amountCents: 900 }, { ...base, id: '4', date: '2026-11-17' }, { ...base, id: '5', date: '2026-10-31' }], 'EUR', new Date(2026, 10, 16, 12));
  assert.equal(summary.today, 100);
  assert.equal(summary.week, 100);
  assert.equal(summary.month, 300);
  assert.equal(summary.categories[0].cents, 300);
  assert.equal(summary.days.length, 7);
  assert.equal(summary.days[6].cents, 100);
});
test('search combines case-insensitive words with category filtering', () => {
  assert.equal(searchExpenses([base], 'CAFE 1.00').length, 1);
  assert.equal(searchExpenses([base], 'coffee', 'Transport').length, 0);
  assert.equal(searchExpenses([base], '2026-11').length, 1);
  assert.equal(searchExpenses([base], 'missing').length, 0);
});
