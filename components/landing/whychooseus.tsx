import { motion, useReducedMotion, Variants } from 'framer-motion';
import SectionBadge from '../common/section-badge';
import DifferentiatorItem from './differentiator-item';
import { differentiators } from '@/app/data/data';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

export default function WhyChooseUs() {
    const shouldReduceMotion = useReducedMotion()

    return (
        <section id='why-choose-us' className="py-24 bg-surface overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >

                    <motion.div
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.4 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1 mb-4"
                    >
                        <SectionBadge title="Why Docinate AI" />
                    </motion.div>

                    <h2 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Turn Documents Into Actionable Insights
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Upload, analyze, and collaborate on documents with AI-powered summaries, sentiment analysis, entity extraction, and intelligent search—all within secure organizational workspaces.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {differentiators.map((differentiator, index) => (
                        <DifferentiatorItem
                            key={index}
                            num={differentiator.num}
                            icon={differentiator.icon}
                            title={differentiator.title}
                            description={differentiator.description}
                        />
                    ))}
                </motion.div>

            </div>
        </section>
    )
}

