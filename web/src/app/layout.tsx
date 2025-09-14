import type { Metadata } from 'next';
import './globals.css';
import React from 'react';

export const metadata: Metadata = {
    title: 'PM Internship Recommender',
    description: 'Discover and get recommendations tailored to your interests and skills.',
    keywords: ['Internship', 'Career', 'Government'],
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
    <html lang='en'>
        <body className='antialiased'>{children}</body>
    </html>
);

export default RootLayout;
