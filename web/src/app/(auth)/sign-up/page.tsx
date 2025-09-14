'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { BackToHomeButton } from '@/components/back-to-home-button';

const SignUpPage = () => (
    <div className='flex min-h-[100dvh] items-center justify-center px-4'>
        <div className='w-full max-w-md'>
            <BackToHomeButton/>
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Create account</CardTitle>
                    <CardDescription>Join the PM Internship Program. It only takes a minute.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SignUpForm />
                    <p className='text-muted-foreground mt-4 text-center text-sm'>
                        Already have an account?{' '}
                        <Link className='underline underline-offset-4' href='/sign-in'>
                            Sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    </div>
);

export default SignUpPage;
