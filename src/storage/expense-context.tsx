import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import type { Expense, ExpenseDraft } from '@/features/expenses/model';
import { Button, ui } from '@/components/ui';
import { getRepository } from './database';
import type { Change, ExpenseRepository, Mutation } from './repository';

type Store = {
  expenses: Expense[];
  busy: boolean;
  notice: string;
  error: string;
  canUndo: boolean;
  add: (drafts: ExpenseDraft[]) => Promise<boolean>;
  update: (id: string, draft: ExpenseDraft) => Promise<boolean>;
  remove: (ids: string[]) => Promise<boolean>;
  undo: () => Promise<boolean>;
  dismiss: () => void;
};
const Context = createContext<Store | null>(null);

export function ExpenseProvider({ children }: PropsWithChildren) {
  const repo = useRef<ExpenseRepository | null>(null);
  const locked = useRef(false);
  const previous = useRef<Change | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [canUndo, setCanUndo] = useState(false);

  useEffect(() => {
    let active = true;
    getRepository().then(async (repository) => {
      const records = await repository.list();
      if (active) { repo.current = repository; setExpenses(records); setReady(true); }
    }).catch(() => { if (active) setError('Could not open your local database. Retry without deleting your data. On web, use a browser that supports SQLite and cross-origin isolation.'); });
    return () => { active = false; };
  }, [attempt]);

  async function mutate(operation: (repository: ExpenseRepository) => Promise<Mutation>, message: string): Promise<boolean> {
    if (locked.current || !repo.current) return false;
    locked.current = true;
    setBusy(true);
    setError('');
    try {
      const result = await operation(repo.current);
      setExpenses(result.expenses);
      previous.current = result.undo;
      setCanUndo(true);
      setNotice(message);
      return true;
    } catch {
      setError('That change could not be saved. Please try again.');
      return false;
    } finally { locked.current = false; setBusy(false); }
  }

  async function undo(): Promise<boolean> {
    if (locked.current || !repo.current || !previous.current) return false;
    locked.current = true;
    setBusy(true);
    setError('');
    try {
      setExpenses(await repo.current.undo(previous.current));
      previous.current = null;
      setCanUndo(false);
      setNotice('Your last change was undone.');
      return true;
    } catch { setError('Undo could not be saved. Please try again.'); return false; }
    finally { locked.current = false; setBusy(false); }
  }

  if (!ready) return <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 16 }}><Text style={ui.heading}>Opening your expenses</Text>{error ? <><Text accessibilityRole="alert" style={ui.error}>{error}</Text><Button title="Retry" onPress={() => { setError(''); setAttempt((value) => value + 1); }} /></> : <ActivityIndicator accessibilityLabel="Loading expenses" />}</View>;

  return <Context.Provider value={{ expenses, busy, notice, error, canUndo, add: (drafts) => mutate((repository) => repository.add(drafts), `Saved ${drafts.length} expense${drafts.length === 1 ? '' : 's'}.`), update: (id, draft) => mutate((repository) => repository.update(id, draft), 'Expense updated.'), remove: (ids) => mutate((repository) => repository.remove(ids), `Deleted ${ids.length} expense${ids.length === 1 ? '' : 's'}.`), undo, dismiss: () => { setNotice(''); setError(''); } }}>{children}</Context.Provider>;
}

export function useExpenses(): Store {
  const store = useContext(Context);
  if (!store) throw new Error('ExpenseProvider is required.');
  return store;
}
