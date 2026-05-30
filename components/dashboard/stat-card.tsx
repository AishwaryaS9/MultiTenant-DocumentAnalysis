import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { StatCardProps } from "@/types";

const StatCard = ({ title, value, icon, description, gradient, progress = 0 }: StatCardProps) => {
    return (
        <Card
            className={cn(
                "group relative overflow-hidden rounded-2xl w-full h-full",
                "border border-white/60 bg-white/90 backdrop-blur-xl",
                "shadow-[0_10px_40px_rgba(15,23,42,0.06)]",
                "transition-all duration-500 ease-out",
                "hover:shadow-lg"
            )}
            role="region"
            aria-label={`${title} statistics card`}
        >
            {/* Decorative Grid Pattern */}
            <div
                className="absolute inset-0 bg-grid-pattern opacity-40"
                aria-hidden="true"
            />

            <CardContent className="relative p-4 sm:p-5 lg:p-6 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                    {/* Left Content */}
                    <div className="space-y-2 flex-1 min-w-0">
                        {/* Label */}
                        <div className="flex items-center gap-2">
                            <span
                                className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 wrap-break-word"
                                aria-label="Statistic label"
                            >
                                {title}
                            </span>
                        </div>

                        {/* Value */}
                        <div className="flex items-end gap-2">
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-none truncate"
                                aria-label={`${title} value is ${value}`}>
                                {value}
                            </h3>
                        </div>

                        {/* Description */}
                        {description && (
                            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 font-medium wrap-break-word"
                                aria-label={`${title} description`}>
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Icon Box */}
                    <div className={cn(
                        "relative flex h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-2xl shrink-0",
                        "border border-white/80 bg-white/80 backdrop-blur-md",
                        "shadow-sm shadow-slate-200/40"
                    )}
                        aria-hidden="true">
                        <div className={cn(
                            "absolute inset-0 rounded-2xl opacity-20 blur-xl",
                            gradient
                        )}
                        />

                        <div className="relative z-10 scale-90 sm:scale-100">
                            {icon}
                        </div>
                    </div>
                </div>

                {/* Bottom dynamic progress */}
                <div className="mt-4 sm:mt-5 flex items-center gap-2"
                    aria-label={`${title} progress indicator`}>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"
                        aria-hidden="true">
                        <div
                            className={cn(
                                "h-full rounded-full bg-linear-to-r transition-all duration-500 ease-out",
                                gradient || "from-orange-400 to-amber-400"
                            )}
                            style={{
                                width: `${Math.min(
                                    Math.max(progress, 0),
                                    100
                                )}%`,
                            }}
                        />
                    </div>

                    <span
                        className="text-[10px] sm:text-[11px] font-bold tracking-wide text-slate-400 shrink-0"
                        aria-label={`Progress value ${Math.round(
                            progress
                        )} percent`}
                    >
                        {Math.round(progress)}%
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

export default StatCard;