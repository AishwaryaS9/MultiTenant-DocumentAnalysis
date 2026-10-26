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
                        className="inline-flex items-center gap-2 px-3.5 py-1 mb-4"
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
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto"
                >
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        const iconRight = feature.iconSide === "right"

                        const visual = (
                            <div
                                aria-hidden="true"
                                className={`flex items-center gap-5 ${iconRight ? "flex-row-reverse" : ""}`}
                            >
                                <Icon className="size-12 shrink-0 text-primary" strokeWidth={1.25} />
                                <div
                                    className={`h-10 flex-1 max-w-sm bg-dots-primary ${iconRight ? "dots-fade-l" : "dots-fade-r"
                                        }`}
                                />
                            </div>
                        )

                        const text = (
                            <div>
                                {feature.badge && (
                                    <span className="mb-3 block text-[11px] font-semibold uppercase tracking-wider text-primary">
                                        {feature.badge}
                                    </span>
                                )}
                                <h3
                                    id={`feature-title-${index}`}
                                    className="text-lg sm:text-xl font-medium text-strong tracking-tight leading-snug"
                                >
                                    {feature.title}
                                </h3>
                                <p className="mt-3 text-sm text-strong/70 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        )

                        return (
                            <motion.article
                                key={index}
                                variants={itemVariants}
                                tabIndex={0}
                                aria-labelledby={`feature-title-${index}`}
                                className={`${feature.gridSpan} bg-feature-card min-h-65 p-8 flex flex-col justify-between gap-8 transition-colors duration-300 hover:bg-[#ececec] focus-visible:outline-2 focus-visible:outline-primary/40`}
                            >
                                {feature.iconPosition === "top" ? (
                                    <>
                                        {visual}
                                        {text}
                                    </>
                                ) : (
                                    <>
                                        {text}
                                        {visual}
                                    </>
                                )}
                            </motion.article>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}


