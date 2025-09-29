import React from 'react';

const TestimonialSection = () => {
  return (
    <section className="my-20">
      <div className="flex items-start gap-x-10">
        <blockquote className="flex-grow m-0 border-l-4 border-testimonial-border pl-6">
          <p className="text-base leading-[1.6]">
            “alana is a rare breed of investor who genuinely cares to understand your product, use it, and recommend it. i still get great feedback from her and her network to improve vercel, next.js, v0, and more. we're proud to have her as an investor.”
          </p>
          <p className="mt-4 text-base leading-[1.6]">
            —{' '}
            <a
              href="https://vercel.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-red"
            >
              guillermo rauch
            </a>
            , founder &amp; ceo, vercel
          </p>
        </blockquote>
        <button
          type="button"
          className="hidden md:inline-block shrink-0 text-base border border-border py-1 px-2"
        >
          [n] next
        </button>
      </div>
    </section>
  );
};

export default TestimonialSection;