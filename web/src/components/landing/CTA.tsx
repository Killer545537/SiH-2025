import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const CTA = () => (
    <section className='bg-primary py-20'>
        <div className='mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
            <h2 className='text-primary-foreground mb-6 text-3xl font-bold text-balance sm:text-4xl'>
                Ready to Transform Your Future?
            </h2>
            <p className='text-primary-foreground/90 mb-8 text-xl text-pretty'>
                Join thousands of students who have already started their journey to success. Apply now and take the
                first step towards your dream career.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <Link href='/sign-up'>
                    <Button size='lg' variant='secondary' className='px-8 py-3 text-lg'>
                        Apply Now
                        <ArrowRight className='ml-2 h-5 w-5' />
                    </Button>
                </Link>
                <Button
                    size='lg'
                    variant='outline'
                    className='border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent px-8 py-3 text-lg'
                >
                    Download Brochure
                </Button>
            </div>
        </div>
    </section>
);
