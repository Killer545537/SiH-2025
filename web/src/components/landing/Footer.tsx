import { Button } from '@/components/ui/button';

export const Footer = () => (
    <footer className='bg-sidebar text-sidebar-foreground py-12'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
                <div className='col-span-1 md:col-span-2'>
                    <h3 className='mb-4 text-xl font-bold'>PM Internship Program</h3>
                    <p className='text-sidebar-foreground/80 mb-4 text-pretty'>
                        Empowering the next generation of professionals through meaningful internship opportunities with
                        leading companies across the nation.
                    </p>
                    <div className='flex space-x-4'>
                        <Button
                            variant='ghost'
                            size='sm'
                            className='text-sidebar-foreground hover:text-sidebar-primary'
                        >
                            Contact Us
                        </Button>
                        <Button
                            variant='ghost'
                            size='sm'
                            className='text-sidebar-foreground hover:text-sidebar-primary'
                        >
                            Support
                        </Button>
                    </div>
                </div>
                <div>
                    <h4 className='mb-4 font-semibold'>Quick Links</h4>
                    <ul className='text-sidebar-foreground/80 space-y-2'>
                        <li>
                            <a href='#' className='hover:text-sidebar-foreground transition-colors'>
                                About Program
                            </a>
                        </li>
                        <li>
                            <a href='#' className='hover:text-sidebar-foreground transition-colors'>
                                How to Apply
                            </a>
                        </li>
                        <li>
                            <a href='#' className='hover:text-sidebar-foreground transition-colors'>
                                Partner Companies
                            </a>
                        </li>
                        <li>
                            <a href='#' className='hover:text-sidebar-foreground transition-colors'>
                                Success Stories
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className='mb-4 font-semibold'>Support</h4>
                    <ul className='text-sidebar-foreground/80 space-y-2'>
                        <li>
                            <a href='#' className='hover:text-sidebar-foreground transition-colors'>
                                Help Center
                            </a>
                        </li>
                        <li>
                            <a href='#' className='hover:text-sidebar-foreground transition-colors'>
                                FAQs
                            </a>
                        </li>
                        <li>
                            <a href='#' className='hover:text-sidebar-foreground transition-colors'>
                                Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a href='#' className='hover:text-sidebar-foreground transition-colors'>
                                Terms of Service
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='border-sidebar-border text-sidebar-foreground/60 mt-8 border-t pt-8 text-center'>
                <p>&copy; 2024 PM Internship Program. All rights reserved. A Government of India Initiative.</p>
            </div>
        </div>
    </footer>
);
