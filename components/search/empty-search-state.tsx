import { Search, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { searchSuggestions } from "@/app/data/data";
import { Badge } from "../ui/badge";

export function EmptySearchState() {
    return (
        <section aria-labelledby="empty-search-title" className="w-full">
            <Card className="overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-sm">
                <CardContent className="relative px-6 py-10 text-center md:px-16 md:py-12">

                    {/* Icon */}
                    <div
                        className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-100 bg-linear-to-br from-amber-50 to-orange-50"
                        aria-hidden="true">
                        <Search className="h-9 w-9 text-amber-600" aria-hidden="true" />
                    </div>

                    {/* Badge */}
                    <div
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-700"
                        aria-hidden="true">
                        <Sparkles className="h-3.5 w-3.5" />
                        Smart Workspace Search
                    </div>

                    {/* Heading */}
                    <h2 id="empty-search-title"
                        className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                        Find anything instantly
                    </h2>

                    {/* Description */}
                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
                        Search invoices, contracts, AI summaries,
                        meeting notes, reports, and workspace
                        knowledge — all in one place.
                    </p>

                    {/* Suggestions */}
                    <div className="mt-7 flex flex-wrap justify-center gap-2.5" role="list" aria-label="Search suggestions">
                        {searchSuggestions.map((item) => (
                            <Badge
                                key={item}
                                role="listitem"
                                variant="secondary"
                                className="cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
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