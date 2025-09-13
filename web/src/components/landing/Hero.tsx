import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';

export function Hero() {
    return (
        <section id='home' className='relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32 scroll-mt-24'>
            <div className='from-primary/5 via-background to-secondary/5 absolute inset-0 bg-gradient-to-br' />
            <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='text-center'>
                    <Badge variant='secondary' className='animate-fade-in-up mb-6'>
                        <Star className='mr-2 h-4 w-4' />
                        Government Initiative
                    </Badge>
                    <h1 className='text-foreground animate-fade-in-up mb-6 text-4xl font-bold text-balance sm:text-5xl lg:text-6xl'>
                        PM Internship Program
                    </h1>
                    <p className='text-muted-foreground animate-fade-in-up mx-auto mb-8 max-w-3xl text-xl text-pretty sm:text-2xl'>
                        Transform your future by connecting with leading companies through our prestigious government
                        initiative. Build skills, gain experience, and launch your career.
                    </p>
                    <div className='animate-fade-in-up flex flex-col justify-center gap-4 sm:flex-row'>
                        <Button size='lg' className='px-8 py-3 text-lg'>
                            Find Internships
                            <ArrowRight className='ml-2 h-5 w-5' />
                        </Button>
                        <Button
                            size='lg'
                            variant='outline'
                            className='border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent text-lg'
                        >
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
