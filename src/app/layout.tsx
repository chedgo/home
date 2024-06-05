import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
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
        <div className="antialiased  mt-8 flex justify-center w-full">
          <main className="flex-auto min-w-0  mt-6 flex flex-col pr-8">
            {children}
            <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}
