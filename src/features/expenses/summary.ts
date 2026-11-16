import { categories, localDate, type Currency, type Expense } from './model.ts';

export function summarize(expenses: Expense[], currency: Currency, now = new Date()) {
  const today = localDate(now);
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (now.getDay() + 6) % 7, 12);
  const weekStart = localDate(monday);
  const monthStart = today.slice(0, 7) + '-01';
  const eligible = expenses.filter((expense) => expense.currency === currency && expense.date <= today);
  const sumFrom = (date: string) => eligible.filter((e) => e.date >= date).reduce((sum, e) => sum + e.amountCents, 0);
  const month = eligible.filter((e) => e.date >= monthStart);
  const categoryTotals = categories.map((category) => ({ category, cents: month.filter((e) => e.category === category).reduce((sum, e) => sum + e.amountCents, 0) })).filter((item) => item.cents > 0).sort((a, b) => b.cents - a.cents);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = localDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6 + index, 12));
    return { date, cents: eligible.filter((e) => e.date === date).reduce((sum, e) => sum + e.amountCents, 0) };
  });
  return { today: sumFrom(today), week: sumFrom(weekStart), month: sumFrom(monthStart), categories: categoryTotals, days };
}

export function searchExpenses(expenses: Expense[], query: string, category = 'All'): Expense[] {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return expenses.filter((expense) => {
    const searchable = `${expense.description} ${expense.merchant} ${expense.category} ${expense.date} ${expense.currency} ${(expense.amountCents / 100).toFixed(2)}`.toLocaleLowerCase();
    return (category === 'All' || expense.category === category) && words.every((word) => searchable.includes(word));
  });
}
