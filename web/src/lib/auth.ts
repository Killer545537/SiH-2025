import { betterAuth } from 'better-auth';
import { CLIENT_CONFIG } from '@/config';
import { nextCookies } from 'better-auth/next-js';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db/db';

export const auth = betterAuth({
    baseURL: CLIENT_CONFIG.NEXT_PUBLIC_BASE_URL,
    basePath: '/api/auth',
    database: drizzleAdapter(db, { provider: 'pg' }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
        autoSignIn: true,
    },
    plugins: [nextCookies()],
});
