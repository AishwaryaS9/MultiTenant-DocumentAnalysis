"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../ui/button";
import { LogIn, ArrowRight } from "lucide-react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import SectionBadge from "../common/section-badge";

const Hero = () => {
    const { user, isLoaded } = useUser();
    const { organization, isLoaded: isOrgLoaded } = useOrganization();
    const shouldReduceMotion = useReducedMotion();

    if (!isLoaded || !isOrgLoaded) return null;

    const orgSlug = organization?.slug || user?.organizationMemberships?.[0]?.organization?.slug;
    const href = orgSlug ? `/${orgSlug}` : "/select-org";

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: shouldReduceMotion
                ? {}
                : { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const itemVariants: Variants = {
        hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.6, ease: [0.215, 0.610, 0.355, 1.000] }
        }
    };

    return (
        <section
            aria-labelledby="hero-heading"
            className="relative pt-32 pb-20 overflow-hidden bg-[#FAF9F5] text-gray-900 selection:bg-orange-100"
        >
            <div aria-hidden="true" className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e0_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e0_1px,transparent_1px)] 
                bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-150 h-150 bg-linear-to-b from-orange-100/40 to-transparent rounded-full blur-3xl -z-10" />
            </div>

            <motion.div
                className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="flex justify-center mb-6">
                    <SectionBadge title="Next-Gen Analysis Powered by AI" />
                </motion.div>

                <motion.h1
                    id="hero-heading"
                    variants={itemVariants}
                    className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl tracking-tight text-gray-900 mb-6 max-w-4xl font-semibold leading-[1.05] text-balance"
                >
                    Analyze complex documents <br />
                    <span className="font-semibold text-orange-600 block sm:inline">
                        at the speed of thought.
                    </span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-base sm:text-lg md:text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed font-sans font-normal text-pretty"
                >
                    The collaborative intelligence layer for modern teams. Upload multi-format PDF sets and extract structured, actionable insights instantly.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md sm:max-w-none"
                >
                    {!user ? (
                        <>
                            <Link href="/sign-up" className="w-full sm:w-auto">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto rounded-md px-8 py-6 text-base font-medium bg-gray-900 text-gray-50 hover:bg-gray-800 transition-all border border-gray-900 shadow-md shadow-gray-900/10 active:scale-[0.98]"
                                >
                                    Start Free Trial
                                    <ArrowRight className="w-4 h-4 ml-2 shrink-0 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>

                            <Link href="/sign-in" className="w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto rounded-md px-8 py-6 text-base font-medium bg-transparent text-gray-900 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all"
                                >
                                    <LogIn className="w-4 h-4 mr-2 shrink-0" aria-hidden="true" />
                                    Sign In
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <Link href={href} className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto rounded-md px-8 py-6 text-base font-medium bg-gray-900 text-gray-50 hover:bg-gray-800 border border-gray-900 transition-all shadow-md"
                            >
                                Go to Dashboard
                                <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
                            </Button>
                        </Link>
                    )}
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="mt-20 w-full max-w-3xl border-t border-gray-200 pt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-4"
                >
                    <div className="text-center sm:border-r sm:border-gray-200 last:border-0 px-4">
                        <div className="text-4xl font-medium tracking-tight text-gray-900">10x</div>
                        <div className="text-gray-500 text-xs tracking-wider uppercase mt-1 font-sans">
                            Faster Analysis
                        </div>
                    </div>

                    <div className="text-center sm:border-r sm:border-gray-200 last:border-0 px-4">
                        <div className="text-4xl font-medium  tracking-tight text-gray-900">98%</div>
                        <div className="text-gray-500 text-xs tracking-wider uppercase mt-1 font-sans">
                            Extraction Accuracy
                        </div>
                    </div>

                    <div className="text-center sm:border-r sm:border-gray-200 last:border-0 px-4">
                        <div className="text-4xl font-medium tracking-tight text-gray-900">24/7</div>
                        <div className="text-gray-500 text-xs tracking-wider uppercase mt-1 font-sans">
                            Autonomous Engine
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;