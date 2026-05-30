"use client";

import { Brain } from 'lucide-react';
import Link from 'next/link';
import { motion, Variants, useReducedMotion } from 'framer-motion';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const shouldReduceMotion = useReducedMotion();

    // Animation Variants
    const containerVariants: Variants = {
        hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: shouldReduceMotion ? { duration: 0 } : {
                duration: 0.6,
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants: Variants = {
        hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    const sections = {
        platform: [
            { label: "Features", href: "/#features" },
            { label: "Pricing", href: "/pricing" },
            { label: "Integrations", href: "/integrations" },
        ],
        company: [
            { label: "About", href: "/about" },
            { label: "Changelog", href: "/changelog" },
            { label: "Privacy", href: "/privacy" },
        ]
    };

    return (
        <footer role="contentinfo" className="bg-surface text-slate-900 border-t border-slate-50">
            <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16">

                    {/* Section 1: Identity */}
                    <motion.div variants={itemVariants} className="md:col-span-5 space-y-5 sm:space-y-6">
                        <Link href="/" aria-label="Go to Docinate AI homepage" className="flex items-center gap-2.5 font-bold text-lg rounded-lg 
                        focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-orange-200 w-fit">
                            <div className="bg-orange-500 p-1.5 rounded-lg">
                                <Brain className='h-5 w-5 text-white' aria-hidden="true" />
                            </div>

                            <span className="tracking-tight text-slate-900">
                                Docinate AI
                            </span>
                        </Link>

                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-sm text-pretty">
                            AI-powered document analysis for teams. Upload, analyze, and collaborate on documents with your organization.
                        </p>

                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <span aria-hidden="true" className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>

                            <span>All systems operational</span>
                        </div>
                    </motion.div>

                    {/* Section 2: Navigation Groups */}
                    <nav aria-label="Footer navigation" className="md:col-span-4 grid grid-cols-2 gap-8">
                        {Object.entries(sections).map(([title, links]) => (
                            <motion.div key={title} variants={itemVariants} className="space-y-5">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                    {title}
                                </h2>

                                <ul className="space-y-4">
                                    {links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                aria-label={`Navigate to ${link.label}`}
                                                className="text-sm text-slate-600 hover:text-orange-600 transition-all underline-offset-4 hover:underline rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-orange-200"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Section 3: Newsletter */}
                    <motion.div variants={itemVariants} className="md:col-span-3 space-y-5">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                            Stay Updated
                        </h2>

                        <form className="relative group w-full max-w-xs" aria-label="Newsletter signup form">
                            <label htmlFor="newsletter-email" className="sr-only">
                                Email address
                            </label>

                            <input
                                id="newsletter-email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                placeholder="Email address"
                                aria-label="Enter your email address"
                                className="w-full bg-transparent border-b border-slate-200 py-2 text-sm text-slate-900 placeholder:text-slate-400
                                 focus:border-orange-600 outline-none transition-colors pr-8"
                            />

                            <motion.button
                                type="submit"
                                aria-label="Submit newsletter signup"
                                whileHover={shouldReduceMotion ? {} : { x: 5 }}
                                className="absolute right-0 top-2 text-slate-400 hover:text-orange-600 transition-colors focus:outline-none
                                 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-orange-200 rounded-sm">
                                <span aria-hidden="true" className="text-lg">
                                    →
                                </span>
                            </motion.button>
                        </form>
                    </motion.div>
                </div>

                {/* Bottom Metadata */}
                <motion.div
                    variants={itemVariants}
                    className="mt-16 sm:mt-20 pt-8 border-t border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-5 sm:gap-6 text-[13px] text-slate-500"
                >
                    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-3">
                        <p>&copy; {currentYear} Docinate Inc.</p>

                        <Link href="/terms" className="hover:text-slate-900 transition-colors rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-300">
                            Terms
                        </Link>

                        <Link href="/cookies" className="hover:text-slate-900 transition-colors rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-300">
                            Cookies
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#"
                            aria-label="Visit Docinate AI GitHub profile"
                            className="hover:text-slate-900 transition-colors not-italic font-medium rounded-md focus:outline-none focus-visible:ring-1 
                            focus-visible:ring-offset-1 focus-visible:ring-slate-300">
                            GitHub
                        </a>

                        <a href="#"
                            aria-label="Visit Docinate AI LinkedIn profile"
                            className="hover:text-slate-900 transition-colors not-italic font-medium rounded-md focus:outline-none focus-visible:ring-1 
                            focus-visible:ring-offset-1 focus-visible:ring-slate-300">
                            LinkedIn
                        </a>
                    </div>
                </motion.div>
            </motion.div>
        </footer>
    );
}