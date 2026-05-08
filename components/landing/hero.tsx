import { images } from '@/assets';
import { useOrganization, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { LogIn, Sparkles } from 'lucide-react';

const Hero = () => {
    const { user } = useUser();
    const { organization } = useOrganization();

    return (
        <section className="pt-24 pb-12 text-center relative overflow-hidden">
            <div className="container max-w-5xl mx-auto px-4 relative z-10">
                <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-[#1A1A1A] mb-8 leading-[1.1] mt-4">

                    AI-Powered<br /> Document Analysis for Teams
                </h1>

                <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Upload, analyze, and collaborate on documents with your organization. Get instant AI insights and summaries.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">

                    {!user ? (
                        <>
                            <Link href="/sign-up">
                                <Button className="rounded-full px-8 py-4 h-auto bg-[#1A1A1A] text-white hover:bg-black flex gap-2 text-base font-medium transition-all shadow-lg">
                                    <Sparkles className="w-4 h-4 fill-current text-yellow-400" />
                                    Start Free Trial
                                </Button>
                            </Link>

                            <Link href="/sign-in">
                                <Button
                                    variant="outline"
                                    className="rounded-full px-8 py-4 h-auto border-gray-300 text-black hover:bg-gray-50 flex gap-2 text-base font-medium transition-all"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <Link href={organization ? `/${organization.slug}` : "/dashboard"}>
                            <Button className="rounded-full px-8 py-4 h-auto bg-[#1A1A1A] text-white hover:bg-black text-base font-medium">
                                Go to Dashboard
                            </Button>
                        </Link>
                    )}

                </div>

                <button className="flex items-center gap-2 mx-auto mt-6 text-sm font-medium text-gray-500 hover:text-[#1A1A1A] transition-colors group">
                    Watch how it works
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                        <div className="border-t-4 border-t-transparent border-l-[6px] border-l-gray-600 border-b-4 border-b-transparent ml-0.5" />
                    </div>
                </button>

            </div>

            <div className="mt-20 relative max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">

                    {/* Left side: Document Pages */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-end pr-0 md:pr-12">
                        <div className="relative w-full max-w-md h-100">
                            <Image
                                src={images.document_page}
                                alt="Stacked document analysis"
                                fill
                                className="object-contain opacity-90"
                                priority
                            />
                        </div>
                    </div>

                    {/* Vertical Analysis Line */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-transparent via-orange-400 to-transparent opacity-40" />

                    {/* Right side: AI Insight Callouts */}
                    <div className="w-full md:w-1/2 flex flex-col gap-6 text-left pl-0 md:pl-12">

                        {/* Summary Insight */}
                        <div className="bg-white/40 backdrop-blur-md p-4 rounded-xl border border-white/40 shadow-sm max-w-sm transform hover:-translate-y-1 transition-transform">
                            <p className="text-sm text-gray-500 italic leading-relaxed">
                                "The Q3 Strategy highlights a shift toward automated workflows, projecting a 15% reduction in operational overhead by year-end."
                            </p>
                        </div>

                        {/* Actionable Insight */}
                        <div className="bg-white/70 backdrop-blur-md p-5 rounded-xl border border-white shadow-md max-w-md transform hover:-translate-y-1 transition-transform">
                            <p className="text-sm font-semibold text-gray-800 mb-2">
                                Detected 3 critical action items for the Legal Team regarding the new compliance framework.
                            </p>
                            <p className="text-sm text-gray-600">
                                Risk identified in Section 4.2: Missing liability clauses for international sub-processors.
                            </p>
                        </div>

                        {/* AI Badge Icon */}
                        <div className="ml-4 w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center shadow-xl">
                            <div className="w-6 h-6 border-2 border-orange-400 rounded-full border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero