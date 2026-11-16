import { useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from 'react-native';
import { Screen } from '@/components/screen';
import { RouteLink } from '@/components/route-link';
import { SaveNotice } from '@/components/save-notice';
import { Button, Choices, Field, ui } from '@/components/ui';
import { categories, currencies, parseAmount, validateExpense, type Expense } from '@/features/expenses/model';
import { useExpenses } from '@/storage/expense-context';

export default function ExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { expenses } = useExpenses();
  const expense = expenses.find((record) => record.id === id);

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Edit expense' }} />
      <SaveNotice />
      {expense ? <Editor key={expense.id} expense={expense} /> : <Text style={ui.body}>Expense unavailable.</Text>}
      <RouteLink href="/history" label="Expense history" replace />
    </Screen>
  );
}

function Editor({ expense }: { expense: Expense }) {
  const router = useRouter();
  const { update, busy } = useExpenses();
  const [draft, setDraft] = useState(expense);
  const [amount, setAmount] = useState((expense.amountCents / 100).toFixed(2));
  const [error, setError] = useState('');

  async function save() {
    const amountCents = parseAmount(amount);
    if (amountCents === null) {
      setError('Enter a positive amount with up to two decimal places.');
      return;
    }
    const updated = { ...draft, amountCents };
    try {
      validateExpense(updated);
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : 'Check the expense details.');
      return;
    }
    setError('');
    if (await update(expense.id, updated)) {
      if (router.canGoBack()) router.back();
      else router.replace('/history');
    }
  }

  return (
    <>
      <Field label="Description" value={draft.description} maxLength={300} onChangeText={(description) => setDraft({ ...draft, description })} />
      <Field label="Merchant (optional)" value={draft.merchant} maxLength={100} onChangeText={(merchant) => setDraft({ ...draft, merchant })} />
      <Field label="Amount" value={amount} keyboardType="decimal-pad" onChangeText={setAmount} />
      <Field label="Date (YYYY-MM-DD)" value={draft.date} maxLength={10} onChangeText={(date) => setDraft({ ...draft, date })} />
      <Choices label="Currency" values={currencies} value={draft.currency} onChange={(currency) => setDraft({ ...draft, currency })} />
      <Choices label="Category" values={categories} value={draft.category} onChange={(category) => setDraft({ ...draft, category })} />
      {error ? <Text accessibilityRole="alert" style={ui.error}>{error}</Text> : null}
      <Button title="Save changes" disabled={busy} onPress={() => { void save(); }} />
    </>
  );
}
