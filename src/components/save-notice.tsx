import { Text } from 'react-native';
import { useExpenses } from '@/storage/expense-context';
import { Button, Card, ui } from './ui';

export function SaveNotice() {
  const { notice, error, busy, canUndo, undo, dismiss } = useExpenses();
  if (!notice && !error) return null;
  return <Card>
    {error ? <Text accessibilityRole="alert" style={ui.error}>{error}</Text> : null}
    {notice ? <Text accessibilityLiveRegion="polite" style={ui.body}>{notice}</Text> : null}
    {canUndo ? <Button title="Undo last change" disabled={busy} onPress={() => { void undo(); }} /> : null}
    <Button title="Dismiss message" secondary onPress={dismiss} />
  </Card>;
}
