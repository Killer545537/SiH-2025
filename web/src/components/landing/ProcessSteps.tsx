export interface StepItem {
    number: string;
    title: string;
    description: string;
}

interface ProcessStepsProps {
    steps: StepItem[];
}

export function ProcessSteps({ steps }: ProcessStepsProps) {
    return (
        <section id='how-it-works' className='bg-muted py-20 scroll-mt-24'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='mb-16 text-center'>
                    <h2 className='text-foreground mb-4 text-3xl font-bold text-balance sm:text-4xl'>
                        Simple Application Process
                    </h2>
                    <p className='text-muted-foreground mx-auto max-w-2xl text-xl text-pretty'>
                        Get started on your journey to success with our streamlined application process
                    </p>
                </div>
                <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
                    {steps.map((step, index) => (
                        <div key={index} className='text-center'>
                            <div className='relative mb-6'>
                                <div className='bg-primary text-primary-foreground mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold'>
                                    {step.number}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className='bg-border absolute top-8 left-full hidden h-0.5 w-full -translate-x-8 lg:block' />
                                )}
                            </div>
                            <h3 className='text-foreground mb-3 text-xl font-semibold'>{step.title}</h3>
                            <p className='text-muted-foreground text-pretty'>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
