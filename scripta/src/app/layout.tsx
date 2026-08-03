import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Onest } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { SessionProvider } from 'next-auth/react';

const onest = Onest({
  subsets: ['latin'],
  variable: '--font-onest',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Scripta — AI Blog & Content Writer SaaS',
    template: '%s | Scripta',
  },
  description:
    'Scripta is a premium AI content-writing SaaS — generate blog posts, social captions, email copy, and product descriptions with streaming AI.',
  keywords: [
    'AI writer',
    'content generation',
    'blog generator',
    'social media writer',
    'email copy AI',
    'product description generator',
    'Next.js SaaS template',
  ],
  authors: [{ name: 'Scripta' }],
  openGraph: {
    title: 'Scripta — AI Blog & Content Writer SaaS',
    description:
      'Generate blog posts, social captions, email copy, and product descriptions with streaming AI.',
    siteName: 'Scripta',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scripta — AI Blog & Content Writer SaaS',
    description:
      'Generate blog posts, social captions, email copy, and product descriptions with streaming AI.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${onest.variable} bg-background text-foreground min-h-screen flex flex-col antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
            <Toaster richColors closeButton position="bottom-right" />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
