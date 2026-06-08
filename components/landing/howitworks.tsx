"use client";

import { steps } from "@/app/data/data";
import { BarChart3 } from "lucide-react";
import { motion, Variants, useReducedMotion } from "framer-motion";

export default function HowItWorks() {
    const shouldReduceMotion = useReducedMotion();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: shouldReduceMotion ? {} : {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" },
        },
    };

    return (
        <section id="how-it-works" aria-labelledby="how-it-works-heading" className="relative py-16 sm:py-20 lg:py-24 bg-surface overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0, rotate: -10 }}
                    whileInView={shouldReduceMotion ? { opacity: 1 } : { scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-center mb-6 sm:mb-8"
                >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-strong rounded-2xl flex items-center justify-center shadow-xl ring-1 ring-white">
                        <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8 text-orange-400" aria-hidden="true" />
                    </div>
                </motion.div>

                <div className="text-center mb-16 sm:mb-20 lg:mb-24">
                    <motion.h2
                        id="how-it-works-heading"
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.2 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-strong tracking-tight max-w-4xl mx-auto leading-[1.1] text-balance"
                    >
                        Transform Complex Documents Into <br className="hidden md:block" />
                        <span className="text-orange-500">Clear, Actionable Insights</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.4 }}
                        className="mt-5 sm:mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed text-pretty"
                    >
                        Docinate streamlines document analysis with AI-powered workflows designed
                        for teams, researchers, and modern businesses.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 lg:gap-x-10 gap-y-14 sm:gap-y-16 relative"
                >
                    {steps.map((step, index) => (
                        <motion.article
                            key={index}
                            variants={itemVariants}
                            tabIndex={0}
                            aria-labelledby={`step-title-${index}`}
                            className="relative flex flex-col items-center text-center lg:items-start lg:text-left group focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-orange-200 rounded-2xl"
                        >
                            <span className="absolute -top-6 left-1/2 lg:left-0 -translate-x-1/2 lg:translate-x-0 text-xs font-bold tracking-widest text-orange-500/50 uppercase">
                                Step 0{index + 1}
                            </span>

                            <div className="mb-6 shrink-0 w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm border border-orange-50
                               group-hover:shadow-xs
                              transition-all duration-300 motion-reduce:transition-none">
                                <step.icon className="w-7 h-7" aria-hidden="true" />
                            </div>

                            <div className="space-y-3">
                                <h3 id={`step-title-${index}`} className="font-bold text-strong text-xl leading-tight text-balance">
                                    {step.title}
                                </h3>

                                <p className="text-gray-600 text-sm leading-relaxed max-w-62.5 mx-auto lg:mx-0 text-pretty">
                                    {step.description}
                                </p>
                            </div>
                            {index !== steps.length - 1 && (
                                <div aria-hidden="true" className="hidden lg:block absolute top-7 left-[calc(0%+3.5rem)] w-[calc(100%-3.5rem)] h-0.5 bg-linear-to-r from-orange-200 to-transparent z-0" />
                            )}
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}