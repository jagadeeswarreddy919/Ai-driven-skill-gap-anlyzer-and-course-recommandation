import React from "react";
import { Navbar } from "@/components/Navbar";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Hero } from "@/components/Hero";
import { StatsSection } from "@/components/StatsSection";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionFlow } from "@/components/SolutionFlow";
import { FeaturesSection } from "@/components/FeaturesSection";
import { AboutSection } from "@/components/AboutSection";
import { SkillComparison } from "@/components/SkillComparison";
import { HowItWorks } from "@/components/HowItWorks";
import { PricingSection } from "@/components/PricingSection";
import { BeforeAfterSection } from "@/components/BeforeAfterSection";
import { AudienceSection } from "@/components/AudienceSection";
import { WhySkillGap } from "@/components/WhySkillGap";
import { FAQSection } from "@/components/FAQSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF9FF] text-slate-900 relative overflow-hidden flex flex-col justify-between">
      {/* Global Light Ambient Background Effects */}
      <BackgroundEffects />

      {/* Header Navbar */}
      <Navbar />

      {/* Section Trajectory */}
      <div className="flex-1">
        <Hero />
        <StatsSection />
        <ProblemSection />
        <SolutionFlow />
        <FeaturesSection />
        <AboutSection />
        <SkillComparison />
        <HowItWorks />
        <PricingSection />
        <BeforeAfterSection />
        <AudienceSection />
        <WhySkillGap />
        <FAQSection />
        <FinalCTA />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
