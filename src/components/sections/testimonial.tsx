import React from 'react';

const TestimonialSection = () => {
  return (
    <section className="my-20">
      <div className="flex items-start gap-x-10">
        <blockquote className="flex-grow m-0 border-l-4 border-testimonial-border pl-6">
          <p className="text-base leading-[1.6]">
            client testimonials will appear here once projects are completed.
          </p>
          <p className="mt-4 text-base leading-[1.6] text-muted-foreground">
            — placeholder for future testimonials
          </p>
        </blockquote>
      </div>
    </section>
  );
};

export default TestimonialSection;