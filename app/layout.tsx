import './globals.css';
import type { Metadata } from 'next';
import { Inter, Amiri } from 'next/font/google';
import { cn } from '@/lib/utils';
import { BookOpen } from 'lucide-react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri'
});

export const metadata: Metadata = {
  title: 'QuranMind - Memorize & Understand the Quran',
  description: 'A modern web app to help Muslims memorize and understand the Holy Quran',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(inter.variable, amiri.variable)}>
      <body className={inter.className}>
        <header className="border-b bg-gray-50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  QuranMind
                </h1>
              </div>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}