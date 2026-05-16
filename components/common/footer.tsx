"use client";
import { Brain } from 'lucide-react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    // Animation Variants
    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
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
        <footer className="bg-[#F9F9F9] text-slate-900 border-t border-slate-50">
            <motion.div
                className="max-w-7xl mx-auto px-6 py-20"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
            >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16">

                    {/* Section 1: Identity */}
                    <motion.div variants={itemVariants} className="md:col-span-5 space-y-6">
                        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg">
                            <div className="bg-amber-400 p-1.5 rounded-lg">
                                <Brain className='h-5 w-5 text-white' />
                            </div>
                            <span className="tracking-tight text-slate-900">Docinate AI</span>
                        </Link>
                        <p className="text-base text-slate-500 leading-relaxed max-w-sm">
                            AI-powered document analysis for teams. Upload, analyze, and collaborate on documents with your organization.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            All systems operational
                        </div>
                    </motion.div>

                    {/* Section 2: Navigation Groups */}
                    <div className="md:col-span-4 grid grid-cols-2 gap-8">
                        {Object.entries(sections).map(([title, links]) => (
                            <motion.div key={title} variants={itemVariants} className="space-y-5">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</h4>
                                <ul className="space-y-4">
                                    {links.map((link) => (
                                        <li key={link.label}>
                                            <Link href={link.href} className="text-sm text-slate-600 hover:text-orange-600 transition-all underline-offset-4 hover:underline">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    {/* Section 3: Minimal Newsletter */}
                    <motion.div variants={itemVariants} className="md:col-span-3 space-y-5">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Stay Updated</h4>
                        <form className="relative group">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-transparent border-b border-slate-200 py-2 text-sm focus:border-orange-600 outline-none transition-colors pr-8"
                            />
                            <motion.button
                                whileHover={{ x: 5 }}
                                className="absolute right-0 top-2 text-slate-400 hover:text-orange-600 transition-colors"
                            >
                                <span className="text-lg">→</span>
                            </motion.button>
                        </form>
                    </motion.div>
                </div>

                {/* Bottom Metadata */}
                <motion.div
                    variants={itemVariants}
                    className="mt-20 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6 text-[13px] text-slate-400"
                >
                    <div className="flex gap-8">
                        <p>&copy; {currentYear} Docinate Inc.</p>
                        <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms</Link>
                        <Link href="/cookies" className="hover:text-slate-900 transition-colors">Cookies</Link>
                    </div>
                    <div className="flex gap-6 italic">
                        <a href="#" className="hover:text-slate-900 transition-colors not-italic font-medium">GitHub</a>
                        <a href="#" className="hover:text-slate-900 transition-colors not-italic font-medium">LinkedIn</a>
                    </div>
                </motion.div>
            </motion.div>
        </footer>
    );
}