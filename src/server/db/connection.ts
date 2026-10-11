import { mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { type Client, createClient, type InValue, type Transaction } from "@libsql/client";

import { SCHEMA } from "./schema";

type QueryDb = {
  all<T>(sql: string, params?: InValue[]): Promise<T[]>;
  get<T>(sql: string, params?: InValue[]): Promise<T | undefined>;
  run(sql: string, params?: InValue[]): Promise<{ lastInsertId: number; changes: number }>;
};

export type Db = QueryDb & {
  transaction<T>(work: (transaction: QueryDb) => Promise<T>): Promise<T>;
};

const DEFAULT_DATABASE_PATH = "data/board.db";
const globalForDb = globalThis as typeof globalThis & { boardDb?: Promise<Db> };

export function getDb(): Promise<Db> {
  globalForDb.boardDb ??= openDb().catch((error) => {
    globalForDb.boardDb = undefined;
    throw error;
  });
  return globalForDb.boardDb;
}

async function openDb(): Promise<Db> {
  const remoteUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (process.env.VERCEL && (!remoteUrl || !authToken)) {
    throw new Error("Vercel requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.");
  }
  if (remoteUrl && !/^(libsql|https):\/\//.test(remoteUrl)) {
    throw new Error("TURSO_DATABASE_URL must use libsql:// or https://.");
  }
  if (remoteUrl && !authToken) {
    throw new Error("TURSO_AUTH_TOKEN is required for the remote database.");
  }

  let url = remoteUrl;
  if (!url) {
    const filePath = path.resolve(/*turbopackIgnore: true*/ process.env.DATABASE_PATH || DEFAULT_DATABASE_PATH);
    await mkdir(path.dirname(filePath), { recursive: true });
    url = pathToFileURL(filePath).href;
  }
  const client = createClient({ url, authToken: remoteUrl ? authToken : undefined });
  try {
    await client.execute("PRAGMA foreign_keys = ON");
    await client.executeMultiple(SCHEMA);
  } catch (error) {
    client.close();
    throw error;
  }

  return {
    ...queries(client),
    transaction: async (work) => {
      const transaction = await client.transaction("write");
      try {
        const result = await work(queries(transaction));
        await transaction.commit();
        return result;
      } catch (error) {
        if (!transaction.closed) await transaction.rollback();
        throw error;
      } finally {
        transaction.close();
      }
    },
  };
}

function queries(executor: Client | Transaction): QueryDb {
  return {
    all: async <T>(sql: string, params: InValue[] = []) => {
      const result = await executor.execute({ sql, args: params });
      return result.rows as unknown as T[];
    },
    get: async <T>(sql: string, params: InValue[] = []) => {
      const result = await executor.execute({ sql, args: params });
      return result.rows[0] as T | undefined;
    },
    run: async (sql, params = []) => {
      const result = await executor.execute({ sql, args: params });
      return { lastInsertId: Number(result.lastInsertRowid ?? 0), changes: result.rowsAffected };
    },
  };
}
