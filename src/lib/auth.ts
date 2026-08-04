import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { query } from './db';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: Date;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function createSession(userId: number): Promise<string> {
  const sessionId = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await query(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)',
    [sessionId, userId, expiresAt]
  );
  return sessionId;
}

export async function getSessionUser(sessionId?: string): Promise<User | null> {
  if (!sessionId) return null;
  const res = await query(
    `SELECT users.id, users.name, users.email, users.role, users.created_at
     FROM sessions
     JOIN users ON sessions.user_id = users.id
     WHERE sessions.id = $1 AND sessions.expires_at > NOW()`,
    [sessionId]
  );
  if (res.rows.length === 0) {
    return null;
  }
  return res.rows[0] as User;
}

export async function destroySession(sessionId?: string): Promise<void> {
  if (!sessionId) return;
  await query('DELETE FROM sessions WHERE id = $1', [sessionId]);
}
