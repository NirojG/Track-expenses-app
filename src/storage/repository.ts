import { validateExpense, type Expense, type ExpenseDraft } from '../features/expenses/model.ts';

type Value = string | number | null;
export interface Database {
  execAsync(sql: string): Promise<void>;
  runAsync(sql: string, ...params: Value[]): Promise<unknown>;
  getAllAsync<T>(sql: string, ...params: Value[]): Promise<T[]>;
}
export type Change = { remove: string[]; restore: Expense[] };
export type Mutation = { expenses: Expense[]; undo: Change };

/** Serializes transactions so an unrelated async operation cannot join one. */
export class ExpenseRepository {
  private queue: Promise<unknown> = Promise.resolve();
  private db: Database;
  constructor(db: Database) { this.db = db; }

  private serial<T>(operation: () => Promise<T>): Promise<T> {
    const next = this.queue.then(operation);
    this.queue = next.catch(() => undefined);
    return next;
  }

  async initialize(): Promise<void> {
    return this.serial(async () => {
      const [version] = await this.db.getAllAsync<{ user_version: number }>('PRAGMA user_version');
      if (version.user_version > 1) throw new Error('This database needs a newer version of the app.');
      if (version.user_version === 1) return;
      await this.transaction(async () => {
        await this.db.execAsync(`
          CREATE TABLE expenses (
            id TEXT PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(16)))),
            amountCents INTEGER NOT NULL CHECK(amountCents > 0 AND amountCents <= 9999999999),
            currency TEXT NOT NULL CHECK(currency IN ('EUR','USD','GBP')),
            description TEXT NOT NULL,
            merchant TEXT NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            createdAt TEXT NOT NULL
          );
          CREATE INDEX expenses_date ON expenses(date DESC, createdAt DESC);
          PRAGMA user_version = 1;
        `);
      });
    });
  }

  private async transaction<T>(operation: () => Promise<T>): Promise<T> {
    await this.db.execAsync('BEGIN IMMEDIATE');
    try {
      const result = await operation();
      await this.db.execAsync('COMMIT');
      return result;
    } catch (error) {
      await this.db.execAsync('ROLLBACK');
      throw error;
    }
  }

  private read(): Promise<Expense[]> {
    return this.db.getAllAsync<Expense>('SELECT * FROM expenses ORDER BY date DESC, createdAt DESC, id DESC');
  }
  list(): Promise<Expense[]> { return this.serial(() => this.read()); }

  add(drafts: ExpenseDraft[]): Promise<Mutation> {
    return this.serial(async () => {
      if (!drafts.length || drafts.length > 20) throw new Error('Save between 1 and 20 expenses.');
      drafts.forEach(validateExpense);
      return this.transaction(async () => {
        const ids: string[] = [];
        for (const draft of drafts) {
          const [record] = await this.db.getAllAsync<{ id: string }>(
            'INSERT INTO expenses (amountCents,currency,description,merchant,category,date,createdAt) VALUES (?,?,?,?,?,?,?) RETURNING id',
            draft.amountCents, draft.currency, draft.description.trim(), draft.merchant.trim(), draft.category, draft.date, new Date().toISOString(),
          );
          ids.push(record.id);
        }
        return { expenses: await this.read(), undo: { remove: ids, restore: [] } };
      });
    });
  }

  update(id: string, draft: ExpenseDraft): Promise<Mutation> {
    return this.serial(async () => {
      validateExpense(draft);
      return this.transaction(async () => {
        const [old] = await this.db.getAllAsync<Expense>('SELECT * FROM expenses WHERE id = ?', id);
        if (!old) throw new Error('This expense no longer exists.');
        await this.db.runAsync('UPDATE expenses SET amountCents=?,currency=?,description=?,merchant=?,category=?,date=? WHERE id=?', draft.amountCents, draft.currency, draft.description.trim(), draft.merchant.trim(), draft.category, draft.date, id);
        return { expenses: await this.read(), undo: { remove: [id], restore: [old] } };
      });
    });
  }

  remove(ids: string[]): Promise<Mutation> {
    return this.serial(() => this.transaction(async () => {
      const old: Expense[] = [];
      for (const id of new Set(ids)) {
        const [record] = await this.db.getAllAsync<Expense>('SELECT * FROM expenses WHERE id=?', id);
        if (record) old.push(record);
        await this.db.runAsync('DELETE FROM expenses WHERE id=?', id);
      }
      return { expenses: await this.read(), undo: { remove: [], restore: old } };
    }));
  }

  undo(change: Change): Promise<Expense[]> {
    return this.serial(() => this.transaction(async () => {
      for (const id of change.remove) await this.db.runAsync('DELETE FROM expenses WHERE id=?', id);
      for (const record of change.restore) {
        validateExpense(record);
        await this.db.runAsync('INSERT INTO expenses (id,amountCents,currency,description,merchant,category,date,createdAt) VALUES (?,?,?,?,?,?,?,?)', record.id, record.amountCents, record.currency, record.description, record.merchant, record.category, record.date, record.createdAt);
      }
      return this.read();
    }));
  }
}
