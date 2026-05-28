'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser, useOrganization } from "@clerk/nextjs";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();

  const isLoaded = isUserLoaded && isOrgLoaded;

  const href = user
    ? organization
      ? `/${organization.slug}`
      : "/dashboard"
    : "/sign-up";

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="cta" className="relative py-32 bg-hero overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[radial-gradient(white,transparent_85%)] opacity-20 pointer-events-none" />

      <motion.div
        className="container relative z-10 max-w-4xl mx-auto px-6 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* Subtle Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-orange-400 mb-8"
        >
          <Sparkles className="w-3 h-3" />
          <span>Supercharge your workflow</span>
        </motion.div>

        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white to-gray-400"
        >
          Ready to analyze <br className="hidden md:block" /> your documents?
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-gray-400 mb-12 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed"
        >
          Join thousands of forward-thinking teams using Docinate AI to extract
          insights and automate document workflows in seconds.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col items-center gap-6">
          {!isLoaded ? (
            <div className="h-14 w-48 animate-pulse bg-white/10 rounded-full" />
          ) : (
            <Link href={href} className="group">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="h-14 px-10 rounded-full bg-white text-black hover:bg-white/90 text-lg font-bold transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  {user ? "Go to Dashboard" : "Get Started Free"}
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </Link>
          )}

          {isLoaded && !user && (
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 text-sm text-gray-500 font-medium"
            >
              <span>No credit card required</span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span>14-day free trial</span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}