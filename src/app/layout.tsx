import type {Metadata} from 'next';
import './globals.css';
import { AppNav } from '@/components/AppNav';
import { HeaderDate } from '@/components/HeaderDate';
import { CurrentYear } from '@/components/CurrentYear';
import { LayoutGrid } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Consistency Lab | Minimal Productivity Tracker',
  description: 'A modern, dark-themed daily task tracker designed for focus and clarity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <LayoutGrid className="text-accent" size={24} />
                <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
                  Consistency<span className="text-primary">Lab</span>
                </h1>
              </div>
              <HeaderDate />
            </div>
            <AppNav />
          </header>
          {children}
          <footer className="pt-12 border-t border-white/5 text-center space-y-2">
            <p className="text-xs text-muted-foreground/40 font-mono tracking-widest uppercase">
              Consistency Lab // Focused Productivity
            </p>
            <p className="text-[10px] text-muted-foreground/30 font-medium uppercase tracking-[0.2em]">
              By ❤️ Krishna @ <CurrentYear />
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
