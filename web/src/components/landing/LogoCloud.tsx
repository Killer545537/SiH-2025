interface LogoCloudProps {
    companies: string[];
}

export const LogoCloud = ({ companies }: LogoCloudProps) => (
    <section className='bg-muted py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-12 text-center'>
                <h2 className='text-foreground mb-4 text-2xl font-bold sm:text-3xl'>Trusted by Leading Companies</h2>
                <p className='text-muted-foreground'>
                    Join thousands of students who have launched their careers with top organizations
                </p>
            </div>
            <div className='grid grid-cols-2 items-center gap-8 md:grid-cols-3 lg:grid-cols-6'>
                {companies.map((company, index) => (
                    <div
                        key={company}
                        className='animate-stagger-fade-in flex items-center justify-center opacity-0'
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className='text-muted-foreground hover:text-foreground cursor-pointer text-lg font-semibold transition-colors duration-300'>
                            {company}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
