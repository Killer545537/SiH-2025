'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignInForm } from '@/components/auth/SignInForm';

const SignInPage = () => (
    <div className='flex min-h-[100dvh] items-center justify-center px-4'>
        <Card className='w-full max-w-md'>
            <CardHeader>
                <CardTitle>Sign in</CardTitle>
                <CardDescription>Welcome back. Enter your email and password to continue.</CardDescription>
            </CardHeader>
            <CardContent>
                <SignInForm />
                <p className='text-muted-foreground mt-4 text-center text-sm'>
                    Don&apos;t have an account?{' '}
                    <Link className='underline underline-offset-4' href='/sign-up'>
                        Sign up
                    </Link>
                </p>
            </CardContent>
        </Card>
    </div>
);

export default SignInPage;
