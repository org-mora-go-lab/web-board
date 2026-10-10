import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";

import initSqlJs, { type Database, type SqlValue } from "sql.js";

import { SCHEMA } from "./schema";

type Row = Record<string, SqlValue>;

export type Db = {
  all<T = Row>(sql: string, params?: SqlValue[]): T[];
  get<T = Row>(sql: string, params?: SqlValue[]): T | undefined;
  // Runs a write statement, persists the database file and returns the inserted row id.
  run(sql: string, params?: SqlValue[]): { lastInsertId: number; changes: number };
  // Runs `work` atomically and persists once at the end; `work` must stay synchronous.
  transaction<T>(work: () => T): T;
};

const DEFAULT_DATABASE_PATH = "data/board.db";

// Survives dev-server hot reloads so every route handler shares one in-memory database.
const globalForDb = globalThis as typeof globalThis & { boardDb?: Promise<Db> };

export function getDb(): Promise<Db> {
  // The database file is runtime data, so it is excluded from output file tracing.
  globalForDb.boardDb ??= openDb(
    path.resolve(/*turbopackIgnore: true*/ process.env.DATABASE_PATH || DEFAULT_DATABASE_PATH),
  );
  return globalForDb.boardDb;
}

async function openDb(filePath: string): Promise<Db> {
  // sql.js is a server external package, so it resolves its WASM binary from its own install directory.
  const SQL = await initSqlJs();
  const database = new SQL.Database(readDatabaseFile(filePath));
  database.run(SCHEMA);
  persist(database, filePath);
  let inTransaction = false;

  return {
    all: <T>(sql: string, params: SqlValue[] = []) => selectRows<T>(database, sql, params),
    get: <T>(sql: string, params: SqlValue[] = []) => selectRows<T>(database, sql, params)[0],
    run: (sql, params = []) => {
      database.run(sql, params);
      const changes = database.getRowsModified();
      const lastInsertId = Number(database.exec("SELECT last_insert_rowid()")[0].values[0][0]);
      if (!inTransaction) persist(database, filePath);
      return { lastInsertId, changes };
    },
    transaction: (work) => {
      database.run("BEGIN");
      inTransaction = true;
      try {
        const result = work();
        database.run("COMMIT");
        return result;
      } catch (error) {
        database.run("ROLLBACK");
        throw error;
      } finally {
        inTransaction = false;
        persist(database, filePath);
      }
    },
  };
}

function selectRows<T>(database: Database, sql: string, params: SqlValue[]): T[] {
  const statement = database.prepare(sql, params);
  const rows: T[] = [];
  try {
    while (statement.step()) rows.push(statement.getAsObject() as T);
  } finally {
    statement.free();
  }
  return rows;
}

function readDatabaseFile(filePath: string) {
  try {
    return readFileSync(filePath);
  } catch {
    return undefined;
  }
}

// Writes to a temp file first so a crash mid-write never leaves a truncated database.
function persist(database: Database, filePath: string) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp`;
  writeFileSync(tempPath, database.export());
  renameSync(tempPath, filePath);
  // `export()` reopens the database, which resets pragmas to their defaults.
  database.run("PRAGMA foreign_keys = ON;");
}
