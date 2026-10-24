import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { StatCardProps } from "@/types";

const StatCard = ({ title, value, icon, description, gradient, progress = 0 }: StatCardProps) => {
    const pct = Math.round(Math.min(Math.max(progress, 0), 100));

    return (
        <Card
            className="h-full w-full gap-0 py-0 card-outline"
            role="region"
            aria-label={`${title} statistics card`}
        >
            <CardContent className="flex h-full flex-col gap-2 px-4 py-6">
                {/* Title + icon */}
                <div className="flex items-center gap-2.5">
                    <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 [&>svg]:h-4 [&>svg]:w-4"
                        aria-hidden="true"
                    >
                        {icon}
                    </span>
                    <h3 className="text-[13px] font-semibold text-slate-600">{title}</h3>
                </div>

                {/* Value */}
                <div>
                    <p
                        className="text-xl font-bold leading-tight tabular-nums tracking-tight text-slate-900 sm:text-2xl"
                        aria-label={`${title} value is ${value}`}
                    >
                        {value}
                    </p>
                    {description && (
                        <p className="text-xs leading-tight text-slate-500">{description}</p>
                    )}
                </div>

                {/* Capacity */}
                <div className="mt-auto flex items-center gap-2">
                    <div
                        className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${title} capacity used`}
                    >
                        <div
                            className={cn(
                                "h-full rounded-full bg-linear-to-r transition-[width] duration-700 ease-out",
                                gradient || "from-teal-500 to-emerald-400"
                            )}
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                    <span className="w-8 shrink-0 text-right text-[11px] font-medium tabular-nums text-slate-500">
                        {pct}%
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

export default StatCard;