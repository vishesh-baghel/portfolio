import React from 'react';
import Header from '@/components/sections/header';
import HeroSection from '@/components/sections/hero';
import AboutSection from '@/components/sections/about';
import CurrentWorkSection from '@/components/sections/current-work';
import OpenSourceSection from '@/components/sections/open-source';
import SkillsSection from '@/components/sections/skills';
import ContactSection from '@/components/sections/contact';
import Footer from '@/components/sections/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-primary font-mono">
      <div className="max-w-[800px] mx-auto">
        <Header />
        
        <main className="space-y-6">
          <HeroSection />
          <AboutSection />
          <CurrentWorkSection />
          <OpenSourceSection />
          <SkillsSection />
          <ContactSection />
        </main>
        
        <Footer />
      </div>
    </div>
  );
}