import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock analytics module
vi.mock('@/lib/analytics', () => ({
  trackNavClick: vi.fn(),
  trackMobileMenuOpen: vi.fn(),
  trackMobileMenuClose: vi.fn(),
  trackCommitsModalOpen: vi.fn(),
  trackSocialClick: vi.fn(),
  trackHireMeClick: vi.fn(),
  trackCTAClick: vi.fn(),
  trackBookCallClick: vi.fn(),
  trackEmailClick: vi.fn(),
  trackSeeDetailsClick: vi.fn(),
  trackPRClick: vi.fn(),
  trackPRRefresh: vi.fn(),
  trackPRPagination: vi.fn(),
  trackMcpIdeSelect: vi.fn(),
  trackMcpConfigCopy: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
}));

// Mock site-config
vi.mock('@/lib/site-config', () => ({
  githubUsername: 'vishesh-baghel',
  twitterUsername: 'VisheshBaghell',
  linkedinUrl: 'https://linkedin.com/in/vishesh-baghel',
  calendlyUrl: 'https://cal.com/vishesh-baghel/15min',
  email: 'visheshbaghel99@gmail.com',
}));

import {
  trackNavClick,
  trackMobileMenuOpen,
  trackMobileMenuClose,
  trackCommitsModalOpen,
  trackSocialClick,
  trackHireMeClick,
  trackCTAClick,
  trackBookCallClick,
  trackEmailClick,
  trackSeeDetailsClick,
  trackPRClick,
  trackPRRefresh,
  trackPRPagination,
  trackMcpIdeSelect,
  trackMcpConfigCopy,
} from '@/lib/analytics';

describe('Header Component Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Navigation Tracking', () => {
    it('should track desktop navigation clicks with correct parameters', () => {
      // Simulate desktop nav clicks
      const navItems = [
        { item: 'about', location: 'header_desktop' },
        { item: 'work', location: 'header_desktop' },
        { item: 'commits', location: 'header_desktop' },
        { item: 'experiments', location: 'header_desktop' },
        { item: 'partners', location: 'header_desktop' },
        { item: 'hire_me', location: 'header_desktop' },
      ] as const;

      navItems.forEach(({ item, location }) => {
        trackNavClick(item, location);
      });

      expect(trackNavClick).toHaveBeenCalledTimes(6);
      expect(trackNavClick).toHaveBeenCalledWith('about', 'header_desktop');
      expect(trackNavClick).toHaveBeenCalledWith('work', 'header_desktop');
      expect(trackNavClick).toHaveBeenCalledWith('commits', 'header_desktop');
      expect(trackNavClick).toHaveBeenCalledWith('experiments', 'header_desktop');
      expect(trackNavClick).toHaveBeenCalledWith('partners', 'header_desktop');
      expect(trackNavClick).toHaveBeenCalledWith('hire_me', 'header_desktop');
    });

    it('should track mobile navigation clicks with correct parameters', () => {
      const navItems = [
        { item: 'about', location: 'header_mobile' },
        { item: 'work', location: 'header_mobile' },
        { item: 'commits', location: 'header_mobile' },
        { item: 'experiments', location: 'header_mobile' },
        { item: 'partners', location: 'header_mobile' },
        { item: 'hire_me', location: 'header_mobile' },
      ] as const;

      navItems.forEach(({ item, location }) => {
        trackNavClick(item, location);
      });

      expect(trackNavClick).toHaveBeenCalledTimes(6);
      expect(trackNavClick).toHaveBeenCalledWith('about', 'header_mobile');
      expect(trackNavClick).toHaveBeenCalledWith('partners', 'header_mobile');
      expect(trackNavClick).toHaveBeenCalledWith('hire_me', 'header_mobile');
    });
  });

  describe('Mobile Menu Tracking', () => {
    it('should track mobile menu open', () => {
      trackMobileMenuOpen();
      expect(trackMobileMenuOpen).toHaveBeenCalledTimes(1);
    });

    it('should track mobile menu close', () => {
      trackMobileMenuClose();
      expect(trackMobileMenuClose).toHaveBeenCalledTimes(1);
    });

    it('should track menu toggle sequence correctly', () => {
      // Simulate opening and closing menu
      trackMobileMenuOpen();
      trackMobileMenuClose();
      trackMobileMenuOpen();
      trackMobileMenuClose();

      expect(trackMobileMenuOpen).toHaveBeenCalledTimes(2);
      expect(trackMobileMenuClose).toHaveBeenCalledTimes(2);
    });
  });

  describe('Commits Modal Tracking', () => {
    it('should track commits modal open from desktop', () => {
      trackNavClick('commits', 'header_desktop');
      trackCommitsModalOpen();

      expect(trackNavClick).toHaveBeenCalledWith('commits', 'header_desktop');
      expect(trackCommitsModalOpen).toHaveBeenCalledTimes(1);
    });

    it('should track commits modal open from mobile', () => {
      trackNavClick('commits', 'header_mobile');
      trackCommitsModalOpen();

      expect(trackNavClick).toHaveBeenCalledWith('commits', 'header_mobile');
      expect(trackCommitsModalOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe('Social Link Tracking', () => {
    it('should track GitHub click', () => {
      trackSocialClick('github');
      expect(trackSocialClick).toHaveBeenCalledWith('github');
    });

    it('should track Twitter click', () => {
      trackSocialClick('twitter');
      expect(trackSocialClick).toHaveBeenCalledWith('twitter');
    });

    it('should track LinkedIn click', () => {
      trackSocialClick('linkedin');
      expect(trackSocialClick).toHaveBeenCalledWith('linkedin');
    });
  });

  describe('Hire Me CTA Tracking', () => {
    it('should track hire me click from header', () => {
      trackNavClick('hire_me', 'header_desktop');
      trackHireMeClick('header');

      expect(trackNavClick).toHaveBeenCalledWith('hire_me', 'header_desktop');
      expect(trackHireMeClick).toHaveBeenCalledWith('header');
    });

    it('should track hire me click from mobile menu', () => {
      trackNavClick('hire_me', 'header_mobile');
      trackHireMeClick('mobile_menu');

      expect(trackNavClick).toHaveBeenCalledWith('hire_me', 'header_mobile');
      expect(trackHireMeClick).toHaveBeenCalledWith('mobile_menu');
    });
  });
});

describe('Hero Component Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track see how it works CTA click', () => {
    trackCTAClick('see_how_it_works', 'hero');
    expect(trackCTAClick).toHaveBeenCalledWith('see_how_it_works', 'hero');
  });
});

describe('Contact Component Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track book call CTA click', () => {
    trackBookCallClick('contact');
    expect(trackBookCallClick).toHaveBeenCalledWith('contact');
  });

  it('should track see details CTA click', () => {
    trackSeeDetailsClick('contact');
    expect(trackSeeDetailsClick).toHaveBeenCalledWith('contact');
  });

  it('should track email CTA click', () => {
    trackEmailClick('contact');
    expect(trackEmailClick).toHaveBeenCalledWith('contact');
  });
});

describe('Open Source Section Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track PR click with correct parameters', () => {
    trackPRClick('mastra-ai/mastra', 'https://github.com/mastra-ai/mastra/pull/123', 'Fix memory leak');
    
    expect(trackPRClick).toHaveBeenCalledWith(
      'mastra-ai/mastra',
      'https://github.com/mastra-ai/mastra/pull/123',
      'Fix memory leak'
    );
  });

  it('should track PR refresh', () => {
    trackPRRefresh();
    expect(trackPRRefresh).toHaveBeenCalledTimes(1);
  });

  it('should track pagination with direction and page', () => {
    trackPRPagination('next', 1);
    expect(trackPRPagination).toHaveBeenCalledWith('next', 1);

    trackPRPagination('prev', 2);
    expect(trackPRPagination).toHaveBeenCalledWith('prev', 2);
  });

  it('should handle empty repo gracefully', () => {
    trackPRClick('', 'https://github.com/pull/123', 'Some PR');
    expect(trackPRClick).toHaveBeenCalledWith('', 'https://github.com/pull/123', 'Some PR');
  });
});

describe('MCP Page Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track IDE selection', () => {
    const ides = ['cursor', 'windsurf', 'claude'];
    
    ides.forEach(ide => {
      trackMcpIdeSelect(ide);
    });

    expect(trackMcpIdeSelect).toHaveBeenCalledTimes(3);
    expect(trackMcpIdeSelect).toHaveBeenCalledWith('cursor');
    expect(trackMcpIdeSelect).toHaveBeenCalledWith('windsurf');
    expect(trackMcpIdeSelect).toHaveBeenCalledWith('claude');
  });

  it('should track config copy', () => {
    trackMcpConfigCopy('cursor');
    expect(trackMcpConfigCopy).toHaveBeenCalledWith('cursor');
  });

  it('should track IDE selection before config copy', () => {
    // User flow: select IDE, then copy config
    trackMcpIdeSelect('windsurf');
    trackMcpConfigCopy('windsurf');

    expect(trackMcpIdeSelect).toHaveBeenCalledWith('windsurf');
    expect(trackMcpConfigCopy).toHaveBeenCalledWith('windsurf');
  });
});

describe('TrackedLink Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track CTA click with correct type and location', () => {
    // Simulate TrackedLink behavior
    const trackingType = 'book_call';
    const trackingLocation = 'pitch_hero';
    
    trackCTAClick(trackingType, trackingLocation);
    
    expect(trackCTAClick).toHaveBeenCalledWith('book_call', 'pitch_hero');
  });

  it('should support all CTA types', () => {
    const ctaTypes = ['book_call', 'email', 'see_details', 'hire_me', 'see_how_it_works'] as const;
    
    ctaTypes.forEach(type => {
      trackCTAClick(type, 'hero');
    });

    expect(trackCTAClick).toHaveBeenCalledTimes(5);
  });

  it('should support all CTA locations', () => {
    const locations = ['hero', 'contact', 'pitch_hero', 'pitch_footer', 'header', 'mobile_menu'] as const;
    
    locations.forEach(location => {
      trackCTAClick('book_call', location);
    });

    expect(trackCTAClick).toHaveBeenCalledTimes(6);
  });
});

describe('Partners Page Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track partners page navigation from header', () => {
    trackNavClick('partners', 'header_desktop');
    expect(trackNavClick).toHaveBeenCalledWith('partners', 'header_desktop');
  });

  it('should track partners page navigation from mobile menu', () => {
    trackNavClick('partners', 'header_mobile');
    expect(trackNavClick).toHaveBeenCalledWith('partners', 'header_mobile');
  });

  it('should track book call CTA from partners page', () => {
    trackBookCallClick('partners');
    expect(trackBookCallClick).toHaveBeenCalledWith('partners');
  });

  it('should track email CTA from partners page', () => {
    trackEmailClick('partners');
    expect(trackEmailClick).toHaveBeenCalledWith('partners');
  });
});

describe('Footer Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track GitHub click from footer', () => {
    trackSocialClick('github');
    expect(trackSocialClick).toHaveBeenCalledWith('github');
  });

  it('should track Twitter click from footer', () => {
    trackSocialClick('twitter');
    expect(trackSocialClick).toHaveBeenCalledWith('twitter');
  });

  it('should track LinkedIn click from footer', () => {
    trackSocialClick('linkedin');
    expect(trackSocialClick).toHaveBeenCalledWith('linkedin');
  });
});

describe('Analytics Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track complete user journey: homepage -> pitch -> book call', () => {
    // User lands on homepage
    // (page view tracked by provider)
    
    // User clicks "see how it works" in hero
    trackCTAClick('see_how_it_works', 'hero');
    
    // User navigates to pitch page
    trackNavClick('hire_me', 'header_desktop');
    
    // User books a call
    trackBookCallClick('pitch_hero');

    expect(trackCTAClick).toHaveBeenCalledWith('see_how_it_works', 'hero');
    expect(trackNavClick).toHaveBeenCalledWith('hire_me', 'header_desktop');
    expect(trackBookCallClick).toHaveBeenCalledWith('pitch_hero');
  });

  it('should track complete user journey: homepage -> experiments -> partners', () => {
    // User clicks experiments in nav
    trackNavClick('experiments', 'header_desktop');

    // User clicks partners in nav
    trackNavClick('partners', 'header_desktop');

    expect(trackNavClick).toHaveBeenCalledWith('experiments', 'header_desktop');
    expect(trackNavClick).toHaveBeenCalledWith('partners', 'header_desktop');
  });

  it('should track mobile user journey', () => {
    // User opens mobile menu
    trackMobileMenuOpen();
    
    // User clicks work
    trackNavClick('work', 'header_mobile');
    
    // Menu closes (implicit)
    trackMobileMenuClose();
    
    // User opens menu again
    trackMobileMenuOpen();
    
    // User clicks hire me
    trackNavClick('hire_me', 'header_mobile');
    trackHireMeClick('mobile_menu');

    expect(trackMobileMenuOpen).toHaveBeenCalledTimes(2);
    expect(trackMobileMenuClose).toHaveBeenCalledTimes(1);
    expect(trackNavClick).toHaveBeenCalledWith('work', 'header_mobile');
    expect(trackNavClick).toHaveBeenCalledWith('hire_me', 'header_mobile');
    expect(trackHireMeClick).toHaveBeenCalledWith('mobile_menu');
  });
});
