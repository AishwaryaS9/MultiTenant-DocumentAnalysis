'use client';

import CTASection from "@/components/landing/cta";
import Hero from "@/components/landing/hero";
import Testimonials from "@/components/landing/testimonials";
import Footer from "@/components/common/footer";
import HowItWorks from "@/components/landing/howitworks";
import Features from "@/components/landing/features";
import Header from "@/components/common/header";
import { useEffect, useState } from "react";

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main role="main" aria-label="Landing page" className="min-h-screen bg-page">
      <Header />

      <section aria-label="Hero section">
        <Hero />
      </section>

      <section aria-label="Testimonials section">
        <Testimonials />
      </section>

      <section aria-label="Features section">
        <Features />
      </section>

      <section aria-label="How it works section">
        <HowItWorks />
      </section>

      <section aria-label="Call to action section">
        <CTASection />
      </section>

      <Footer />

      {/* Scroll to top button */}
      <button
        type="button"
        aria-label="Scroll to top of page"
        onClick={scrollToTop}
        className={`fixed bottom-12 right-6 md:right-12 z-40 flex flex-col items-center gap-3 transition-all duration-700 group cursor-pointer focus:outline-none focus:ring-1 
          focus:ring-slate-100 focus:ring-offset-1 ${showScrollTop ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-10 invisible pointer-events-none"}`}>
        <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase rotate-180 [writing-mode:vertical-lr] transition-colors group-hover:text-orange-600">
          Top
        </span>

        <div className="relative w-px h-12 bg-gray-200 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-orange-600 -translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0" />
          <div className="w-full h-full bg-gray-300" />
        </div>
      </button>
    </main>
  );
}