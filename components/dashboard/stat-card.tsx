import React from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description?: string;
    gradient?: string;
    progress?: number;
};

const StatCard = ({
    title,
    value,
    icon,
    description,
    gradient,
    progress = 0,
}: StatCardProps) => {
    return (
        <Card className={cn(
            "group relative overflow-hidden rounded-2xl",
            "border border-white/60 bg-white/90 backdrop-blur-xl",
            "shadow-[0_10px_40px_rgba(15,23,42,0.06)]",
            "transition-all duration-500 ease-out hover:shadow-xs"
        )}>
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-size-[24px_24px] opacity-40" />

            <CardContent className="relative p-6">
                <div className="flex items-start justify-between">
                    {/* Left Content */}
                    <div className="space-y-3">
                        {/* Label */}
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                                {title}
                            </span>
                        </div>

                        {/* Value */}
                        <div className="flex items-end gap-2">
                            <h3 className="text-4xl font-black tracking-tight text-slate-900 leading-none">
                                {value}
                            </h3>
                        </div>

                        {/* Description */}
                        {description && (
                            <p className="max-w-55 text-sm leading-relaxed text-slate-500 font-medium">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Icon */}
                    <div className={cn(
                        "relative flex h-14 w-14 items-center justify-center rounded-2xl",
                        "border border-white/80 bg-white/80 backdrop-blur-md",
                        "shadow-sm shadow-slate-200/40",
                        "transition-all duration-200",
                        "group-hover:scale-110"
                    )}>
                        <div className={cn("absolute inset-0 rounded-2xl opacity-20 blur-xl", gradient)} />
                        <div className="relative z-10">{icon}</div>
                    </div>
                </div>

                {/* Bottom dynamic progress/accent */}
                <div className="mt-6 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className={cn(
                                "h-full rounded-full bg-linear-to-r transition-all duration-500 ease-out", // Removed w-2/3, added smooth transition
                                gradient || "from-orange-400 to-amber-400"
                            )}
                            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} // 3. Use inline style to dynamically set width safely between 0-100
                        />
                    </div>

                    <span className="text-[11px] font-bold tracking-wide text-slate-400">
                        {Math.round(progress)}% {/* Optional: replaced "LIVE" with the actual % text */}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

export default StatCard;