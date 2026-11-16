import { useState } from 'react';
import { Stack } from 'expo-router';
import { Text } from 'react-native';
import { Screen } from '@/components/screen';
import { SaveNotice } from '@/components/save-notice';
import { Button, Card, Field, ui } from '@/components/ui';
import { formatMoney, type ExpenseDraft } from '@/features/expenses/model';
import { parseExpenses } from '@/features/expenses/parser';
import { useExpenses } from '@/storage/expense-context';

export default function TypeScreen() {
  const [note, setNote] = useState('');
  const [drafts, setDrafts] = useState<ExpenseDraft[]>([]);
  const [error, setError] = useState('');
  const { add, busy } = useExpenses();

  function review() {
    try {
      setDrafts(parseExpenses(note));
      setError('');
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : 'Check your expense note.');
    }
  }

  async function save() {
    if (await add(drafts)) {
      setDrafts([]);
      setNote('');
    }
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Type expense' }} />
      <SaveNotice />
      <Field label="Expense note" multiline maxLength={2000}
        placeholder="Paid €35 for groceries at Lidl yesterday"
        value={note} editable={!busy} onChangeText={(value) => {
          setNote(value);
          setDrafts([]);
          setError('');
        }} />
      <Text style={ui.body}>Include an amount and currency for each purchase. Separate purchases with a semicolon.</Text>
      {error ? <Text accessibilityRole="alert" style={ui.error}>{error}</Text> : null}
      <Button title="Review expenses" disabled={busy || !note.trim()} onPress={review} />
      {drafts.map((draft, index) => (
        <Card key={index}>
          <Text style={ui.heading}>{formatMoney(draft.amountCents, draft.currency)}</Text>
          <Text style={ui.label}>{draft.description}</Text>
          <Text style={ui.body}>{draft.category} · {draft.date}</Text>
        </Card>
      ))}
      {drafts.length > 0 ? <Button title={drafts.length === 1 ? 'Save expense' : 'Save expenses'}
        disabled={busy} onPress={() => { void save(); }} /> : null}
    </Screen>
  );
}
