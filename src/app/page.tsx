import React from 'react';
import Header from '@/components/sections/header';
import HeroSection from '@/components/sections/hero';
import ApproachSection from '@/components/sections/approach';
import PortfolioSection from '@/components/sections/portfolio';
import TestimonialSection from '@/components/sections/testimonial';
import CtaSection from '@/components/sections/cta';
import Footer from '@/components/sections/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-primary font-mono">
      <div className="max-w-[800px] mx-auto px-10 py-16 md:px-16 md:py-20">
        <Header />
        
        <main className="space-y-20">
          <HeroSection />
          <ApproachSection />
          <PortfolioSection />
          <TestimonialSection />
          <CtaSection />
        </main>
        
        <Footer />
      </div>
    </div>
  );
}