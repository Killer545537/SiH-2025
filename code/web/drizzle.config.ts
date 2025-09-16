import { defineConfig } from 'drizzle-kit';
import { CONFIG } from '@/config/server';

export default defineConfig({
    schema: './src/db/schema',
    out: './migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: CONFIG.DATABASE_URL,
    },
    migrations: {
        table: '__drizzle_migration',
        schema: 'public',
    },
    casing: 'snake_case',
    verbose: true,
    strict: true,
});
