export const categories = ['Groceries', 'Food & drink', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'] as const;
export type Category = (typeof categories)[number];
export const currencies = ['EUR', 'USD', 'GBP'] as const;
export type Currency = (typeof currencies)[number];

export type ExpenseDraft = {
  amountCents: number;
  currency: Currency;
  description: string;
  merchant: string;
  category: Category;
  date: string;
};

export type Expense = ExpenseDraft & { id: string; createdAt: string };

export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1900 || year > 9999) return false;
  return localDate(new Date(year, month - 1, day, 12)) === value;
}

/** Parse a positive amount without floating-point multiplication or rounding. */
export function parseAmount(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  if (!/^\d{1,8}(?:\.\d{1,2})?$/.test(normalized)) return null;
  const [whole, fraction = ''] = normalized.split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return cents > 0 && Number.isSafeInteger(cents) ? cents : null;
}

export function validateExpense(draft: ExpenseDraft): void {
  if (!Number.isSafeInteger(draft.amountCents) || draft.amountCents <= 0 || draft.amountCents > 9999999999) throw new Error('Enter a positive amount with at most two decimal places.');
  if (!currencies.includes(draft.currency)) throw new Error('Choose EUR, USD, or GBP.');
  if (!categories.includes(draft.category)) throw new Error('Choose a valid category.');
  if (!isValidDate(draft.date)) throw new Error('Enter a real date in YYYY-MM-DD format.');
  if (!draft.description.trim() || draft.description.length > 300) throw new Error('Enter a description of 1–300 characters.');
  if (draft.merchant.length > 100) throw new Error('Keep the merchant name under 101 characters.');
}

export function formatMoney(cents: number, currency: Currency = 'EUR'): string {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency }).format(cents / 100);
}
