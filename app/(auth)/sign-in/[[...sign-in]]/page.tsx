import Link from "next/link";
import Image from "next/image";
import { SignIn } from "@clerk/nextjs";
import { ShieldCheck, Zap, Sparkles, Lock } from "lucide-react";
import { images } from "@/assets";

export default function SignInPage() {
    return (
        <main
            role="main"
            aria-label="Sign in page"
            className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-[#FAF8F5] text-gray-900 selection:bg-orange-100 selection:text-orange-900"
        >
            <section className="relative hidden lg:flex flex-col justify-between p-12 xl:p-16 border-r border-stone-200/80 overflow-hidden bg-linear-to-b from-[#FAF8F5] via-[#F5F2EC] to-[#FAF8F5]">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] bg-size-[24px_24px] mask-[linear-gradient(to_bottom,transparent,#000_20%,#000_80%,transparent)]"
                />

                <div
                    aria-hidden="true"
                    className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 blur-[120px] pointer-events-none rounded-full"
                />

                <div className="relative z-10">
                    <Link
                        href="/"
                        prefetch
                        aria-label="Docinate AI homepage"
                        className="inline-flex items-center gap-2 font-bold text-lg rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 transition-opacity hover:opacity-90"
                    >
                        <div className="p-1 shrink-0">
                            <Image
                                src={images.logo_full}
                                alt="logo"
                                width={110}
                                height={110}
                                priority
                                className="object-contain"
                            />
                        </div>
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg space-y-8 my-auto py-8">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-800 text-xs font-semibold tracking-wide shadow-xs backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
                        <span>Next-Gen Analysis Powered by AI</span>
                    </div>

                    <h1 className="text-4xl xl:text-5xl tracking-tight text-gray-900 font-extrabold leading-[1.15] text-balance">
                        Analyze complex documents{" "}
                        <span className="text-orange-600 block sm:inline">
                            at the speed of thought.
                        </span>
                    </h1>

                    <p className="text-base text-gray-600 leading-relaxed font-normal text-pretty">
                        The collaborative intelligence layer for modern teams. Securely isolate workspaces, analyze multi-format PDF sets, and extract structured insights instantly.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-gray-700">
                        <span className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-200/80 shadow-xs transition-transform hover:-translate-y-0.5">
                            <ShieldCheck className="h-4 w-4 text-orange-600" /> Enterprise isolation
                        </span>
                        <span className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-200/80 shadow-xs transition-transform hover:-translate-y-0.5">
                            <Zap className="h-4 w-4 text-orange-600" /> Instant PDF synthesis
                        </span>
                    </div>
                </div>

                <blockquote className="relative z-10 border-l-2 border-orange-500/60 pl-4 text-xs xl:text-sm text-gray-500 italic font-medium">
                    &ldquo;The collaborative intelligence layer for modern teams to turn raw documents into actionable decisions.&rdquo;
                </blockquote>
            </section>

            <section
                role="region"
                aria-label="Authentication form"
                className="flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 relative bg-white/60 backdrop-blur-sm"
            >
                <div className="flex lg:hidden items-center mb-6">
                    <Link
                        href="/"
                        prefetch
                        aria-label="Docinate AI homepage"
                        className="inline-flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    >
                        <Image
                            src={images.logo_full}
                            alt="logo"
                            width={100}
                            height={100}
                            priority
                            className="object-contain"
                        />
                    </Link>
                </div>

                <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center">
                    <div className="mb-4 hidden sm:flex items-center gap-1.5 text-xs text-stone-500 font-medium bg-stone-100 px-3 py-1 rounded-full border border-stone-200/60">
                        <Lock className="w-3 h-3 text-stone-400" /> Secure SSL Connection
                    </div>

                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: "w-full shadow-none",
                                card: "shadow-2xl shadow-stone-900/5 border border-stone-200/80 bg-white/90 backdrop-blur-2xl rounded-[28px] p-6 sm:p-8 transition-all",
                                headerTitle: "text-gray-900 font-bold tracking-tight text-xl sm:text-2xl",
                                headerSubtitle: "text-gray-500 text-sm mt-1",
                                socialButtonsBlockButton:
                                    "border-stone-200 hover:bg-stone-50/80 text-stone-800 transition-all rounded-xl font-medium shadow-xs hover:shadow-sm active:scale-[0.99]",
                                formButtonPrimary:
                                    "bg-gray-900 text-white hover:bg-gray-800 rounded-xl transition-all shadow-md shadow-gray-900/15 font-medium active:scale-[0.98] py-2.5",
                                formFieldInput:
                                    "bg-stone-50/60 border-stone-200 text-gray-900 rounded-xl focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all py-2.5",
                                footerActionLink:
                                    "text-orange-600 hover:text-orange-700 hover:underline font-semibold transition-colors",
                                dividerLine: "bg-stone-200",
                                dividerText: "text-stone-400 text-xs tracking-wider uppercase font-sans font-medium",
                                formFieldLabel: "text-stone-700 font-semibold text-xs uppercase tracking-wider mb-1",
                                identityPreviewText: "text-stone-800 font-medium",
                                formFieldSuccessText: "text-emerald-600 font-medium text-xs",
                            },
                        }}
                    />
                </div>
            </section>
        </main>
    );
}