import { Navigation } from '@/components/landing/Navigation';
import { Hero } from '@/components/landing/Hero';
import { LogoCloud } from '@/components/landing/LogoCloud';
import { type BenefitItem, Benefits } from '@/components/landing/Benefits';
import { ProcessSteps, type StepItem } from '@/components/landing/ProcessSteps';
import { Stats } from '@/components/landing/Stats';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';
import { Award, Building2, Target, Users } from 'lucide-react';

export default function Home() {
    const companies = [
        'Google',
        'Microsoft',
        'Amazon',
        'Apple',
        'Meta',
        'Netflix',
        'Adobe',
        'Salesforce',
        'IBM',
        'Intel',
        'Oracle',
        'Tesla',
    ];

    const benefits: BenefitItem[] = [
        {
            icon: <Users className='text-primary h-8 w-8' />,
            title: 'Networking Opportunities',
            description: 'Connect with industry leaders and build lasting professional relationships',
        },
        {
            icon: <Target className='text-primary h-8 w-8' />,
            title: 'Skill Development',
            description: 'Gain hands-on experience with cutting-edge technologies and methodologies',
        },
        {
            icon: <Award className='text-primary h-8 w-8' />,
            title: 'Real-World Experience',
            description: 'Work on meaningful projects that make a real impact in leading companies',
        },
        {
            icon: <Building2 className='text-primary h-8 w-8' />,
            title: 'Career Advancement',
            description: 'Fast-track your career with mentorship from industry experts',
        },
    ];

    const steps: StepItem[] = [
        {
            number: '01',
            title: 'Apply Online',
            description: 'Submit your application with academic records and portfolio',
        },
        { number: '02', title: 'Assessment', description: 'Complete our comprehensive skills and aptitude evaluation' },
        {
            number: '03',
            title: 'Interview',
            description: 'Participate in interviews with program coordinators and company representatives',
        },
        {
            number: '04',
            title: 'Placement',
            description: 'Get matched with the perfect internship opportunity at top companies',
        },
    ];

    return (
        <div className='bg-background min-h-screen'>
            <Navigation />
            <Hero />
            <LogoCloud companies={companies} />
            <Benefits items={benefits} />
            <ProcessSteps steps={steps} />
            <Stats />
            <CTA />
            <Footer />
        </div>
    );
}
