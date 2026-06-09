"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { DocumentTypesChartProps } from "@/types";

const COLORS = [
    "#3b82f6",
    "#10b981",
    "#6366f1",
    "#f59e0b",
    "#ec4899",
    "#14b8a6",
];

export default function DocumentTypesChart({ title, data }: DocumentTypesChartProps) {
    const totalDocs = data.reduce((sum, item) => sum + item.value, 0);

    const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop");

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 480) {
                setScreenSize("mobile");
            } else if (window.innerWidth < 768) {
                setScreenSize("tablet");
            } else {
                setScreenSize("desktop");
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const chartId = `chart-${title.toLowerCase().replace(/\s+/g, "-")}`;
    const descriptionId = `${chartId}-description`;

    return (
        <section
            role="figure"
            aria-labelledby={chartId}
            aria-describedby={descriptionId}
            className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
                <h3
                    id={chartId}
                    className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100"
                >
                    {title}
                </h3>

                <span
                    aria-label={`Total documents: ${totalDocs}`}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                >
                    Total: {totalDocs}
                </span>
            </div>

            <div id={descriptionId} className="sr-only">
                {title}. Total documents: {totalDocs}. Breakdown:
                {data.map((item) => ` ${item.name}: ${item.value}.`)}
            </div>

            <div className="relative flex h-65 sm:h-80 md:h-90 w-full flex-col">
                {data.length === 0 || totalDocs === 0 ? (
                    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                        <div className="text-center px-4">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                No document types available
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Upload documents to view file type distribution.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="relative h-[calc(100%-40px)] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={
                                            screenSize === "mobile"
                                                ? 35
                                                : screenSize === "tablet"
                                                    ? 55
                                                    : 70
                                        }
                                        outerRadius={
                                            screenSize === "mobile"
                                                ? 55
                                                : screenSize === "tablet"
                                                    ? 80
                                                    : 95
                                        }
                                        paddingAngle={4}
                                        cornerRadius={6}
                                        animationDuration={800}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                    index %
                                                    COLORS.length
                                                    ]
                                                }
                                                className="transition-all duration-300 hover:opacity-85"
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor:
                                                "rgba(255, 255, 255, 0.95)",
                                            borderRadius: "12px",
                                            border: "1px solid #e2e8f0",
                                            boxShadow:
                                                "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                            padding: "8px 12px",
                                        }}
                                        itemStyle={{
                                            fontSize: "13px",
                                            color: "#1e293b",
                                        }}
                                        cursor={{
                                            fill: "transparent",
                                        }}
                                        wrapperStyle={{
                                            zIndex: 1000,
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
                            >
                                <span className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
                                    {totalDocs}
                                </span>

                                <span className="text-[8px] sm:text-[10px] font-medium uppercase tracking-wider text-slate-400">
                                    Docs
                                </span>
                            </div>
                        </div>

                        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 px-2">
                            {data.map((item, index) => (
                                <div
                                    key={item.name}
                                    className="flex items-center gap-2 text-xs"
                                >
                                    <div
                                        className="h-3 w-3 rounded-full"
                                        style={{
                                            backgroundColor:
                                                COLORS[
                                                index %
                                                COLORS.length
                                                ],
                                        }}
                                    />
                                    <span className="max-w-22.5 truncate text-slate-600">
                                        {item.name} ({item.value})
                                    </span>
                                </div>
                            ))}
                        </div>

                    </>
                )}
            </div>
        </section>
    );
}