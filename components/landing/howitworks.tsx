"use client";
import { steps } from "@/app/data/data";
import { BarChart3 } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function HowItWorks() {
    // Animation Variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    return (
        <section id="how-it-works" className="relative py-24 bg-[#F9F9F9] overflow-hidden">
            <div className="container max-w-7xl mx-auto px-4 relative z-10">
                {/* Animated Top Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    className="flex justify-center mb-8"
                >
                    <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-white">
                        <BarChart3 className="w-8 h-8 text-orange-400" />
                    </div>
                </motion.div>

                {/* Header */}
                <div className="text-center mb-24">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-tight max-w-4xl mx-auto leading-[1.1]"
                    >
                        Transform Complex Documents Into <br className="hidden md:block" />
                        <span className="text-orange-500">Clear, Actionable Insights</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
                    >
                        Docinate streamlines document analysis with AI-powered workflows designed
                        for teams, researchers, and modern businesses.
                    </motion.p>
                </div>

                {/* Steps Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16 relative"
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="relative flex flex-col items-center text-center lg:items-start lg:text-left group"
                        >
                            {/* Step Number Badge (Optional UI Polish) */}
                            <span className="absolute -top-6 left-1/2 lg:left-0 -translate-x-1/2 lg:translate-x-0 text-xs font-bold tracking-widest text-orange-500/50 uppercase">
                                Step 0{index + 1}
                            </span>

                            {/* Icon Box */}
                            <div className="mb-6 shrink-0 w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm border border-orange-100 group-hover:bg-orange-400 group-hover:text-white group-hover:shadow-orange-200 group-hover:shadow-lg transition-all duration-300">
                                <step.icon className="w-7 h-7" />
                            </div>

                            {/* Content */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-[#1A1A1A] text-xl leading-tight">
                                    {step.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed max-w-62.5 mx-auto lg:mx-0">
                                    {step.description}
                                </p>
                            </div>

                            {/* Connecting Line (Desktop Only) */}
                            {index !== steps.length - 1 && (
                                <div className="hidden lg:block absolute top-7 left-[calc(0%+3.5rem)] w-[calc(100%-3.5rem)] h-0.5 bg-linear-to-r from-orange-200 to-transparent z-0" />
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}