import { Search, Sparkles } from "lucide-react";
import { SearchHeaderProps } from "@/types";

export function SearchHeader({ query, resultsCount }: SearchHeaderProps) {
    return (
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between" aria-labelledby="search-page-title">
            {/* Left Content */}
            <div className="space-y-4">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600
                 px-3.5 py-1.5 text-xs font-semibold shadow-sm backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>AI Powered Search</span>
                </div>

                {/* Heading */}
                <div>
                    <h1 id="search-page-title" className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                        Search Documents
                    </h1>

                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                        Instantly find reports, contracts,
                        invoices, and AI-generated insights
                        across your workspace.
                    </p>
                </div>
            </div>

            {/* Results Card */}
            {query && (
                <section
                    className="inline-flex w-full items-center gap-4 rounded-xl bg-white/80 px-5 py-4 shadow-xs md:w-auto"
                    aria-labelledby="search-results-heading"
                    role="status"
                    aria-live="polite"
                >
                    {/* Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50">
                        <Search
                            className="h-5 w-5 text-orange-600"
                            aria-hidden="true"
                        />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex flex-col">
                        <span
                            id="search-results-heading"
                            className="text-xs font-medium text-slate-500"
                        >
                            Search Results
                        </span>

                        <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-2xl font-bold tracking-tight text-slate-900">
                                {resultsCount}
                            </span>

                            <span className="text-sm text-slate-500">
                                document
                                {resultsCount !== 1 ? "s" : ""} found
                            </span>
                        </div>
                    </div>
                </section>
            )}
        </header>
    );
}