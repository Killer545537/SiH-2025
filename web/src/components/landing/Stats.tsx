import { Briefcase, GraduationCap, TrendingUp } from 'lucide-react';

export function Stats() {
    return (
        <section id='testimonials' className='py-20 scroll-mt-24'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='grid grid-cols-1 gap-8 text-center md:grid-cols-3'>
                    <div>
                        <div className='mb-4 flex justify-center'>
                            <GraduationCap className='text-primary h-12 w-12' />
                        </div>
                        <div className='text-foreground mb-2 text-4xl font-bold'>10,000+</div>
                        <div className='text-muted-foreground'>Students Placed</div>
                    </div>
                    <div>
                        <div className='mb-4 flex justify-center'>
                            <Briefcase className='text-primary h-12 w-12' />
                        </div>
                        <div className='text-foreground mb-2 text-4xl font-bold'>500+</div>
                        <div className='text-muted-foreground'>Partner Companies</div>
                    </div>
                    <div>
                        <div className='mb-4 flex justify-center'>
                            <TrendingUp className='text-primary h-12 w-12' />
                        </div>
                        <div className='text-foreground mb-2 text-4xl font-bold'>95%</div>
                        <div className='text-muted-foreground'>Success Rate</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
