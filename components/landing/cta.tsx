'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser, useOrganization } from "@clerk/nextjs";
import { motion, Variants, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();

  const shouldReduceMotion = useReducedMotion();

  const isLoaded = isUserLoaded && isOrgLoaded;

  const href = user ? organization ? `/${organization.slug}` : "/dashboard" : "/sign-up";

  const containerVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion ? { duration: 0 } : { duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="cta" aria-labelledby="cta-heading" className="relative py-20 sm:py-24 lg:py-32 bg-hero overflow-hidden">
      {/* Background Decorative Elements */}
      <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 rounded-full pointer-events-none" />

      <div aria-hidden="true" className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[radial-gradient(white,transparent_85%)] opacity-20 pointer-events-none" />

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-orange-500 mb-6 sm:mb-8"
        >
          <Sparkles className="w-3 h-3 shrink-0" aria-hidden="true" />
          <span>Supercharge your workflow</span>
        </motion.div>

        <motion.h2
          id="cta-heading"
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-6xl font-bold mb-5 sm:mb-6 tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white to-gray-400 leading-[1.1] text-balance"
        >
          Ready to analyze <br className="hidden md:block" /> your documents?
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-gray-400 mb-10 sm:mb-12 max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed text-pretty"
        >
          Join thousands of forward-thinking teams using Docinate AI to extract
          insights and automate document workflows in seconds.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col items-center gap-5 sm:gap-6">
          {!isLoaded ? (
            <div aria-hidden="true" className="h-14 w-48 animate-pulse bg-white/10 rounded-full" />
          ) : (
            <Link href={href} aria-label={user ? "Go to your dashboard" : "Get started with Docinate AI for free"} className="group w-full sm:w-auto">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 sm:px-10 rounded-full bg-white text-black hover:bg-white/90 text-base 
                  sm:text-lg font-bold transition-all duration-300 motion-reduce:transition-none shadow-[0_0_20px_rgba(255,255,255,0.1)]
                   group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-white"
                >
                  {user ? "Go to Dashboard" : "Get Started Free"}

                  <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-1 
                  motion-reduce:group-hover:translate-x-0"
                    aria-hidden="true" />
                </Button>
              </motion.div>
            </Link>
          )}

          {isLoaded && !user && (
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-400 font-medium"
            >
              <span>No credit card required</span>

              <span aria-hidden="true" className="hidden sm:block w-1 h-1 rounded-full bg-gray-700" />

              <span>14-day free trial</span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}