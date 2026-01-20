import React from "react";

const items = [
  {
    title: "squad",
    github:
      "https://github.com/vishesh-baghel/experiments/tree/main/packages/squad",
    live: "https://squad.visheshbaghel.com",
    desc: "deploy personal ai agents to your own infrastructure with one click.",
  },
  {
    title: "jack",
    github:
      "https://github.com/vishesh-baghel/experiments/tree/main/packages/jack-x-agent",
    live: "https://jack.visheshbaghel.com",
    desc: "ai agent that learns your voice and creates x content ideas from top creators.",
  },
  {
    title: "sensie",
    github:
      "https://github.com/vishesh-baghel/experiments/tree/main/packages/sensie",
    live: "https://sensie.visheshbaghel.com",
    desc: "personal ai teacher with socratic questioning and spaced repetition.",
  },
  {
    title: "memory",
    github:
      "https://github.com/vishesh-baghel/experiments/tree/main/packages/memory",
    live: "https://memory.visheshbaghel.com",
    desc: "database and memory management system for ai agents with drizzle and libsql.",
  },
];

const CurrentProjectsSection = () => {
  return (
    <section className="py-6 font-mono">
      <h2 className="text-base sm:text-lg font-bold cursor-default text-text-primary mt-0 mb-2">
        noteworthy projects
      </h2>
      <div className="grid gap-3">
        {items.map((it) => (
          <article
            key={it.title}
            className="border border-border bg-card/60 hover:bg-card transition-colors p-3 sm:p-4"
          >
            <header className="mb-1 flex items-center gap-2">
              <a
                className="underline text-accent-red text-sm sm:text-base"
                href={it.github}
                target="_blank"
                rel="noreferrer"
              >
                {it.title}
              </a>
              <span className="text-text-secondary text-xs">·</span>
              <a
                className="underline text-text-secondary hover:text-accent-red text-xs sm:text-sm transition-colors"
                href={it.live}
                target="_blank"
                rel="noreferrer"
              >
                live
              </a>
            </header>
            <p className="text-xs sm:text-sm">{it.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CurrentProjectsSection;
