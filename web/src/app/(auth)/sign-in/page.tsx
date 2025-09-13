'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await authClient.signIn.email({ email, password });
            if ((res as any)?.error) {
                setError((res as any).error?.message || 'Unable to sign in.');
            } else {
                router.push('/');
            }
        } catch (err: any) {
            setError(err?.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex min-h-[100dvh] items-center justify-center px-4'>
            <Card className='w-full max-w-md'>
                <CardHeader>
                    <CardTitle>Sign in</CardTitle>
                    <CardDescription>Welcome back. Enter your email and password to continue.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='email'>Email</Label>
                            <Input
                                id='email'
                                type='email'
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='you@example.com'
                                required
                                autoComplete='email'
                            />
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='password'>Password</Label>
                            <Input
                                id='password'
                                type='password'
                                name='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete='current-password'
                            />
                        </div>
                        {error && <p className='text-destructive text-sm'>{error}</p>}
                        <Button type='submit' className='w-full' disabled={loading}>
                            {loading ? 'Signing in…' : 'Sign in'}
                        </Button>
                    </form>
                    <p className='text-muted-foreground mt-4 text-center text-sm'>
                        Don&apos;t have an account?{' '}
                        <Button asChild variant='link' className='p-0'>
                            <Link href='/sign-up'>Sign up</Link>
                        </Button>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
