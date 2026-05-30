import { Brain, Clock, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentItemProps } from "@/types";

export default function DocumentItem({ doc }: DocumentItemProps) {
    return (
        <div
            className="group flex items-start sm:items-center justify-between gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all 
            duration-200 border border-transparent hover:border-slate-100"
            role="listitem"
            aria-label={`Document ${doc.name}`}>
            <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0"
                    aria-hidden="true">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 group-hover:text-amber-600 transition-colors duration-200" />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 truncate wrap-break-word">
                        {doc.name}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">
                        <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />

                        <time dateTime={new Date(doc.createdAt).toISOString()}>
                            {new Date(doc.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                            })}
                        </time>
                    </div>
                </div>
            </div>

            {doc.aiSummary ? (
                <div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-50 text-green-700 text-[10px] font-black border
                     border-green-100 uppercase tracking-tighter whitespace-nowrap shrink-0"
                    role="status"
                    aria-label="Document analyzed successfully">
                    <Brain className="h-3 w-3 shrink-0" aria-hidden="true" />
                    Analyzed
                </div>
            ) : (
                <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-lg h-8 px-3 bg-indigo-50 text-indigo-600 text-[10px] font-bold border border-indigo-100 uppercase 
                    tracking-wider transition-all hover:bg-indigo-100/80 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-indigo-600 shrink-0"
                    aria-label={`Process document ${doc.name}`}>
                    <RefreshCw className="h-3 w-3 shrink-0" aria-hidden="true" />
                    Process
                </Button>
            )}
        </div>
    );
}