'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { signUpUser } from '@/server/users';

const signUpSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.email({ message: 'Please enter a valid email.' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
    const router = useRouter();
    const [error, setError] = React.useState<string | null>(null);

    const form = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { name: '', email: '', password: '' },
        mode: 'onSubmit',
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = form;

    const onSubmit = async (values: SignUpValues) => {
        setError(null);
        try {
            const result = await signUpUser(values.name, values.email, values.password);
            if (result.success) {
                router.push('/dashboard');
            } else {
                setError(result.message || 'Sign up failed. Please try again.');
            }
        } catch (err: unknown) {
            if (
                typeof err === 'object' &&
                err !== null &&
                'errors' in err &&
                Array.isArray((err as { errors?: unknown }).errors)
            ) {
                setError((err as { errors: { message?: string }[] }).errors?.[0]?.message || 'Sign up failed');
            } else if (typeof err === 'object' && err !== null && 'message' in err) {
                setError((err as { message?: string }).message || 'Sign up failed');
            } else {
                setError('Sign up failed');
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='space-y-2'>
                    <Label htmlFor='name'>Full name</Label>
                    <Input
                        id='name'
                        placeholder='Jane Doe'
                        autoComplete='name'
                        {...register('name')}
                        aria-invalid={!!errors.name}
                    />
                    {errors.name && <p className='text-destructive mt-1 text-xs'>{errors.name.message as string}</p>}
                </div>
                <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                        id='email'
                        type='email'
                        placeholder='you@example.com'
                        autoComplete='email'
                        {...register('email')}
                        aria-invalid={!!errors.email}
                    />
                    {errors.email && <p className='text-destructive mt-1 text-xs'>{errors.email.message as string}</p>}
                </div>
                <div className='space-y-2'>
                    <Label htmlFor='password'>Password</Label>
                    <Input
                        id='password'
                        type='password'
                        autoComplete='new-password'
                        {...register('password')}
                        aria-invalid={!!errors.password}
                    />
                    {errors.password && (
                        <p className='text-destructive mt-1 text-xs'>{errors.password.message as string}</p>
                    )}
                </div>
                <Button type='submit' className='w-full' disabled={isSubmitting}>
                    {isSubmitting ? 'Creating account…' : 'Create account'}
                </Button>
                {error && <p className='text-destructive mt-2 text-sm'>{error}</p>}
            </form>
        </Form>
    );
};
