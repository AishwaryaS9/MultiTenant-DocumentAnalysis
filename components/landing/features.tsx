import Image from 'next/image'
import { motion, Variants, useReducedMotion } from 'framer-motion'
import { features } from '@/app/data/data';
import SectionBadge from '../common/section-badge';

export default function Features() {
    const shouldReduceMotion = useReducedMotion()

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: shouldReduceMotion ? {} : { staggerChildren: 0.1, delayChildren: 0.05 },
        },
    }

    const itemVariants: Variants = {
        hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 },
        visible: {
            opacity: 1,
            y: 0,
            transition: shouldReduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.215, 0.610, 0.355, 1.000] },
        },
    }

    const headerVariants: Variants = {
        hidden: shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.6,
                    ease: [0.215, 0.61, 0.355, 1],
                },
        },
    }

    const descriptionVariants: Variants = {
        hidden: shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 0, y: 12 },
        visible: {
            opacity: 1,
            y: 0,
            transition: shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: 0.5,
                    delay: 0.15,
                    ease: [0.215, 0.61, 0.355, 1],
                },
        },
    }

    return (
        <section id="features" aria-labelledby="features-heading" className="py-16 sm:py-24 bg-[#F9FAFB] selection:bg-orange-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 sm:mb-20">
                    <motion.div
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.4 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1 mb-4 "
                    >
                        <SectionBadge title="Features" />
                    </motion.div>

                    <motion.h2
                        id="features-heading"
                        variants={headerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 text-balance">
                        Everything In One Place
                    </motion.h2>

                    <motion.p
                        variants={descriptionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                        className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed text-pretty">
                        Powerful AI-driven tools designed to streamline your document workflow
                        and improve team collaboration.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    className="grid grid-cols-1 md:grid-cols-6 gap-6 max-w-7xl mx-auto"
                >
                    {features.map((feature, index) => (
                        <motion.article
                            key={index}
                            variants={itemVariants}
                            tabIndex={0}
                            aria-labelledby={`feature-title-${index}`}
                            className={`${feature.bgColor} ${feature.gridSpan} rounded-[2rem] p-8 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] 
                            flex flex-col justify-between group`}
                        >
                            <div className="w-full aspect-16/10 rounded-2xl bg-[#F8F9FA] flex items-center justify-center overflow-hidden mb-6 border border-gray-50">
                                {feature.image ? (
                                    <Image
                                        src={feature.image}
                                        alt=""
                                        width={500}
                                        height={350}
                                        className="w-full h-full object-contain p-2 "
                                        sizes="(max-w-7xl) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-100 animate-pulse" />
                                )}
                            </div>

                            <div className="flex flex-col gap-2 mb-2">
                                {feature.badge && (
                                    <span className="w-fit bg-gray-100 text-[10px] font-bold tracking-wider text-gray-500 px-2.5 py-0.5 rounded-md uppercase">
                                        {feature.badge}
                                    </span>
                                )}

                                <h3 id={`feature-title-${index}`} className="text-xl font-semibold text-gray-900 tracking-tight leading-snug">
                                    {feature.title}
                                </h3>
                            </div>

                            <p className="text-[14px] text-gray-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

