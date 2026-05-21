"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../ui/button";
import { LogIn, Sparkles } from "lucide-react";
import { motion, Variants } from "framer-motion";

const Hero = () => {
    const { user, isLoaded } = useUser();
    const { organization, isLoaded: isOrgLoaded } = useOrganization();

    if (!isLoaded || !isOrgLoaded) return null;

    const orgSlug = organization?.slug || user?.organizationMemberships?.[0]?.organization?.slug;

    const href = orgSlug ? `/${orgSlug}` : "/select-org";

    // Animation Variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-white">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-250 h-150 bg-orange-50/50 rounded-[100%] blur-[120px] -z-10" />
            </div>

            <motion.div
                className="container max-w-6xl mx-auto px-4 relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Badge */}
                <motion.div variants={itemVariants} className="flex justify-center mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-medium flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        Next-Gen Analysis Powered by AI
                    </span>
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#1A1A1A] mb-8 leading-[1.1] text-center"
                >
                    Analyze Documents <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-orange-400">
                        at the speed of thought
                    </span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed text-center"
                >
                    The collaborative intelligence layer for your team. Upload complex PDF sets and get instantly actionable insights.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    {!user ? (
                        <>
                            <Link href="/sign-up">
                                <Button
                                    size="lg"
                                    className="rounded-full px-10 py-7 text-lg bg-[#1A1A1A] hover:bg-black shadow-2xl shadow-orange-200/50 transition-all hover:scale-105 active:scale-95"
                                >
                                    Start Free Trial
                                </Button>
                            </Link>

                            <Link href="/sign-in">
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    className="rounded-full px-10 py-7 text-lg flex gap-2"
                                >
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <Link href={href}>
                            <Button
                                size="lg"
                                className="rounded-full px-10 py-7 text-lg bg-[#1A1A1A] hover:bg-black cursor-pointer"
                            >
                                Go to Dashboard
                            </Button>
                        </Link>
                    )}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;



