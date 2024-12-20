import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import Footer from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Diego Glusberg - Full-Stack Engineer',
  description: 'Personal Portfolio and Projects of Dubious Utility',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background`}>
        <div className="antialiased flex justify-center w-full">
          <main className="flex-auto min-w-0 flex flex-col">
            {children}
            <Analytics />
            <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}
