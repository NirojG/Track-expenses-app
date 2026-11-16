import { ExpenseRepository } from './repository';

let pending: Promise<ExpenseRepository> | undefined;

export function getRepository(): Promise<ExpenseRepository> {
  if (!pending) {
    pending = (async () => {
      const { openDatabaseAsync } = await import('expo-sqlite');
      const db = await openDatabaseAsync('track-expenses.db');
      const repository = new ExpenseRepository(db);
      await repository.initialize();
      return repository;
    })().catch((error) => { pending = undefined; throw error; });
  }
  return pending;
}
