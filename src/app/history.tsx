import { useState } from 'react';
import { Stack } from 'expo-router';
import { Text } from 'react-native';
import { Screen } from '@/components/screen';
import { SaveNotice } from '@/components/save-notice';
import { DeleteExpense } from '@/components/delete-expense';
import { RouteLink } from '@/components/route-link';
import { Card, Choices, Field, ui } from '@/components/ui';
import { categories, formatMoney } from '@/features/expenses/model';
import { searchExpenses } from '@/features/expenses/summary';
import { useExpenses } from '@/storage/expense-context';

const filters = ['All', ...categories] as const;

export default function HistoryScreen() {
  const { expenses } = useExpenses();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof filters)[number]>('All');
  const results = searchExpenses(expenses, query, category);

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Expense history' }} />
      <SaveNotice />
      <Field label="Search expenses" placeholder="Description, merchant, or amount" value={query} onChangeText={setQuery} />
      <Choices label="Category" values={filters} value={category} onChange={setCategory} />
      {results.length === 0 ? <Text style={ui.body}>{expenses.length ? 'No matching expenses.' : 'No expenses yet.'}</Text> : null}
      {results.map((expense) => (
        <Card key={expense.id}>
          <Text style={ui.heading}>{expense.description}</Text>
          <Text style={ui.body}>{formatMoney(expense.amountCents, expense.currency)} · {expense.date} · {expense.category}</Text>
          {expense.merchant ? <Text style={ui.body}>{expense.merchant}</Text> : null}
          <RouteLink href={{ pathname: '/expense/edit', params: { id: expense.id } }} label="Edit expense" />
          <DeleteExpense id={expense.id} />
        </Card>
      ))}
      <RouteLink href="/record/type" label="Type expense" />
    </Screen>
  );
}
