import React from 'react';
// no client-only icons or external deps needed here

const ContactSection = () => {
  return (
    <section className="py-6 font-mono">
      <h2 className="text-base sm:text-lg font-bold cursor-default text-text-primary mt-0 mb-3">work together</h2>
      <p className="text-sm sm:text-base mb-4">
        open to selective freelance and consulting — mvp shipping, infra hardening, or integrating ai in real products.
      </p>

      <p className="text-sm sm:text-base">
        <a
          href={`mailto:visheshbaghel99@gmail.com?subject=${encodeURIComponent('project inquiry: your name / company')}`}
          className="underline"
        >
          email me
        </a>
        <span> or </span>
        <a
          href="https://cal.com/vishesh-baghel/15min"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          book a 15‑min intro
        </a>
      </p>
    </section>
  );
};

export default ContactSection;
