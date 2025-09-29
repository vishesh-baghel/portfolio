import React from 'react';

const AboutSection = () => {
  return (
    <section className="py-10 font-mono">
      <h2 className="text-lg font-bold cursor-default text-text-primary mb-4">about</h2>
      <p className="text-sm max-w-xl">
        i write typescript for a living. i work with agents, vector systems, and orchestration. i like clean apis, small
        building blocks, and code that survives refactors. i also take on selective freelance—shipping mvp, hardening
        infra, or integrating ai in real products.
      </p>
    </section>
  );
};

export default AboutSection;
