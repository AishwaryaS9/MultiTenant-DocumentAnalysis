"use client";

import { useMemo } from "react";
import { FileText } from "lucide-react";
import { DocumentTypesChartProps } from "@/types";
import { mimeTypeLabels } from "@/app/data/data";

export default function DocumentTypesChart({ title, data }: DocumentTypesChartProps) {
    const chartId = `chart-${title.toLowerCase().replace(/\s+/g, "-")}`;
    const descriptionId = `${chartId}-description`;

    const formattedData = useMemo(() => {
        return data
            .map((item) => {
                const lookupKey = item.name.trim().toLowerCase();

                return {
                    ...item,
                    name: mimeTypeLabels[lookupKey] ?? item.name,
                };
            })
            .sort((a, b) => b.value - a.value);
    }, [data]);

    const totalDocs = formattedData.reduce((sum, item) => sum + item.value, 0);
    const maxValue = Math.max(...formattedData.map((item) => item.value), 1);
    const hasData = formattedData.length > 0 && totalDocs > 0;

    return (
        <section
            role="figure"
            aria-labelledby={chartId}
            aria-describedby={descriptionId}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7"
        >
            {/* Header */}
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h3
                        id={chartId}
                        className="chart-title"
                    >
                        {title}
                    </h3>

                    <p className="chart-subtitle">
                        Workspace file distribution
                    </p>
                </div>

                <FileText
                    aria-hidden="true"
                    className="size-6 shrink-0 text-orange-500"
                    strokeWidth={1.75}
                />
            </div>

            <div id={descriptionId} className="sr-only">
                {title}. Total documents: {totalDocs}. Breakdown:
                {formattedData.map((item) => ` ${item.name}: ${item.value}.`)}
            </div>

            {!hasData ? (
                <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
                    <div className="px-4 text-center">
                        <p className="text-sm font-medium text-slate-600">
                            No document types available
                        </p>

                        <p className="chart-subtitle">
                            Upload documents to view file type distribution.
                        </p>
                    </div>
                </div>
            ) : (
                <div aria-hidden="true">
                    {/* Plot area */}
                    <div className="flex h-52 items-end justify-around gap-3 border-b border-slate-200 pt-8 sm:gap-6">
                        {formattedData.map((item, index) => {
                            const height = Math.max((item.value / maxValue) * 100, 4);

                            return (
                                <div
                                    key={item.name}
                                    className="flex h-full max-w-15 flex-1 items-end"
                                >
                                    <div
                                        className={`relative w-full rounded-t-xl  ${index === 0
                                            ? "bg-[#F26B21]"
                                            : "bg-[#FED1B7]"
                                            }`}
                                        style={{ height: `${height}%` }}
                                    >
                                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-normal text-slate-600">
                                            {item.value}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Category labels */}
                    <div className="mt-3 flex justify-around gap-3 sm:gap-6">
                        {formattedData.map((item) => (
                            <span
                                key={item.name}
                                className="max-w-15 flex-1 truncate text-center text-[11px] font-semibold text-slate-500"
                                title={item.name}
                            >
                                {item.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}