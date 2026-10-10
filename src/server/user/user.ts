import { getDb } from "../db";

export type AuthProvider = "email" | "kakao" | "google";

export type UserDto = {
  id: number;
  nickname: string;
  email: string | null;
  provider: AuthProvider;
};

type UserRow = {
  id: number;
  nickname: string;
  email: string | null;
  provider: AuthProvider;
};

type AccountRow = {
  user_id: number;
  password_hash: string | null;
};

type NewUser = {
  nickname: string;
  email: string | null;
  provider: AuthProvider;
  providerAccountId: string;
  passwordHash?: string;
};

export async function findUserById(id: number): Promise<UserDto | null> {
  const db = await getDb();
  const row = db.get<UserRow>(
    `SELECT users.id, users.nickname, users.email, accounts.provider
       FROM users JOIN accounts ON accounts.user_id = users.id
      WHERE users.id = ?
      ORDER BY accounts.id LIMIT 1`,
    [id],
  );
  return row ? { id: row.id, nickname: row.nickname, email: row.email, provider: row.provider } : null;
}

export async function findAccount(provider: AuthProvider, providerAccountId: string) {
  const db = await getDb();
  const row = db.get<AccountRow>(
    "SELECT user_id, password_hash FROM accounts WHERE provider = ? AND provider_account_id = ?",
    [provider, providerAccountId],
  );
  return row ? { userId: row.user_id, passwordHash: row.password_hash } : null;
}

export async function createUser(user: NewUser): Promise<UserDto> {
  const db = await getDb();
  const now = new Date().toISOString();
  const userId = db.transaction(() => {
    const { lastInsertId } = db.run(
      "INSERT INTO users (nickname, email, created_at) VALUES (?, ?, ?)",
      [user.nickname, user.email, now],
    );
    db.run(
      `INSERT INTO accounts (user_id, provider, provider_account_id, password_hash, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [lastInsertId, user.provider, user.providerAccountId, user.passwordHash ?? null, now],
    );
    return lastInsertId;
  });
  return { id: userId, nickname: user.nickname, email: user.email, provider: user.provider };
}
