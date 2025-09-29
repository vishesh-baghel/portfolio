import React from 'react';

const howIWorkItems = [
  "i write the very first check into companies",
  "i lead rounds with $1-5m checks, no board seat",
  "i work with founders pre-product, pre-traction, and often pre-idea",
  "i am often an early beta tester, active user, and paying customer of the products founders build",
  "i put my network to work for founders, making introductions to candidates, customers, and investors",
  "i spend most of my time with people who have not yet started companies and don't take pitch meetings",
];

const whoIWorkWithItems = [
  "former founders who are driven to make a comeback",
  "solo founders who've been told they need a co-founder",
  "underdogs who feel deeply compelled to prove people wrong",
  "builders who can't help themselves from bringing ideas to life",
  "futurists who have strong convictions about where the world is going",
  "anyone who has been told they are too intense, too curious, or too impatient",
];

const ListItem = ({ text }: { text: string }) => (
  <div className="flex items-center space-x-3 text-sm">
    <span>* {text}</span>
  </div>
);

const ApproachSection = () => {
  return (
    <section className="py-10 font-mono">
      {/* Mobile Heading */}
      <div className="md:hidden">
        <h1 className="text-lg font-bold mb-4">no decks, no pitch meetings</h1>
      </div>
      
      {/* Desktop Heading - Replicating HTML structure */}
      <div className="hidden md:block">
        <div className="text-lg font-bold mb-4">
          <div className="inline-block cursor-default" aria-label="no decks, no pitch meetings">
            no decks, no pitch meetings
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <h2 className="font-semibold text-sm">how i work</h2>
          <div className="space-y-3 text-sm">
            {howIWorkItems.map((item, index) => (
              <ListItem key={index} text={item} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="font-semibold text-sm">who i work with</h2>
          <div className="space-y-3 text-sm">
            {whoIWorkWithItems.map((item, index) => (
              <ListItem key={index} text={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApproachSection;