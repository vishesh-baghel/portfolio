import React from 'react';

const HeroSection = () => {
  return (
    <div className="max-w-xl py-5">
      <h1 className="text-3xl font-bold mb-4 cursor-default h-[80px] sm:h-auto">
        <span className="inline-block">
          <span className="whitespace-pre-wrap md:whitespace-nowrap">
            first check to open source
          </span>
        </span>
      </h1>
      <p className="text-sm">
        i build agents, infra, and tools for developers. i contribute to frameworks i rely on and ship pragmatic ai products.
      </p>
    </div>
  );
};

export default HeroSection;