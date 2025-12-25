import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import ErrorReporter from "@/components/ErrorReporter";
import { ThemeProvider } from "next-themes";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SearchProvider } from "@/components/providers/search-provider";
import { PostHogProvider } from "@/components/providers/posthog-provider";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "Vishesh Baghel Portfolio",
  description: "i build agents, infra, and tools for developers.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={ibmPlexMono.variable}>
      <body className={`${ibmPlexMono.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <PostHogProvider>
            <SearchProvider>
              <ErrorReporter />
              {children}
              <Analytics />
              <SpeedInsights />
            </SearchProvider>
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
