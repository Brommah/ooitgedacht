/**
 * Hero - Main landing page component
 * 
 * This component has been refactored into modular sub-components.
 * See components/landing/ for individual section implementations.
 */
import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AppState } from '../types';

// Landing page sections
import {
  HeroSection,
  Navigation,
  MobileMenu,
  ResultShowcase,
  DashboardPreviewSection,
  PassportSection,
  HowItWorksSection,
  StakeholderSection,
  MarketReportSection,
  DashboardSection,
  FAQSection,
  B2BSection,
  NewsletterSection,
  Footer,
} from './landing';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  setAppState: (state: AppState) => void;
}

/**
 * Main Hero component
 * Orchestrates all landing page sections
 */
export const Hero: React.FC<HeroProps> = ({ setAppState }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuMounted, setMobileMenuMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sticky header on scroll + reading progress
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      
      // Calculate reading progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = Math.min(Math.round((scrolled / documentHeight) * 100), 100);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#0a1628] w-full text-white">
      {/* 1. HERO SECTION */}
      <HeroSection setAppState={setAppState} />

        {/* Navigation - Premium, floating glassmorphism design */}
      <Navigation
        isScrolled={isScrolled}
        scrollProgress={scrollProgress}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setMobileMenuMounted={setMobileMenuMounted}
        setAppState={setAppState}
      />

        {/* Mobile Menu - Clean Transparent Overlay */}
        {mobileMenuMounted && (
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          setAppState={setAppState}
        />
        )}

      {/* 2. DIT IS WAT JE KRIJGT - Result Showcase */}
      <ResultShowcase setAppState={setAppState} />

      {/* 3. DASHBOARD WORKFLOW PREVIEW - Jouw Bouwsysteem */}
      <DashboardPreviewSection setAppState={setAppState} />

      {/* 4. HOUSING PASSPORT SECTION - Provenance & Authenticity */}
      <PassportSection setAppState={setAppState} />

      {/* 5. HOW IT WORKS - Timeline with GSAP Animations */}
      <HowItWorksSection setAppState={setAppState} />

      {/* STAKEHOLDER COLLABORATION SECTION */}
      <StakeholderSection setAppState={setAppState} />

      {/* MARKET REPORT SECTION */}
      <MarketReportSection setAppState={setAppState} />

      {/* DASHBOARD PREVIEW SECTION */}
      <DashboardSection setAppState={setAppState} />
              
      {/* 6. FAQ SECTION */}
      <FAQSection />

      {/* B2B SECTION - For Builders */}
      <B2BSection setAppState={setAppState} />

      {/* 7. NEWSLETTER / LEAD CAPTURE */}
      <NewsletterSection />

      {/* 8. FOOTER */}
      <Footer setAppState={setAppState} />
    </div>
  );
};
