import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";

// Inter — body/UI text. Industry standard for premium SaaS (Vercel, Linear,
// Stripe, Resend). Excellent small-size legibility, tabular numbers, variable
// weight 100–900.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Sora — display/headings. Geometric, modern, refined. Lighter and more
// professional than Archivo Black while still commanding attention at large
// sizes. Variable weight 100–800.
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Loopline — AI Customer Support Chatbot for SaaS",
  description:
    "Loopline is a premium AI customer-support chatbot SaaS starter kit. Ship an embeddable widget, manage multiple bots per workspace, and resolve support tickets 24/7 with streaming AI.",
  keywords: [
    "AI chatbot",
    "customer support",
    "SaaS starter kit",
    "Next.js",
    "TypeScript",
    "Stripe",
    "embeddable widget",
    "Loopline",
  ],
  authors: [{ name: "Loopline" }],
  openGraph: {
    title: "Loopline — AI Customer Support Chatbot for SaaS",
    description:
      "Premium embeddable AI support widget. Multi-bot workspaces, human handoff, Stripe billing, Next.js 16.",
    url: "https://loopline.dev",
    siteName: "Loopline",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loopline — AI Customer Support Chatbot",
    description:
      "Premium embeddable AI support widget for SaaS. Built on Next.js 16.",
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
        className={`${inter.variable} ${sora.variable} antialiased bg-background text-foreground font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <SonnerToaster richColors position="bottom-right" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
