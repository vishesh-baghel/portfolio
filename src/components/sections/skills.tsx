import React from 'react';

const SkillsSection = () => {
  return (
    <section className="py-6 font-mono">
      <h2 className="text-base sm:text-lg font-bold cursor-default text-text-primary mt-0 mb-2">skills</h2>
      <div className="grid gap-2 text-xs sm:text-sm">
        <div><span className="font-semibold">core</span>: typescript, java</div>
        <div><span className="font-semibold">frontend</span>: react, html/css, zustand</div>
        <div><span className="font-semibold">backend</span>: node.js, express.js, spring boot, microservices, kafka</div>
        <div><span className="font-semibold">databases</span>: postgres, redis, mysql</div>
        <div><span className="font-semibold">cloud & infra</span>: aws (lambda, sqs, s3, rds, cognito), docker</div>
        <div><span className="font-semibold">testing</span>: jest, vitest, junit5, mockito, tdd/bdd</div>
        <div><span className="font-semibold">ai tooling</span>: mastra, vector dbs (milvus, lancedb, convexdb)</div>
      </div>
    </section>
  );
};

export default SkillsSection;
