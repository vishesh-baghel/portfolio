"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog, trackPageView } from "@/lib/analytics";

const PAGE_NAMES: Record<string, string> = {
  "/": "homepage",
  "/pitch": "pitch_page",
  "/work": "work_page",
  "/experiments": "experiments_page",
  "/mcp": "mcp_page",
};

const PostHogPageView = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const pageName = PAGE_NAMES[pathname] || pathname.replace(/\//g, "_").slice(1) || "unknown";
      trackPageView(pageName);
    }
  }, [pathname, searchParams]);

  return null;
};

export const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  );
};
