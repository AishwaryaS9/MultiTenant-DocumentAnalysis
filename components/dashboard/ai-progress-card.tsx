import { useId } from "react";
import { Card, CardContent } from "../ui/card";
import { Sparkles } from "lucide-react";
import { AIProgressCardProps } from "@/types";

const AIProgressCard = ({ percentage }: AIProgressCardProps) => {
    const gradientId = useId();
    const pct = Math.round(Math.min(Math.max(percentage, 0), 100));

    const status =
        pct === 0
            ? {
                label: "Not started",
                text: "Upload a document to begin analysis.",
                pill: "bg-slate-100 text-slate-600",
                dot: "bg-slate-400",
            }
            : pct < 100
                ? {
                    label: "In progress",
                    text: "Some documents are still waiting for a summary.",
                    pill: "bg-amber-50 text-amber-700",
                    dot: "bg-amber-500 animate-pulse motion-reduce:animate-none",
                }
                : {
                    label: "Complete",
                    text: "Every document has an AI summary.",
                    pill: "bg-emerald-50 text-emerald-700",
                    dot: "bg-emerald-500",
                };

    return (
        <Card
            className="group relative h-full w-full overflow-hidden card-outline"
            role="region"
            aria-label="AI analysis progress"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-orange-200/40 blur-3xl"
            />

            <CardContent className="relative flex h-full flex-col gap-5 p-5">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <span
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm shadow-orange-500/30"
                            aria-hidden="true"
                        >
                            <Sparkles className="h-4 w-4" />
                        </span>
                        <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                            AI analysis
                        </h3>
                    </div>

                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${status.pill}`}
                    >
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
                        {status.label}
                    </span>
                </div>

                <div className="mt-auto flex items-center gap-4">
                    <div
                        className="relative h-20 w-20 shrink-0"
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Documents analyzed"
                    >
                        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                            <defs>
                                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#fb923c" />
                                    <stop offset="100%" stopColor="#ea580c" />
                                </linearGradient>
                            </defs>
                            <circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                strokeWidth="9"
                                className="stroke-slate-100"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                strokeWidth="9"
                                strokeLinecap="round"
                                pathLength={100}
                                strokeDasharray={`${pct} 100`}
                                stroke={`url(#${gradientId})`}
                                className="transition-[stroke-dasharray] duration-700 ease-out motion-reduce:transition-none"
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold tabular-nums tracking-tight text-slate-900">
                            {pct}%
                        </span>
                    </div>

                    <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                            {pct}% of documents analyzed
                        </p>
                        <p className="mt-1 text-xs leading-snug text-slate-500">{status.text}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AIProgressCard;