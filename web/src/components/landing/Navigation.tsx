'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 z-50 w-full transition-all duration-300 ${
                isScrolled ? 'glass-morphism shadow-lg' : 'bg-transparent'
            }`}
        >
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='flex h-16 items-center justify-between'>
                    <div className='flex items-center'>
                        <div className='flex-shrink-0'>
                            <h1 className='text-foreground text-xl font-bold'>PM Internship</h1>
                        </div>
                    </div>

                    <div className='hidden md:block'>
                        <div className='ml-10 flex items-baseline space-x-4'>
                            <Button asChild variant='ghost' className='text-foreground hover:text-primary'>
                                <a href='#home'>Home</a>
                            </Button>
                            <Button asChild variant='ghost' className='text-foreground hover:text-primary'>
                                <a href='#about'>About</a>
                            </Button>
                            <Button asChild variant='ghost' className='text-foreground hover:text-primary'>
                                <a href='#how-it-works'>How It Works</a>
                            </Button>
                            <Button asChild variant='ghost' className='text-foreground hover:text-primary'>
                                <a href='#testimonials'>Testimonials</a>
                            </Button>
                        </div>
                    </div>

                    <div className='hidden items-center space-x-4 md:flex'>
                        <Button
                            asChild
                            variant='outline'
                            className='border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent'
                        >
                            <a href='/sign-in'>Sign In</a>
                        </Button>
                        <Button asChild className='bg-primary text-primary-foreground hover:bg-primary/90'>
                            <a href='/sign-up'>Sign Up</a>
                        </Button>
                    </div>

                    <div className='md:hidden'>
                        <Button variant='ghost' size='sm' onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
                        </Button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className='border-border bg-background border-t md:hidden'>
                    <div className='space-y-1 px-2 pt-2 pb-3 sm:px-3'>
                        <Button asChild variant='ghost' className='w-full justify-start'>
                            <a href='#home' onClick={() => setIsMenuOpen(false)}>Home</a>
                        </Button>
                        <Button asChild variant='ghost' className='w-full justify-start'>
                            <a href='#about' onClick={() => setIsMenuOpen(false)}>About</a>
                        </Button>
                        <Button asChild variant='ghost' className='w-full justify-start'>
                            <a href='#how-it-works' onClick={() => setIsMenuOpen(false)}>How It Works</a>
                        </Button>
                        <Button asChild variant='ghost' className='w-full justify-start'>
                            <a href='#testimonials' onClick={() => setIsMenuOpen(false)}>Testimonials</a>
                        </Button>
                        <div className='space-y-2 pt-4'>
                            <Button asChild variant='outline' className='w-full bg-transparent'>
                                <a href='/sign-in' onClick={() => setIsMenuOpen(false)}>Sign In</a>
                            </Button>
                            <Button asChild className='bg-primary text-primary-foreground w-full'>
                                <a href='/sign-up' onClick={() => setIsMenuOpen(false)}>Sign Up</a>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
