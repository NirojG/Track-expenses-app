import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ExpenseRepository, type Database } from '../src/storage/repository.ts';
import type { ExpenseDraft } from '../src/features/expenses/model.ts';

const draft: ExpenseDraft = { amountCents: 450, currency: 'EUR', description: "Coffee at O'Brien", merchant: "O'Brien", category: 'Food & drink', date: '2026-11-16' };
function adapter(db: DatabaseSync): Database {
  return {
    async execAsync(sql) { db.exec(sql); },
    async runAsync(sql, ...params) { return db.prepare(sql).run(...params); },
    async getAllAsync<T>(sql: string, ...params: (string | number | null)[]) { return db.prepare(sql).all(...params) as T[]; },
  };
}

test('persists expenses across reopen, migrates once, and safely binds apostrophes', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'expense-test-'));
  const path = join(directory, 'expenses.db');
  let db = new DatabaseSync(path);
  try {
    let repo = new ExpenseRepository(adapter(db));
    await repo.initialize();
    await repo.initialize();
    await repo.add([draft]);
    db.close();
    db = new DatabaseSync(path);
    repo = new ExpenseRepository(adapter(db));
    await repo.initialize();
    assert.equal((await repo.list())[0].merchant, "O'Brien");
  } finally { db.close(); rmSync(directory, { recursive: true }); }
});

test('supports batch save, edit, delete, and undo without changing identifiers', async () => {
  const db = new DatabaseSync(':memory:');
  try {
    const repo = new ExpenseRepository(adapter(db));
    await repo.initialize();
    const added = await repo.add([draft, { ...draft, amountCents: 100 }]);
    assert.equal(added.expenses.length, 2);
    const id = added.expenses[0].id;
    const edited = await repo.update(id, { ...draft, amountCents: 700 });
    assert.equal(edited.expenses.find((e) => e.id === id)?.amountCents, 700);
    assert.equal((await repo.undo(edited.undo)).find((e) => e.id === id)?.amountCents, added.expenses[0].amountCents);
    const removed = await repo.remove([id]);
    assert.equal(removed.expenses.length, 1);
    assert.equal((await repo.undo(removed.undo)).length, 2);
    assert.equal((await repo.undo(added.undo)).length, 0);
  } finally { db.close(); }
});

test('rolls back a partially inserted batch when storage fails', async () => {
  const db = new DatabaseSync(':memory:');
  const driver = adapter(db);
  const original = driver.getAllAsync.bind(driver);
  let inserts = 0;
  driver.getAllAsync = async <T>(sql: string, ...params: (string | number | null)[]) => {
    if (sql.startsWith('INSERT') && ++inserts === 2) throw new Error('Simulated disk failure');
    return original<T>(sql, ...params);
  };
  try {
    const repo = new ExpenseRepository(driver);
    await repo.initialize();
    await assert.rejects(repo.add([draft, draft]), /disk failure/);
    assert.deepEqual(await repo.list(), []);
    await repo.add([draft]);
    assert.equal((await repo.list()).length, 1);
  } finally { db.close(); }
});

test('serializes concurrent saves and rejects invalid writes', async () => {
  const db = new DatabaseSync(':memory:');
  try {
    const repo = new ExpenseRepository(adapter(db));
    await repo.initialize();
    await Promise.all([repo.add([draft]), repo.add([draft])]);
    assert.equal((await repo.list()).length, 2);
    await assert.rejects(repo.add([{ ...draft, amountCents: -1 }]));
    await assert.rejects(repo.update('missing', draft));
    assert.equal((await repo.list()).length, 2);
  } finally { db.close(); }
});
