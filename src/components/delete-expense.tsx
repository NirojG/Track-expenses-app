import { useState } from 'react';
import { Text, View } from 'react-native';
import { useExpenses } from '@/storage/expense-context';
import { Button, ui } from './ui';

export function DeleteExpense({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const { remove, busy } = useExpenses();

  if (!confirming) {
    return <Button title="Delete expense" secondary disabled={busy} onPress={() => setConfirming(true)} />;
  }

  return (
    <View style={ui.stack}>
      <Text style={ui.body}>Delete this expense? You can undo the deletion until your next change or app restart.</Text>
      <View style={ui.row}>
        <Button title="Confirm deletion" danger disabled={busy} onPress={() => { void remove([id]); }} />
        <Button title="Cancel" secondary disabled={busy} onPress={() => setConfirming(false)} />
      </View>
    </View>
  );
}
