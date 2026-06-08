import { DifferentiatorProps } from '@/types'
import { motion, Variants } from 'framer-motion';

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

export default function DifferentiatorItem({
    num,
    icon: Icon,
    title,
    description,
}: DifferentiatorProps) {
    return (
        <motion.div
            variants={itemVariants}
            className="pt-8 group border-t border-gray-900/10"
        >
            <div className="flex justify-between items-start mb-4">
                <span className="text-md text-gray-400 group-hover:text-orange-600 transition-colors duration-300">
                    [{num}]
                </span>
                <div className="text-gray-400 group-hover:text-orange-600 transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">{description}</p>
        </motion.div>
    )
}
