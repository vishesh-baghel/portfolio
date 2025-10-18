import { useRouter } from 'next/router';

const config = {
  logo: <span className="font-bold">Vishesh Baghel</span>,
  project: {
    link: 'https://github.com/vishesh-baghel',
  },
  docsRepositoryBase: 'https://github.com/vishesh-baghel/portfolio',
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== '/') {
      return {
        titleTemplate: '%s | Vishesh Baghel',
      };
    }
    return {
      titleTemplate: 'Vishesh Baghel',
    };
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Vishesh Baghel - Experiments" />
      <meta property="og:description" content="Technical deep-dives into tools & frameworks" />
    </>
  ),
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  footer: {
    text: (
      <span>
        {new Date().getFullYear()} © Vishesh Baghel
      </span>
    ),
  },
  navigation: {
    prev: true,
    next: true,
  },
  toc: {
    backToTop: true,
  },
};

export default config;
