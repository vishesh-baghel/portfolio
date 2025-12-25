import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Analytics Module', () => {
  const originalWindow = global.window;
  const originalDocument = global.document;

  const mockInit = vi.fn();
  const mockCapture = vi.fn();
  const mockIdentify = vi.fn();
  const mockReset = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();
    mockInit.mockClear();
    mockCapture.mockClear();
    mockIdentify.mockClear();
    mockReset.mockClear();

    vi.resetModules();

    vi.doMock('posthog-js', () => ({
      default: {
        init: mockInit,
        capture: mockCapture,
        identify: mockIdentify,
        reset: mockReset,
      },
    }));

    global.window = {
      location: {
        href: 'https://visheshbaghel.com/test',
        pathname: '/test',
      },
    } as any;

    global.document = {
      referrer: 'https://google.com',
    } as any;

    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'test_key';
  });

  afterEach(() => {
    global.window = originalWindow;
    global.document = originalDocument;
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    vi.doUnmock('posthog-js');
  });

  describe('initPostHog', () => {
    it('should initialize PostHog with correct config', async () => {
      const { initPostHog } = await import('../analytics');
      initPostHog();

      expect(mockInit).toHaveBeenCalledWith(
        'test_key',
        expect.objectContaining({
          api_host: 'https://us.i.posthog.com',
          person_profiles: 'identified_only',
          capture_pageview: false,
        })
      );
    });

    it('should not initialize twice', async () => {
      const { initPostHog } = await import('../analytics');
      initPostHog();
      initPostHog();
      expect(mockInit).toHaveBeenCalledTimes(1);
    });

    it('should not initialize on server side', async () => {
      global.window = undefined as any;
      const { initPostHog } = await import('../analytics');
      initPostHog();
      expect(mockInit).not.toHaveBeenCalled();
    });
  });

  describe('Page View Events', () => {
    it('trackPageView should capture with correct properties', async () => {
      const { initPostHog, trackPageView } = await import('../analytics');
      initPostHog();
      trackPageView('test_page', { custom: 'property' });

      expect(mockCapture).toHaveBeenCalledWith('$pageview', {
        page_name: 'test_page',
        url: 'https://visheshbaghel.com/test',
        path: '/test',
        referrer: 'https://google.com',
        custom: 'property',
      });
    });
  });

  describe('CTA Click Events', () => {
    it('trackCTAClick should capture with type and location', async () => {
      const { initPostHog, trackCTAClick } = await import('../analytics');
      initPostHog();
      trackCTAClick('book_call', 'hero', { extra: 'data' });

      expect(mockCapture).toHaveBeenCalledWith('cta_clicked', {
        cta_type: 'book_call',
        location: 'hero',
        page: '/test',
        extra: 'data',
      });
    });
  });

  describe('Navigation Events', () => {
    it('trackNavClick should capture navigation click', async () => {
      const { initPostHog, trackNavClick } = await import('../analytics');
      initPostHog();
      trackNavClick('work', 'header_desktop');

      expect(mockCapture).toHaveBeenCalledWith('nav_clicked', {
        nav_item: 'work',
        nav_location: 'header_desktop',
        from_page: '/test',
      });
    });

    it('trackMobileMenuOpen should capture mobile menu open', async () => {
      const { initPostHog, trackMobileMenuOpen } = await import('../analytics');
      initPostHog();
      trackMobileMenuOpen();
      expect(mockCapture).toHaveBeenCalledWith('mobile_menu_opened');
    });
  });

  describe('External Link Events', () => {
    it('trackExternalLinkClick should capture external link click', async () => {
      const { initPostHog, trackExternalLinkClick } = await import('../analytics');
      initPostHog();
      trackExternalLinkClick('github', 'https://github.com/vishesh-baghel', { repo: 'portfolio' });

      expect(mockCapture).toHaveBeenCalledWith('external_link_clicked', {
        link_type: 'github',
        url: 'https://github.com/vishesh-baghel',
        page: '/test',
        repo: 'portfolio',
      });
    });
  });

  describe('MCP Page Events', () => {
    it('trackMcpIdeSelect should capture IDE selection', async () => {
      const { initPostHog, trackMcpIdeSelect } = await import('../analytics');
      initPostHog();
      trackMcpIdeSelect('cursor');
      expect(mockCapture).toHaveBeenCalledWith('mcp_ide_selected', { ide: 'cursor' });
    });

    it('trackMcpConfigCopy should capture config copy', async () => {
      const { initPostHog, trackMcpConfigCopy } = await import('../analytics');
      initPostHog();
      trackMcpConfigCopy('windsurf');
      expect(mockCapture).toHaveBeenCalledWith('mcp_config_copied', { ide: 'windsurf' });
    });
  });

  describe('Open Source Events', () => {
    it('trackPRClick should capture PR click', async () => {
      const { initPostHog, trackPRClick } = await import('../analytics');
      initPostHog();
      trackPRClick('mastra-ai/mastra', 'https://github.com/mastra-ai/mastra/pull/123', 'Fix bug');

      expect(mockCapture).toHaveBeenCalledWith('pr_clicked', {
        repo: 'mastra-ai/mastra',
        pr_url: 'https://github.com/mastra-ai/mastra/pull/123',
        pr_title: 'Fix bug',
      });
    });

    it('trackPRRefresh should capture PR refresh', async () => {
      const { initPostHog, trackPRRefresh } = await import('../analytics');
      initPostHog();
      trackPRRefresh();
      expect(mockCapture).toHaveBeenCalledWith('pr_list_refreshed');
    });
  });

  describe('Error Events', () => {
    it('trackError should capture error with context', async () => {
      const { initPostHog, trackError } = await import('../analytics');
      initPostHog();
      trackError('api_error', 'Failed to fetch', { endpoint: '/api/prs' });

      expect(mockCapture).toHaveBeenCalledWith('error_occurred', {
        error_type: 'api_error',
        error_message: 'Failed to fetch',
        page: '/test',
        endpoint: '/api/prs',
      });
    });
  });

  describe('User Identification', () => {
    it('identifyUser should identify user', async () => {
      const { initPostHog, identifyUser } = await import('../analytics');
      initPostHog();
      identifyUser('user_123', { email: 'test@example.com' });
      expect(mockIdentify).toHaveBeenCalledWith('user_123', { email: 'test@example.com' });
    });

    it('resetUser should reset user session', async () => {
      const { initPostHog, resetUser } = await import('../analytics');
      initPostHog();
      resetUser();
      expect(mockReset).toHaveBeenCalled();
    });
  });

  describe('Server-side Safety', () => {
    it('should not call posthog when window is undefined', async () => {
      global.window = undefined as any;
      const analytics = await import('../analytics');
      analytics.initPostHog();
      analytics.trackPageView('test');
      analytics.trackCTAClick('book_call', 'hero');
      expect(mockCapture).not.toHaveBeenCalled();
    });
  });
});

describe('Analytics Performance', () => {
  const originalWindow = global.window;
  const mockCapture = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    vi.doMock('posthog-js', () => ({
      default: {
        init: vi.fn(),
        capture: mockCapture,
        identify: vi.fn(),
        reset: vi.fn(),
      },
    }));

    global.window = {
      location: { href: 'https://visheshbaghel.com/test', pathname: '/test' },
    } as any;
    global.document = { referrer: '' } as any;
    process.env.NEXT_PUBLIC_POSTHOG_KEY = 'test_key';
  });

  afterEach(() => {
    global.window = originalWindow;
    delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
  });

  it('should not block main thread when tracking many events', async () => {
    const { initPostHog, trackPageView, trackCTAClick } = await import('../analytics');
    initPostHog();
    
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      trackPageView('page');
      trackCTAClick('book_call', 'hero');
    }
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(50);
  });

  it('should handle missing window gracefully', async () => {
    global.window = undefined as any;
    const analytics = await import('../analytics');
    
    expect(() => analytics.trackPageView('test')).not.toThrow();
    expect(() => analytics.trackCTAClick('book_call', 'hero')).not.toThrow();
    expect(() => analytics.trackNavClick('work', 'header_desktop')).not.toThrow();
  });
});
