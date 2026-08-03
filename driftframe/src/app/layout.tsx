import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Driftframe — AI Image Generation Studio",
  description:
    "Generate images that drift between imagination and reality. Batch-of-4 AI image generation, credit packs, and a public showcase gallery.",
  keywords: [
    "AI image generation",
    "Driftframe",
    "generative art",
    "AI art studio",
    "Next.js template",
  ],
  authors: [{ name: "Driftframe" }],
  openGraph: {
    title: "Driftframe — AI Image Generation Studio",
    description:
      "Generate images that drift between imagination and reality.",
    siteName: "Driftframe",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Driftframe",
    description:
      "Generate images that drift between imagination and reality.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Fontshare: Clash Display (headings) + Satoshi (body/UI) */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@300,400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen" suppressHydrationWarning>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
