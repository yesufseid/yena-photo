import sql from './db';
import { hash, compare } from 'bcryptjs';

export interface User {
  id: string; // UUID
  email: string;
  created_at: string;
}

export async function signUp(email: string, password: string): Promise<User> {
  try {
    const hashedPassword = await hash(password, 10);
    const result = await sql`
      INSERT INTO users (email, password, created_at)
      VALUES (${email}, ${hashedPassword}, NOW())
      RETURNING id, email, created_at
    `;
    return result[0] as User;
  } catch (error: any) {
    if (error.message.includes('unique constraint')) {
      throw new Error('Email already exists');
    }
    throw error;
  }
}

export async function signIn(email: string, password: string): Promise<User> {
  const result = await sql`
    SELECT id, email, password, created_at FROM users WHERE email = ${email}
  `;

  if (result.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result[0] as any;
  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
  };
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await sql`
    SELECT id, email, created_at FROM users WHERE id = ${id}
  `;
  return result.length > 0 ? (result[0] as User) : null;
}
