import React from 'react';

const SkillsSection = () => {
  return (
    <section className="py-6 font-mono">
      <h2 className="text-lg font-bold cursor-default text-text-primary mt-0 mb-2">skills</h2>
      <div className="grid gap-2 text-sm">
        <div>typescript, node, next</div>
        <div>agents, rag, vector dbs</div>
        <div>github apps, ci/cd</div>
        <div>java/kafka when needed</div>
      </div>
    </section>
  );
};

export default SkillsSection;
