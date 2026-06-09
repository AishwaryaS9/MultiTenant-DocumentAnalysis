"use client";

import Link from 'next/link';
import { motion, Variants, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { images } from '@/assets';
import { navLinks } from '@/app/data/data';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const shouldReduceMotion = useReducedMotion();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: shouldReduceMotion ? { duration: 0 } : {
                duration: 0.5,
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: [0.215, 0.610, 0.355, 1.000] }
        }
    };

    return (
        <footer role="contentinfo" className="w-full bg-slate-50/50 text-slate-500 border-t border-slate-200/60 selection:bg-slate-200 selection:text-slate-900">
            <motion.div
                className="max-w-7xl mx-auto px-6 py-12 md:py-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={containerVariants}
            >
                <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between pb-12 border-b border-slate-200/60">
                    <motion.div variants={itemVariants} className="space-y-4 max-w-sm">
                        <Link
                            href="/"
                            aria-label="Docinate AI home"
                            className="inline-block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-shadow"
                        >
                            <Image
                                src={images.logo_full}
                                alt="Docinate AI logo"
                                width={100}
                                height={28}
                                className="object-contain opacity-95"
                                priority
                            />
                        </Link>
                        <p className="text-sm text-slate-600 leading-relaxed text-balance">
                            The intelligent layer for your enterprise workflows. Analyze, audit, and securely scale internal documentation.
                        </p>
                    </motion.div>

                    <nav aria-label="Footer system links" className="md:pt-1.5">
                        <motion.ul variants={itemVariants} className="flex flex-wrap items-center gap-x-8 gap-y-4">
                            {navLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 outline-none rounded 
                                        focus-visible:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-4 focus-visible:ring-offset-white"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </motion.ul>
                    </nav>
                </div>

                <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between pt-8 text-xs text-slate-400 font-medium tracking-wide">
                    <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <span>&copy; {currentYear} Docinate AI</span>
                    </motion.div>
                </div>
            </motion.div>
        </footer>
    );
}
