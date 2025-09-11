import { config } from 'dotenv';

config({ path: '.env' });

if (process.env.NODE_ENV !== 'production') {
    config();
}

const requiredServerVars = ['DATABASE_URL', 'BETTER_AUTH_SECRET'] as const;

const requiredClientVars = ['NEXT_PUBLIC_BASE_URL'] as const;
const allRequiredVars = [...requiredClientVars, ...requiredServerVars];

const missingVars = allRequiredVars.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

type ServerConfigType = {
    [K in (typeof requiredServerVars)[number]]: string;
};

type ClientConfigType = {
    [K in (typeof requiredClientVars)[number]]: string;
};

export const CONFIG = Object.fromEntries(
    requiredServerVars.map((key) => [key, process.env[key] as string])
) as ServerConfigType;

export const CLIENT_CONFIG = Object.fromEntries(
    requiredClientVars.map((key) => [key, process.env[key] as string])
) as ClientConfigType;
