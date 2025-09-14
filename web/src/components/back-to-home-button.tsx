import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const BackToHomeButton = () => (
    <Link href='/' className='text-primary hover:text-primary/80 mb-4 inline-flex items-center'>
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back to Home
    </Link>
);
