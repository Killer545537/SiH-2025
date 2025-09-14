// Server-only configuration (Next.js loads env automatically; no dotenv here)

const requiredServerVars = ['DATABASE_URL', 'BETTER_AUTH_SECRET'] as const;

const missingServer = requiredServerVars.filter((k) => !process.env[k]);
if (missingServer.length > 0) {
    throw new Error(`Missing required server env: ${missingServer.join(', ')}`);
}

export const CONFIG: { [K in (typeof requiredServerVars)[number]]: string } = {
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
};
