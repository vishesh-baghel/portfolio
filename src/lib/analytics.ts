/**
 * PostHog Analytics
 *
 * Tracks user behavior across the portfolio to understand:
 * - Which pages attract the most visitors
 * - How users navigate through the site
 * - Which CTAs convert (book call, email, pitch page)
 * - User engagement patterns (scroll depth, time on page)
 * - Content that resonates (experiments, work, open source)
 *
 * Events tracked:
 * - Page views (homepage, pitch, work, experiments, mcp)
 * - CTA clicks (book call, email, see details, hire me)
 * - Navigation (header links, mobile menu, footer)
 * - External links (social, calendly, github)
 * - Modal interactions (commits, search)
 * - Content engagement (scroll depth, section visibility)
 * - Experiment interactions (view, category filter)
 */

import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

let initialized = false;

export const initPostHog = () => {
  if (typeof window === "undefined") return;
  if (initialized) return;
  if (!POSTHOG_KEY) {
    console.warn("PostHog key not configured - analytics disabled");
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: false,
  });

  initialized = true;
};

export const isInitialized = () => initialized;

// ============================================================================
// Page View Events
// ============================================================================

export const trackPageView = (pageName: string, properties?: Record<string, unknown>) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("$pageview", {
    page_name: pageName,
    url: window.location.href,
    path: window.location.pathname,
    referrer: document.referrer,
    ...properties,
  });
};

export const trackHomepageView = () => {
  trackPageView("homepage");
};

export const trackPitchPageView = () => {
  trackPageView("pitch_page");
};

export const trackWorkPageView = () => {
  trackPageView("work_page");
};

export const trackExperimentsPageView = () => {
  trackPageView("experiments_page");
};

export const trackExperimentDetailView = (slug: string, title: string, category: string) => {
  trackPageView("experiment_detail", {
    experiment_slug: slug,
    experiment_title: title,
    experiment_category: category,
  });
};

export const trackMcpPageView = () => {
  trackPageView("mcp_page");
};

// ============================================================================
// CTA Click Events - Critical for conversion tracking
// ============================================================================

export type CTALocation = "hero" | "contact" | "pitch_hero" | "pitch_footer" | "header" | "mobile_menu";
export type CTAType = "book_call" | "email" | "see_details" | "hire_me" | "see_how_it_works";

export const trackCTAClick = (ctaType: CTAType, location: CTALocation, properties?: Record<string, unknown>) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("cta_clicked", {
    cta_type: ctaType,
    location,
    page: window.location.pathname,
    ...properties,
  });
};

export const trackBookCallClick = (location: CTALocation) => {
  trackCTAClick("book_call", location);
};

export const trackEmailClick = (location: CTALocation) => {
  trackCTAClick("email", location);
};

export const trackSeeDetailsClick = (location: CTALocation) => {
  trackCTAClick("see_details", location);
};

export const trackHireMeClick = (location: CTALocation) => {
  trackCTAClick("hire_me", location);
};

// ============================================================================
// Navigation Events
// ============================================================================

export type NavItem = "about" | "work" | "commits" | "experiments" | "mcp" | "hire_me" | "home";
export type NavLocation = "header_desktop" | "header_mobile" | "footer";

export const trackNavClick = (item: NavItem, location: NavLocation) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("nav_clicked", {
    nav_item: item,
    nav_location: location,
    from_page: window.location.pathname,
  });
};

export const trackMobileMenuOpen = () => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("mobile_menu_opened");
};

export const trackMobileMenuClose = () => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("mobile_menu_closed");
};

// ============================================================================
// External Link Events
// ============================================================================

export type ExternalLinkType = "github" | "twitter" | "linkedin" | "calendly" | "email" | "project_link" | "commit_link" | "experiment_link";

export const trackExternalLinkClick = (linkType: ExternalLinkType, url: string, context?: Record<string, unknown>) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("external_link_clicked", {
    link_type: linkType,
    url,
    page: window.location.pathname,
    ...context,
  });
};

export const trackSocialClick = (platform: "github" | "twitter" | "linkedin") => {
  trackExternalLinkClick(platform, "", { location: "header" });
};

// ============================================================================
// Modal Events
// ============================================================================

export const trackCommitsModalOpen = () => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("commits_modal_opened");
};

export const trackCommitsModalClose = () => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("commits_modal_closed");
};

export const trackCommitClick = (repo: string, commitUrl: string) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("commit_clicked", {
    repo,
    commit_url: commitUrl,
  });
};

export const trackSearchModalOpen = () => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("search_modal_opened");
};

export const trackSearchModalClose = () => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("search_modal_closed");
};

export const trackSearchQuery = (query: string, resultsCount: number) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("search_performed", {
    query,
    results_count: resultsCount,
  });
};

export const trackSearchResultClick = (resultType: string, resultTitle: string) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("search_result_clicked", {
    result_type: resultType,
    result_title: resultTitle,
  });
};

// ============================================================================
// Content Engagement Events
// ============================================================================

export const trackSectionView = (sectionName: string) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("section_viewed", {
    section_name: sectionName,
    page: window.location.pathname,
  });
};

export const trackScrollDepth = (depth: number) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("scroll_depth", {
    depth_percentage: depth,
    page: window.location.pathname,
  });
};

export const trackTimeOnPage = (seconds: number, pageName: string) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("time_on_page", {
    duration_seconds: seconds,
    page_name: pageName,
  });
};

// ============================================================================
// Work Page Events
// ============================================================================

export const trackWorkEntryClick = (projectTitle: string, client: string, link?: string) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("work_entry_clicked", {
    project_title: projectTitle,
    client,
    link,
  });
};

// ============================================================================
// Experiments Page Events
// ============================================================================

export const trackExperimentClick = (slug: string, title: string, category: string) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("experiment_clicked", {
    experiment_slug: slug,
    experiment_title: title,
    experiment_category: category,
  });
};

export const trackExperimentCategoryFilter = (category: string) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("experiment_category_filtered", {
    category,
  });
};

// ============================================================================
// MCP Page Events
// ============================================================================

export const trackMcpIdeSelect = (ide: string) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("mcp_ide_selected", {
    ide,
  });
};

export const trackMcpConfigCopy = (ide: string) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("mcp_config_copied", {
    ide,
  });
};

// ============================================================================
// Pitch Page Events - Critical for understanding conversion funnel
// ============================================================================

export const trackPitchSectionView = (sectionName: string) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("pitch_section_viewed", {
    section_name: sectionName,
  });
};

export const trackPitchScrollComplete = () => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("pitch_page_scroll_complete");
};

// ============================================================================
// Open Source Section Events
// ============================================================================

export const trackPRClick = (repo: string, prUrl: string, prTitle: string) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("pr_clicked", {
    repo,
    pr_url: prUrl,
    pr_title: prTitle,
  });
};

export const trackPRRefresh = () => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("pr_list_refreshed");
};

export const trackPRPagination = (direction: "next" | "prev", currentPage: number) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("pr_pagination_clicked", {
    direction,
    current_page: currentPage,
  });
};

// ============================================================================
// Theme Events
// ============================================================================

export const trackThemeChange = (theme: string) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("theme_changed", {
    theme,
  });
};

// ============================================================================
// Error Events
// ============================================================================

export const trackError = (errorType: string, errorMessage: string, context?: Record<string, unknown>) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.capture("error_occurred", {
    error_type: errorType,
    error_message: errorMessage,
    page: window.location.pathname,
    ...context,
  });
};

// ============================================================================
// User Identification (for future use)
// ============================================================================

export const identifyUser = (userId: string, properties?: Record<string, unknown>) => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.identify(userId, properties);
};

export const resetUser = () => {
  if (typeof window === "undefined" || !initialized) return;
  posthog.reset();
};

export { posthog };
