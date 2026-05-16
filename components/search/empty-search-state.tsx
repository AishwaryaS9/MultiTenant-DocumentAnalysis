import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { searchSuggestions } from "@/app/data/data";

export function EmptySearchState() {
    return (
        <Card className="bg-white/80 backdrop-blur border-dashed border-slate-200 rounded-[32px] shadow-sm">
            <CardContent className="p-20 text-center">
                <div className="mx-auto w-20 h-20 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-amber-500" />
                </div>

                <h3 className="text-2xl font-bold text-slate-900">
                    Search your workspace
                </h3>

                <p className="text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
                    Try searching for invoices, contracts,
                    reports, meeting notes, AI summaries,
                    or keywords.
                </p>

                <div className="flex flex-wrap justify-center gap-2 mt-8">
                    {searchSuggestions.map((item) => (
                        <Badge
                            key={item}
                            variant="secondary"
                            className="rounded-full px-4 py-2 bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100"
                        >
                            {item}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}