'use server';

import { auth } from '@/lib/auth';

export const signInUser = async (email: string, password: string) => {
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
            },
        });

        return { success: true, message: 'Signed in successfully!' } as const;
    } catch (e) {
        const error = e as Error;
        return { success: false, message: error.message || 'Failed to sign in' } as const;
    }
};

export const signUpUser = async (name: string, email: string, password: string) => {
    try {
        await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
            },
        });

        return { success: true, message: 'Email verification code sent' } as const;
    } catch (e) {
        const error = e as Error;
        return { success: false, message: error.message || 'Failed to sign up' } as const;
    }
};
