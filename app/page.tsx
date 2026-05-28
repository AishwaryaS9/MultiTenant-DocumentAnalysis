'use client'
import CTASection from "@/components/landing/cta";
import Hero from "@/components/landing/hero";
import Testimonials from "@/components/landing/testimonials";
import Footer from "@/components/common/footer";
import HowItWorks from "@/components/landing/howitworks";
import Features from "@/components/landing/features";
import Header from "@/components/common/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-page">
      <Header />
      <Hero />
      <Testimonials />
      <Features />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  );
}