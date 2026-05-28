'use client'
import { features } from '@/app/data/data'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'

export default function Features() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    }

    return (
        <section id="features" className="py-20 bg-surface">
            <div className="container max-w-7xl mx-auto px-4">

                {/* Header Section from image_bd5799.jpg */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-feature-pill mb-4"
                    >
                        <span className="text-[12px] font-bold tracking-widest text-feature-accent uppercase">
                            ✦ Feature
                        </span>
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-4">
                        Everything In One Place
                    </h2>
                </div>

                {/* Bento Grid Layout */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {features.slice(0, 4).map((feature, index) => {
                        const isLarge = index === 0 || index === 3;

                        return (
                            <motion.article
                                key={index}
                                variants={itemVariants}
                                className={`group relative overflow-hidden rounded-[2rem] bg-feature-card p-8 md:p-10 flex flex-col justify-between min-h-112.5
                                    ${isLarge ? 'md:col-span-2' : 'md:col-span-1'}`}
                            >
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-black mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm md:text-base max-w-md leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Inner Image Container - Light background as seen in image_bd5799.jpg */}
                                <div className="mt-8 relative w-full h-full bg-white/50 rounded-2xl overflow-hidden flex items-center justify-center p-4">
                                    <div className="relative w-full h-full min-h-50">
                                        <Image
                                            src={feature.image}
                                            alt={feature.title}
                                            fill
                                            className="object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                                            sizes={isLarge ? "66vw" : "33vw"}
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