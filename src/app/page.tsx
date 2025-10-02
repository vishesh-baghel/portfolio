import React from 'react';
import Header from '@/components/sections/header';
import HeroSection from '@/components/sections/hero';
import AboutSection from '@/components/sections/about';
import CurrentProjectsSection from '@/components/sections/current-work';
import OpenSourceSection from '@/components/sections/open-source';
import SkillsSection from '@/components/sections/skills';
import ContactSection from '@/components/sections/contact';
import Footer from '@/components/sections/footer';
import { PortfolioSearch } from '@/components/ui/portfolio-search';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-primary font-mono">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <Header />
        
        <main className="space-y-6">
          <HeroSection />
          <AboutSection />
          <OpenSourceSection />
          <CurrentProjectsSection />
          <SkillsSection />
          <ContactSection />
        </main>
        
        <Footer />
      </div>
      
      {/* Portfolio Search - Only show on homepage */}
      <PortfolioSearch />
    </div>
  );
}