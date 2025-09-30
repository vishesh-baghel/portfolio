import React from 'react';

const items = [
  {
    title: 'kestra-agent',
    href: 'https://github.com/vishesh-baghel/kestra-agent',
    desc: 'agents for workflows, local-first dev, pg in tow.'
  },
  {
    title: 'docs-chatbot',
    href: 'https://github.com/vishesh-baghel/docs-chatbot',
    desc: 'deploy a chatbot that talks to your docs.'
  },
  {
    title: 'glide',
    href: 'https://github.com/vishesh-baghel/glide',
    desc: 'github app for code review, built on probot/octokit.'
  },
  {
    title: 'kestra-mcp-doc-server',
    href: 'https://github.com/vishesh-baghel/kestra-mcp-doc-server',
    desc: 'mcp docs server utilities.'
  },
];

const CurrentWorkSection = () => {
  return (
    <section className="py-6 font-mono">
      <h2 className="text-lg font-bold cursor-default text-text-primary mt-0 mb-2">current work</h2>
      <div className="grid gap-3">
        {items.map((it) => (
          <article key={it.title} className="border border-border bg-card/60 hover:bg-card transition-colors p-3">
            <header className="mb-1 flex items-center gap-2">
              <a className="underline text-accent-red" href={it.href} target="_blank" rel="noreferrer">
                {it.title}
              </a>
            </header>
            <p className="text-sm">{it.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CurrentWorkSection;
