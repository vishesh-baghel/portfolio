import type { Metadata } from "next";
import "./globals.css";
import "nextra-theme-docs/style.css";
import ErrorReporter from "@/components/ErrorReporter";
import { ThemeProvider } from "next-themes";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SearchProvider } from "@/components/providers/search-provider";
import { Layout, Navbar } from 'nextra-theme-docs';
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { ExperimentsNavbarContent } from '../components/layouts/experiments-navbar-content';
import { McpBanner } from '@/components/ui/mcp-banner';

export const metadata: Metadata = {
  title: "Vishesh Baghel — open source & agents",
  description: "i build agents, infra, and tools for developers.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pageMap = await getPageMap();
  
  const navbar = (
    <Navbar logo={<ExperimentsNavbarContent />} />
  );
  
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <SearchProvider>
            <ErrorReporter />
            <Layout 
              pageMap={pageMap}
              navbar={navbar}
              toc={{
                title: (
                  <div className="space-y-4 w-full">
                    <McpBanner />
                    <h3 className="text-sm font-semibold mt-6">on this page</h3>
                  </div>
                ),
                float: true,
              }}
              sidebar={{
                autoCollapse: true,
                defaultMenuCollapseLevel: 1,
                toggleButton: true,
              }}
              nextThemes={{
                attribute: 'class',
              }}
              docsRepositoryBase="https://github.com/vishesh-baghel/portfolio"
              feedback={{
                content: 'Question? Give us feedback',
              }}
              editLink="Edit this page"
            >
              {children}
            </Layout>
            <Analytics />
            <SpeedInsights />
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
