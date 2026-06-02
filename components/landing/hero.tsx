"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../ui/button";
import { LogIn, Sparkles } from "lucide-react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { images } from "@/assets";

const Hero = () => {
    const { user, isLoaded } = useUser();
    const { organization, isLoaded: isOrgLoaded } = useOrganization();
    const shouldReduceMotion = useReducedMotion();

    if (!isLoaded || !isOrgLoaded) return null;

    const orgSlug = organization?.slug || user?.organizationMemberships?.[0]?.organization?.slug;

    const href = orgSlug ? `/${orgSlug}` : "/select-org";

    // Animation Variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: shouldReduceMotion
                ? {}
                : { staggerChildren: 0.2, delayChildren: 0.3 }
        }
    };

    const itemVariants: Variants = {
        hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1]
                }
        }
    };

    const imageVariants: Variants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 1.2, delay: 0.6 }
        }
    };

    return (
        <section aria-labelledby="hero-heading" className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 overflow-hidden bg-white">
            {/* Background Decorative Elements */}
            <div aria-hidden="true" className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-hero-grid-dots mask-hero-grid opacity-40" />
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-175 sm:w-225 md:w-250 h-125 sm:h-150 bg-orange-50/50 rounded-[100%] blur-[120px] -z-10" />
            </div>

            <motion.div
                className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible">
                {/* Badge */}
                <motion.div variants={itemVariants} className="flex justify-center mb-6">
                    <span
                        role="status"
                        aria-label="Next generation analysis powered by artificial intelligence"
                        className="px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs sm:text-sm font-medium flex items-center gap-2 text-center"
                    >
                        <Sparkles className="w-3.5 h-3.5 fill-current shrink-0" aria-hidden="true" />
                        Next-Gen Analysis Powered by AI
                    </span>
                </motion.div>

                <motion.h1
                    id="hero-heading"
                    variants={itemVariants}
                    className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-strong mb-6 sm:mb-8 leading-[1.1] text-center text-balance"
                >
                    Analyze Documents <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-orange-400">
                        at the speed of thought
                    </span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-base sm:text-lg md:text-lg text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed text-center px-2 sm:px-0 text-pretty"
                >
                    The collaborative intelligence layer for your team. Upload complex PDF sets and get instantly actionable insights.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full"
                >
                    {!user ? (
                        <>
                            <Link
                                href="/sign-up"
                                aria-label="Start your free trial with Docinate AI"
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto rounded-full px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg bg-strong hover:bg-strong-dark
                                     shadow-2xl shadow-orange-200/50 transition-all motion-reduce:transition-none hover:scale-105 motion-reduce:hover:scale-100
                                      active:opacity-80 min-h-13 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-900"
                                >
                                    Start Free Trial
                                </Button>
                            </Link>

                            <Link
                                href="/sign-in"
                                aria-label="Sign in to your Docinate AI account"
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    className="w-full sm:w-auto rounded-full px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg flex gap-2 min-h-13 
                                    focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-gray-100"
                                >
                                    <LogIn className="w-5 h-5 shrink-0" aria-hidden="true" />
                                    Sign In
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <Link
                            href={href}
                            aria-label="Go to your dashboard"
                            className="w-full sm:w-auto"
                        >
                            <Button
                                size="lg"
                                className="w-full sm:w-auto rounded-full px-8 sm:px-10 py-6 sm:py-7 text-base sm:text-lg bg-strong hover:bg-strong-dark cursor-pointer 
                                 active:opacity-80 min-h-13 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-900">
                                Go to Dashboard
                            </Button>
                        </Link>
                    )}
                </motion.div>

                <div className="mt-14 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                    <div className="text-center">
                        <div className="text-3xl font-bold">10x</div>
                        <div className="text-gray-500 text-sm">
                            Faster Analysis
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-3xl font-bold">98%</div>
                        <div className="text-gray-500 text-sm">
                            Accuracy
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="text-3xl font-bold">24/7</div>
                        <div className="text-gray-500 text-sm">
                            AI Assistance
                        </div>
                    </div>
                </div>

             
                <motion.div
                    variants={imageVariants}
                    className="relative mt-8 flex justify-center"
                >
                    <div
                        className="relative w-full max-w-5xl mx-auto"
                        style={{
                            maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                            WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)"
                        }}
                    >
                        <Image
                            src={images.dashboard}
                            alt="Hero section preview"
                            priority
                            fetchPriority="high"
                            sizes="(max-width: 768px) 100vw, 896px"
                            className="w-full h-auto drop-shadow-2xl rotate-x-6 hover:rotate-x-0 transition-all duration-700"
                        />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;