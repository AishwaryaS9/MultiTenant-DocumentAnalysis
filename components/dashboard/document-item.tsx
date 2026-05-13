import { Brain, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentItemProps } from "@/types";

export default function DocumentItem({ doc }: DocumentItemProps) {
    return (
        <div className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-100">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-slate-400 group-hover:text-amber-600" />
                </div>

                <div>
                    <p className="font-bold text-slate-900">
                        {doc.name}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">
                        <Clock className="w-3 h-3" />

                        {new Date(doc.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                        })}
                    </div>
                </div>
            </div>

            {doc.aiSummary ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-50 text-green-700 text-[10px] font-black border border-green-100 uppercase tracking-tighter">
                    <Brain className="h-3 w-3" />
                    Analyzed
                </div>
            ) : (
                <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-lg h-8 text-xs font-bold"
                >
                    Process
                </Button>
            )}
        </div>
    );
}