import { neon } from '@neondatabase/serverless';
import { CONFIG } from '@/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { schema } from '@/db/schema';

const sql = neon(CONFIG.DATABASE_URL);
export const db = drizzle({ client: sql, schema, casing: 'snake_case' });
