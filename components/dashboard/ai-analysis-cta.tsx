import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { AIAnalysisCtaProps } from "@/types";

export default function AIAnalysisCta({ orgSlug, href }: AIAnalysisCtaProps) {
    const target = href ?? `/${orgSlug}/documents`;

    return (
        <section
            aria-label="Start an AI analysis"
            className="flex h-full flex-col justify-between gap-8 rounded-3xl border border-white/10 bg-insight p-6 text-insight-foreground shadow-xs transition-all duration-300 hover:border-primary/30 hover:shadow-sm sm:p-7"
        >
            <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                    <div
                        className="flex size-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20"
                        aria-hidden="true"
                    >
                        <Sparkles className="size-6 fill-white text-white" />
                    </div>

                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-lightOrange">
                        Powered by Gemini
                    </span>
                </div>

                <div className="space-y-2.5">
                    <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-insight-foreground">
                        Turn documents
                        <br />
                        into decisions.
                    </h2>
                    <p className="max-w-[34ch] text-sm leading-relaxed text-white/70">
                        Run summaries, Q&amp;A, sentiment, entities, and structured
                        extraction in seconds.
                    </p>
                </div>
            </div>

            <Link
                href={target}
                className="group flex items-center justify-between rounded-2xl bg-insight-foreground px-5 py-4 text-base font-semibold text-insight 
                transition-colors hover:bg-lightOrange hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-insight"
            >
                Start an AI analysis
                <ChevronRight
                    className="size-5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                    aria-hidden="true"
                />
            </Link>
        </section>
    );
}