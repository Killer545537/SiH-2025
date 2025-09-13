import { createAuthClient } from 'better-auth/react';
import { CLIENT_CONFIG } from '@/config/client';

export const authClient = createAuthClient({
    baseURL: CLIENT_CONFIG.NEXT_PUBLIC_BASE_URL,
});
