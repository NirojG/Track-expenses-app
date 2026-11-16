import { useState } from 'react';
import { Text, View } from 'react-native';
import { Screen } from '@/components/screen';
import { RouteLink } from '@/components/route-link';
import { SaveNotice } from '@/components/save-notice';
import { Card, Choices, ui } from '@/components/ui';
import { currencies, formatMoney, type Currency } from '@/features/expenses/model';
import { summarize } from '@/features/expenses/summary';
import { useExpenses } from '@/storage/expense-context';

export default function HomeScreen() {
  const { expenses } = useExpenses();
  const [currency, setCurrency] = useState<Currency>('EUR');
  const summary = summarize(expenses, currency);
  const peak = Math.max(1, ...summary.days.map((day) => day.cents));

  return (
    <Screen>
      <Text accessibilityRole="header" style={ui.title}>Spending overview</Text>
      <SaveNotice />
      <RouteLink href="/record/type" label="Type expense" />
      <Choices label="Summary currency" values={currencies} value={currency} onChange={setCurrency} />
      <Card>
        <Text style={ui.label}>This month</Text>
        <Text style={ui.title}>{formatMoney(summary.month, currency)}</Text>
        <Text style={ui.body}>Today {formatMoney(summary.today, currency)} · This week {formatMoney(summary.week, currency)}</Text>
      </Card>
      <Card>
        <Text accessibilityRole="header" style={ui.heading}>This month by category</Text>
        {summary.categories.length === 0 ? <Text style={ui.body}>No spending in {currency} this month.</Text> : null}
        {summary.categories.map(({ category, cents }) => (
          <Text key={category} style={ui.body}>{category} · {formatMoney(cents, currency)}</Text>
        ))}
      </Card>
      <Card>
        <Text accessibilityRole="header" style={ui.heading}>Last seven days</Text>
        {summary.days.map(({ date, cents }) => (
          <View key={date} style={ui.stack}>
            <Text style={ui.body}>{date.slice(5)} · {formatMoney(cents, currency)}</Text>
            <View style={{ height: 5, backgroundColor: '#EAF0FF', borderRadius: 3 }}>
              <View style={{ height: 5, width: `${cents / peak * 100}%`, backgroundColor: '#2456D9', borderRadius: 3 }} />
            </View>
          </View>
        ))}
      </Card>
      <Card>
        <Text accessibilityRole="header" style={ui.heading}>Recent expenses</Text>
        {expenses.length === 0 ? <Text style={ui.body}>Your saved expenses will appear here.</Text> : null}
        {expenses.slice(0, 5).map((expense) => (
          <Text key={expense.id} style={ui.body}>{expense.description} · {formatMoney(expense.amountCents, expense.currency)}</Text>
        ))}
        <RouteLink href="/history" label="View history" />
      </Card>
      <RouteLink href="/record/scan" label="Scan receipt · Preview" />
      <RouteLink href="/record/voice" label="Record by voice · Preview" />
    </Screen>
  );
}
