'use client'

import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/howitworks";
import CTASection from "@/components/landing/cta";
import Hero from "@/components/landing/hero";
import Testimonials from "@/components/landing/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <Hero />
      <Testimonials />
      <Features />
      <HowItWorks />
      <CTASection />
    </div>
  );
}