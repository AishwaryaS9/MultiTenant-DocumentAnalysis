"use client";

import { useEffect, useState } from "react";
import { AnalysisStatusChartProps } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#F26B21", "#FFC4A3", "#DDD9D3"];

function ChartTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0];

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
            <p className="text-xs font-medium text-slate-500">{name}</p>
            <p className="text-sm font-semibold text-slate-900">
                {value} {value === 1 ? "document" : "documents"}
            </p>
        </div>
    );
}

export default function AnalyticsStatusChart({ data }: AnalysisStatusChartProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const getValue = (...names: string[]) =>
        data?.find((d) => names.includes(d.name))?.value ?? 0;

    const analyzed = getValue("Analyzed");
    const processing = getValue("Processing");
    const notAnalyzed = getValue("Not analyzed", "Pending");
    const total = analyzed + processing + notAnalyzed;

    const chartData = [
        { name: "Analyzed", value: analyzed },
        { name: "Processing", value: processing },
        { name: "Not analyzed", value: notAnalyzed },
    ];

    return (
        <section
            role="figure"
            aria-labelledby="document-status-chart"
            aria-describedby="document-status-chart-description"
            className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7"
        >
            {/* Header */}
            <div>
                <h3
                    id="document-status-chart"
                    className="chart-title"
                >
                    Document status
                </h3>
                <p className="chart-subtitle">
                    Current processing breakdown
                </p>
            </div>

            <div id="document-status-chart-description" className="sr-only">
                Total documents: {total}.
                {chartData.map((item) => ` ${item.name}: ${item.value}.`)}
            </div>

            {/* Donut */}
            <div className="relative mt-6 h-56">
                {!isMounted ? (
                    <div className="flex h-full items-center justify-center">
                        <div className="size-44 animate-pulse rounded-full bg-slate-100" />
                    </div>
                ) : total === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3">
                        <div className="size-44 rounded-full border-22 border-slate-100" />
                        <p className="text-sm text-slate-500">No documents yet</p>
                    </div>
                ) : (
                    <>
                        <div aria-hidden="true" className="h-full w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={72}
                                        outerRadius={92}
                                        startAngle={90}
                                        endAngle={-270}
                                        dataKey="value"
                                        nameKey="name"
                                        stroke="#ffffff"
                                        strokeWidth={2}
                                        animationDuration={800}
                                    >
                                        {chartData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                        ))}
                                    </Pie>

                                    <Tooltip content={<ChartTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Center label */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
                        >
                            <span className="text-3xl font-bold leading-none text-slate-900">
                                {total}
                            </span>
                            <span className="mt-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                Documents
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* Legend */}
            <ul className="mt-6 space-y-3.5">
                {chartData.map((item, index) => (
                    <li
                        key={item.name}
                        className="flex items-center justify-between"
                    >
                        <span className="flex items-center gap-3 text-xs text-slate-500">
                            <span
                                className="size-2.5 rounded-full"
                                style={{ backgroundColor: COLORS[index] }}
                            />
                            {item.name}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                            {item.value}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}