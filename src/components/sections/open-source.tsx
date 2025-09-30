import React from 'react';

const items = [
  {
    title: 'mastra',
    href: 'https://github.com/vishesh-baghel/mastra',
    desc: 'ideas + patches around memory, vector, remote apis.'
  },
  {
    title: 'kestra',
    href: 'https://github.com/vishesh-baghel/kestra',
    desc: 'workflow automation—experiments and integrations.'
  },
  {
    title: 'lancedb',
    href: 'https://github.com/vishesh-baghel/lancedb',
    desc: 'vector db experiments, adapters and tests.'
  }
];

const OpenSourceSection = () => {
  return (
    <section className="py-6 font-mono">
      <h2 className="text-base sm:text-lg font-bold cursor-default text-text-primary mt-0 mb-2">recent contributions</h2>
      <div className="grid gap-3">
        {items.map((it) => (
          <article key={it.title} className="border border-border bg-card/60 hover:bg-card transition-colors p-3 sm:p-4">
            <header className="mb-1 flex items-center gap-2">
              <a className="underline text-accent-red text-sm sm:text-base" href={it.href} target="_blank" rel="noreferrer">
                {it.title}
              </a>
            </header>
            <p className="text-xs sm:text-sm">{it.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default OpenSourceSection;
