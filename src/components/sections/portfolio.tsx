import React from 'react';

interface Company {
  name: string;
  href: string;
  status?: string;
}

const portfolioCompanies: Company[] = [
  { name: 'ashby', href: 'https://www.ashbyhq.com/' },
  { name: 'astral', href: 'https://www.astral.sh/' },
  { name: 'baseten', href: 'https://www.baseten.co/' },
  { name: 'braintrust', href: 'https://www.braintrust.dev/' },
  { name: 'browserbase', href: 'https://www.browserbase.com/' },
  { name: 'default', href: 'https://www.default.com/' },
  { name: 'diagram', href: 'https://diagram-figma.webflow.io/', status: '(acquired by figma)' },
  { name: 'doss', href: 'https://doss.com/' },
  { name: 'graphite', href: 'https://graphite.dev/' },
  { name: 'mainframe', href: 'https://mainfra.me/' },
  { name: 'matic', href: 'https://maticrobots.com/' },
  { name: 'mastra', href: 'https://www.mastra.ai/' },
  { name: 'meticulous', href: 'https://meticulous.ai/' },
  { name: 'orb', href: 'https://www.withorb.com/' },
  { name: 'paper', href: 'https://paper.design/' },
  { name: 'quanta', href: 'https://usequanta.com/' },
  { name: 'resend', href: 'https://resend.com/' },
  { name: 'sf compute', href: 'https://sfcompute.com/' },
  { name: 'supabase', href: 'https://supabase.com/' },
  { name: 'vercel', href: 'https://vercel.com/' },
  { name: 'windsurf', href: 'https://windsurf.com/', status: '(exited)' },
];

const PortfolioSection = () => {
  return (
    <section className="py-10 font-mono">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-bold cursor-default text-text-primary">
          early partner to iconic companies
        </h2>
        <button className="hidden md:block text-sm p-2 rounded-lg border border-border bg-background text-text-primary hover:border-muted-foreground transition-colors">
          [l] logo view
        </button>
      </div>

      <div className="relative">
        <div className="flex flex-col">
          {portfolioCompanies.map((company) => (
            <div key={company.name} className="flex items-center gap-2 text-sm leading-6">
              <span className="text-text-primary">+</span>
              <div className="flex items-center gap-1">
                <a
                  href={company.href}
                  className="relative inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-sm underline text-accent-red hover:text-text-primary transition-colors">
                    {company.name}
                  </span>
                  {company.status && (
                    <span className="text-sm text-text-secondary no-underline">
                      {' '}{company.status}
                    </span>
                  )}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;