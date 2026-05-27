import { FileSearch, SearchX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { NoResultsStateProps } from "@/types";

export function NoResultsState({
    query,
}: NoResultsStateProps) {
    return (
        <Card className="overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-sm">
            <CardContent className="px-10 py-14 text-center md:px-16">
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl">
                    <FileSearch className="h-9 w-9  text-amber-600" />
                </div>

                {/* Badge */}
                <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-amber-700 border border-amber-100 bg-amber-50">
                    <SearchX className="h-3.5 w-3.5 " />
                    No Results Found
                </div>

                {/* Heading */}
                <h3 className="text-3xl font-bold tracking-tight text-slate-900">
                    No matching documents
                </h3>

                {/* Description */}
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
                    We couldn’t find anything matching
                    <span className="mx-2 inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">
                        {query}
                    </span>
                    Try using different keywords or broader
                    search terms.
                </p>

                {/* Suggestions */}
                <div className="mt-7 flex flex-wrap justify-center gap-2.5">
                    {[
                        "contracts",
                        "invoices",
                        "reports",
                        "AI summary",
                    ].map((item) => (
                        <div key={item}
                            className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600
                                 transition-colors hover:border-amber-200  hover:bg-amber-50 hover:text-amber-700">
                            {item}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}