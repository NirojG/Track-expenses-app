import { isValidDate, localDate, parseAmount, validateExpense, type Category, type Currency, type ExpenseDraft } from './model.ts';

const categoryWords: [Category, RegExp][] = [
  ['Groceries', /\b(grocer\w*|lidl|aldi|prisma|supermarket|s-market|k-market)\b/i],
  ['Food & drink', /\b(coffee|cafe|café|lunch|dinner|breakfast|restaurant|pizza|tea)\b/i],
  ['Transport', /\b(bus|train|tram|taxi|uber|transport|fuel|petrol|hsl|parking)\b/i],
  ['Bills', /\b(rent|electricity|internet|insurance|bill|utilities)\b/i],
  ['Health', /\b(pharmacy|medicine|doctor|dentist|health)\b/i],
  ['Entertainment', /\b(cinema|movie|concert|netflix|game|entertainment)\b/i],
  ['Shopping', /\b(shopping|clothes|shirt|shoes|book)\b/i],
];

export function categorize(text: string): Category {
  return categoryWords.find(([, pattern]) => pattern.test(text))?.[0] ?? 'Other';
}

const currencyCode = (token: string): Currency => /^(€|eur|euros?)$/i.test(token) ? 'EUR' : /^(\$|usd|dollars?)$/i.test(token) ? 'USD' : 'GBP';
const moneyPattern = /([€$£])\s*(\d+(?:[.,]\d+)?)|(\d+(?:[.,]\d+)?)\s*(euros?|eur|dollars?|usd|pounds?|gbp)\b/gi;

export function parseExpenses(input: string, now = new Date()): ExpenseDraft[] {
  if (!input.trim() || input.length > 2000) throw new Error('Enter a short expense note (up to 2,000 characters).');
  if (/[-−]\s*[€$£]?\s*\d|[€$£]\s*[-−]|\b(refund|refunded|income)\b/i.test(input.replace(/\b\d{4}-\d{2}-\d{2}\b/g, ''))) throw new Error('This version records positive expenses only.');
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 12);
  const sharedDate = /\byesterday\b/i.test(input) ? localDate(yesterday) : localDate(now);
  const parts = input.split(/\s+and\s+|[;\n]+/i).map((part) => part.trim()).filter(Boolean);
  if (parts.length > 20) throw new Error('Record up to 20 expenses at a time.');
  return parts.map((part, index) => {
    const fail = (message: string): never => { throw new Error(`Expense ${index + 1}: ${message}`); };
    const isoDates = part.match(/\b\d{4}-\d{2}-\d{2}\b/g) ?? [];
    if (isoDates.length > 1 || isoDates.some((date) => !isValidDate(date))) fail('use one real date in YYYY-MM-DD format.');
    if (/\b(last|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b|\d[/-]\d/i.test(part.replace(/\b\d{4}-\d{2}-\d{2}\b/g, ''))) fail('use today, yesterday, or YYYY-MM-DD for the date.');
    const matches = [...part.matchAll(moneyPattern)];
    if (matches.length !== 1) fail('include exactly one amount and currency, such as €12.50. Separate purchases with “and” or a semicolon.');
    const match = matches[0];
    const amountCents = parseAmount(match[2] ?? match[3]);
    if (amountCents === null) fail('use a positive amount with at most two decimal places, without thousands separators.');
    const currency = currencyCode(match[1] ?? match[4]);
    let description = part.replace(match[0], '').replace(/\b\d{4}-\d{2}-\d{2}\b/g, '').replace(/\b(today|yesterday)\b/gi, '').replace(/^[\s.,]*(?:i\s+)?(?:spent|paid|bought)\b/i, '').replace(/\b(on|for)\s*$/i, '').replace(/^\s*(?:on|for)\s+/i, '').replace(/\s+/g, ' ').replace(/^[\s.,]+|[\s.,]+$/g, '');
    if (/\d|[€$£]/.test(description)) fail('there are extra numbers or currency symbols. Use one amount per purchase.');
    const merchant = description.match(/\bat\s+(.+)$/i)?.[1]?.trim() ?? '';
    description = description || 'Expense';
    const draft: ExpenseDraft = { amountCents: amountCents!, currency, description, merchant, category: categorize(description), date: isoDates[0] ?? (/\btoday\b/i.test(part) ? localDate(now) : sharedDate) };
    validateExpense(draft);
    return draft;
  });
}
