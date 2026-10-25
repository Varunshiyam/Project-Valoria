import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { IntroProvider } from '@/components/intro-provider';
import { Navbar } from '@/components/navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Valoria — Autonomous Motion Systems',
  description:
    'Modern, cinematic SVG logo intro animation with shared layout morphing, spring physics, and OKLCH dark aesthetics.',
  icons: {
    icon: '/logos/valoria-logo-traced.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
        <IntroProvider>
          <Navbar />
          {children}
        </IntroProvider>
      </body>
    </html>
  );
}
