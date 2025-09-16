import { Card, CardContent } from '@/components/ui/card';

export interface BenefitItem {
    icon: React.ReactNode;
    title: string;
    description: string;
}

interface BenefitsProps {
    items: BenefitItem[];
}

export const Benefits = ({ items }: BenefitsProps) => (
    <section id='about' className='scroll-mt-24 py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-16 text-center'>
                <h2 className='text-foreground mb-4 text-3xl font-bold text-balance sm:text-4xl'>
                    Why Choose PM Internship Program?
                </h2>
                <p className='text-muted-foreground mx-auto max-w-2xl text-xl text-pretty'>
                    Our program offers unparalleled opportunities for growth, learning, and career advancement
                </p>
            </div>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
                {items.map((benefit, index) => (
                    <Card key={index} className='border-border transition-shadow duration-300 hover:shadow-lg'>
                        <CardContent className='p-6 text-center'>
                            <div className='mb-4 flex justify-center'>{benefit.icon}</div>
                            <h3 className='text-foreground mb-3 text-xl font-semibold'>{benefit.title}</h3>
                            <p className='text-muted-foreground text-pretty'>{benefit.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </section>
);
