import { ProcessingPerformanceChartProps } from "@/types";

export default function ProcessingPerformanceChart({
    title = "Processing performance",
    subtitle = "AI analysis coverage by workflow",
    badge,
    items,
    unit = "%",
    max,
    footerLabel = "Overall average",
    footerValue,
    footerDelta,
}: ProcessingPerformanceChartProps) {
    const scaleMax = max ?? Math.max(...items.map((i) => i.value), 1);

    return (
        <section
            aria-labelledby="processing-performance-heading"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h2
                        id="processing-performance-heading"
                        className="chart-title"
                    >
                        {title}
                    </h2>
                    <p className="chart-subtitle">{subtitle}</p>
                </div>

                {badge && (
                    <span className="shrink-0 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700">
                        {badge}
                    </span>
                )}
            </div>

            <ul className="mt-8 space-y-5">
                {items.map((item) => {
                    const width = Math.min((item.value / scaleMax) * 100, 100);

                    return (
                        <li
                            key={item.label}
                            className="flex items-center gap-4"
                        >
                            <span
                                className="w-32 shrink-0 truncate text-xs font-normal text-slate-700 sm:w-40"
                                title={item.label}
                            >
                                {item.label}
                            </span>

                            <div
                                role="progressbar"
                                aria-label={item.label}
                                aria-valuenow={item.value}
                                aria-valuemin={0}
                                aria-valuemax={scaleMax}
                                className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200/70"
                            >
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-500"
                                    style={{ width: `${width}%` }}
                                />
                            </div>

                            <span className="w-14 shrink-0 text-right text-xs font-normal text-slate-600">
                                {item.value}
                                {unit}
                            </span>
                        </li>
                    );
                })}
            </ul>

            <div className="mt-8 flex items-center justify-between rounded-2xl bg-stone-50 px-5 py-4">
                <span className="text-xs text-slate-500">{footerLabel}</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-slate-900">
                        {footerValue}
                        {unit}
                    </span>
                    {footerDelta && (
                        <span className="text-xs font-semibold text-emerald-600">
                            {footerDelta}
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
}