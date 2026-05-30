import { FileSearch, SearchX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { NoResultsStateProps } from "@/types";
import { searchSuggestions } from "@/app/data/data";
import { Badge } from "../ui/badge";

export function NoResultsState({ query }: NoResultsStateProps) {
    return (
        <section aria-labelledby="no-results-title" aria-live="polite" className="w-full">
            <Card className="overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-sm">
                <CardContent className="px-6 py-12 text-center md:px-16 md:py-14">

                    {/* Icon */}
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-orange-100 bg-linear-to-br from-amber-50 to-orange-50" aria-hidden="true">
                        <FileSearch className="h-9 w-9 text-orange-400" aria-hidden="true" />
                    </div>

                    {/* Badge */}
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3.5 py-1.5 text-xs font-semibold text-orange-600"
                        aria-hidden="true">
                        <SearchX className="h-3.5 w-3.5" aria-hidden="true" />
                        No Results Found
                    </div>

                    {/* Heading */}
                    <h2 id="no-results-title" className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                        No matching documents
                    </h2>

                    {/* Description */}
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
                        We couldn’t find anything matching{" "}
                        <span className="mx-2 inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700"
                            aria-label={`Search query: ${query}`}>
                            {query}
                        </span>
                        Try using different keywords or broader search terms.
                    </p>

                    {/* Suggestions */}
                    <div className="mt-7 flex flex-wrap justify-center gap-2.5" role="list" aria-label="Suggested search terms">
                        {searchSuggestions.map((item) => (
                            <Badge
                                key={item}
                                role="listitem"
                                variant="secondary"
                                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 transition-colors
                                 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-400"
                            >
                                {item}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}