import { Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AIProgressCardProps } from "@/types";

export default function AIProgressCard({ percentage }: AIProgressCardProps) {
    return (
        <Card
            className="sm:col-span-2 xl:col-span-2 min-h-55 border-none bg-dashboard-panel text-white shadow-2xl relative overflow-hidden flex flex-col justify-center"
            role="region"
            aria-label="AI processing progress card">
            {/* Decorative Background Icon */}
            <div
                className="absolute -right-5 -bottom-5 opacity-10 rotate-12 pointer-events-none"
                aria-hidden="true"
            >
                <Brain className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48" />
            </div>

            <CardContent className="p-5 sm:p-6 lg:p-7 relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                        <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1"
                            aria-label="AI processing label">
                            Neural Processing
                        </p>

                        <div className="flex items-end sm:items-baseline gap-2 flex-wrap">
                            <span className="text-3xl sm:text-5xl font-black tracking-tighter leading-none"
                                aria-label={`AI indexing progress is ${percentage} percent`}>
                                {percentage}%
                            </span>

                            <span className="text-slate-400 font-medium text-sm sm:text-base whitespace-nowrap">
                                Indexed
                            </span>
                        </div>
                    </div>

                    <div className="p-2 sm:p-3 bg-slate-800/50 rounded-xl shrink-0"
                        aria-hidden="true">
                        <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                    </div>
                </div>

                {/* Progress Bar */}
                <div
                    className="w-full bg-slate-800/50 rounded-full h-3.5 p-1 my-5"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(percentage)}
                    aria-label="AI indexing progress"
                >
                    <div
                        className="bg-linear-to-r from-amber-400 via-orange-500 to-amber-400 h-full rounded-full transition-all duration-1000"
                        style={{
                            width: `${Math.min(
                                Math.max(percentage, 0),
                                100
                            )}%`,
                        }}
                    />
                </div>

                <p className="text-slate-400 text-[11px] sm:text-xs italic leading-relaxed" aria-label="AI engine status">
                    AI Engine is optimized and ready for queries
                </p>
            </CardContent>
        </Card>
    );
}