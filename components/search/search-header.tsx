import { Search, Sparkles } from "lucide-react";
import { SearchHeaderProps } from "@/types";

export function SearchHeader({
    query,
    resultsCount,
}: SearchHeaderProps) {
    return (
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {/* Left Content */}
            <div className="space-y-4">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50/80 px-3.5 py-1.5 
                text-xs font-semibold text-amber-700 shadow-sm backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Powered Search
                </div>

                {/* Heading */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
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
                <div className="inline-flex items-center gap-4 rounded-lg shadow-xs bg-white/80 px-5 py-4 "    >
                    {/* Icon */}
                    <div
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 border border-amber-100">
                        <Search className="h-5 w-5 text-amber-600" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-500">
                            Search Results
                        </span>

                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold tracking-tight text-slate-900">
                                {resultsCount}
                            </span>

                            <span className="text-sm text-slate-500">
                                document
                                {resultsCount !== 1 ? "s" : ""}&nbsp;
                                found
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}