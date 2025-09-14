// Client-safe configuration: ONLY expose NEXT_PUBLIC_* variables.
// Do not throw here to avoid breaking client rendering if missing.

export const CLIENT_CONFIG = {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || '',
};
