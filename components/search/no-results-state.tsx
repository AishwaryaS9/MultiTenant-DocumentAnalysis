import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { NoResultsStateProps } from "@/types";

export function NoResultsState({ query }: NoResultsStateProps) {
    return (
        <Card className="bg-white/90 border border-slate-100 rounded-[32px] shadow-sm backdrop-blur-sm">
            <CardContent className="p-20 text-center">
                <div className="mx-auto w-20 h-20 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-6">
                    <FileText className="w-10 h-10 text-amber-500" />
                </div>

                <h3 className="text-2xl font-black text-slate-900">
                    No documents found
                </h3>

                <p className="text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
                    We couldn’t find anything matching{" "}
                    <span className="font-semibold text-slate-700">
                        "{query}"
                    </span>
                    .
                </p>
            </CardContent>
        </Card>
    );
}