import React from 'react';

const CtaSection = () => {
  return (
    <section className="font-mono">
      <div className="mx-auto px-4 py-5 text-center">
        <h2 className="text-xl font-normal not-italic mt-0 mb-0 md:text-2xl">
          too early to talk to an investor?
          <br />
          <a
            href="https://x.com/alanaagoyal"
            className="text-accent underline hover:opacity-80"
            target="_blank"
            rel="noopener noreferrer"
          >
            talk to a developer.
          </a>
        </h2>
      </div>
    </section>
  );
};

export default CtaSection;