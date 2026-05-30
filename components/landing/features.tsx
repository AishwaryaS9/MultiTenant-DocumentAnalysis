'use client'

import { features } from '@/app/data/data'
import Image from 'next/image'
import { motion, Variants, useReducedMotion } from 'framer-motion'

export default function Features() {
    const shouldReduceMotion = useReducedMotion()

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: shouldReduceMotion ? {} : { staggerChildren: 0.1 },
        },
    }

    const itemVariants: Variants = {
        hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" },
        },
    }

    return (
        <section id="features" aria-labelledby="features-heading" className="py-16 sm:py-20 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-12 sm:mb-16">
                    <motion.div
                        initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-feature-pill mb-4"
                    >
                        <span className="text-[12px] font-bold tracking-widest text-feature-accent uppercase">
                            ✦ Feature
                        </span>
                    </motion.div>

                    <h2 id="features-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black mb-4 text-balance">
                        Everything In One Place
                    </h2>

                    <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed text-pretty">
                        Powerful AI-driven tools designed to streamline your document workflow and improve team collaboration.
                    </p>
                </div>

                {/* Bento Grid Layout */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
                >
                    {features.slice(0, 4).map((feature, index) => {
                        const isLarge = index === 0 || index === 3

                        return (
                            <motion.article
                                key={index}
                                variants={itemVariants}
                                tabIndex={0}
                                aria-labelledby={`feature-title-${index}`}
                                className={`group relative overflow-hidden rounded-[2rem] bg-feature-card p-6 sm:p-8 md:p-10 flex flex-col justify-between min-h-112
                                     sm:min-h-128 md:min-h-144 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-gray-400
                                      ${isLarge ? 'md:col-span-2' : 'md:col-span-1'}`}

                            >
                                <div className="relative z-10">
                                    <h3 id={`feature-title-${index}`} className="text-2xl sm:text-3xl font-bold text-black mb-3 text-balance">
                                        {feature.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm sm:text-base max-w-md leading-relaxed text-pretty">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Image Container */}
                                <div className="mt-6 sm:mt-8 relative w-full h-full bg-white/50 rounded-2xl overflow-hidden flex items-center justify-center p-3 sm:p-4">
                                    <div className="relative w-full h-full min-h-56 sm:min-h-64 md:min-h-72">
                                        <Image
                                            src={feature.image}
                                            alt={`${feature.title} feature preview`}
                                            fill
                                            className="object-contain drop-shadow-xl transition-transform duration-500 motion-reduce:transition-none group-hover:scale-105 
                                            motion-reduce:group-hover:scale-100"
                                            sizes={isLarge ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                                            priority={index < 2}
                                        />
                                    </div>
                                </div>
                            </motion.article>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}