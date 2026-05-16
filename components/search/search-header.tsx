import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SearchHeaderProps } from "@/types";

export function SearchHeader({ query, resultsCount }: SearchHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-100 shadow-sm text-xs font-semibold text-slate-700 backdrop-blur">
                    <Search className="w-3.5 h-3.5" />
                    Document Search
                </div>

                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
                        Search Documents
                    </h1>

                    <p className="text-slate-600 mt-3 text-base max-w-2xl leading-relaxed">
                        Instantly find reports, contracts, invoices,
                        and AI-generated insights across your workspace.
                    </p>
                </div>
            </div>

            {query && (
                <Card className="bg-white/90 border border-slate-100 rounded-3xl shadow-sm backdrop-blur-sm">
                    <CardContent className="px-6 py-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">
                            Results
                        </p>

                        <div className="mt-2 flex items-end gap-2">
                            <span className="text-4xl font-black text-slate-900">
                                {resultsCount}
                            </span>

                            <span className="text-sm text-slate-500 pb-1">
                                document
                                {resultsCount !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}