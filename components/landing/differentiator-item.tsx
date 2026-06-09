import { DifferentiatorProps } from '@/types'
import { motion, Variants, useReducedMotion } from 'framer-motion';

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.215, 0.61, 0.355, 1],
        },
    },
};

export default function DifferentiatorItem({ num, icon: Icon, title, description }: DifferentiatorProps) {
    const shouldReduceMotion = useReducedMotion();

    const titleId = `differentiator-title-${num}`;
    const descriptionId = `differentiator-description-${num}`;

    return (
        <motion.article
            variants={shouldReduceMotion ? undefined : itemVariants}
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="pt-8 group border-t border-gray-900/10"
        >
            <div className="flex justify-between items-start mb-4">
                <span className="text-md text-gray-400 group-hover:text-orange-600 transition-colors duration-300"
                    aria-label={`Feature number ${num}`}>
                    [{num}]
                </span>

                <div className="text-gray-400 group-hover:text-orange-600 transition-colors duration-300" aria-hidden="true">
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            <h3 id={titleId} className="text-xl font-medium text-gray-900 mb-2">
                {title}
            </h3>

            <p id={descriptionId} className="text-gray-500 text-sm leading-relaxed max-w-sm">
                {description}
            </p>
        </motion.article>
    );
}