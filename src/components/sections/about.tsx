import React from 'react';

const AboutSection = () => {
  return (
    <section className="py-6 font-mono">
      <h2 className="text-base sm:text-lg font-bold cursor-default text-text-primary mt-0 mb-2">about</h2>
      <p className="text-sm sm:text-base mb-3">
        i write typescript for a living. i work with agents, vector systems, and orchestration. i like clean apis, small
        building blocks, and code that survives refactors.
      </p>
      <p className="text-sm sm:text-base">
        i take on selective freelance work — shipping mvps, hardening infra, or integrating ai into existing products. 
        $500 for 20 hours of work. if my output is subpar, walk away.
      </p>
    </section>
  );
};

export default AboutSection;
