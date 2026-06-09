"use client";

import { DocumentsChartProps } from "@/types";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function DocumentsChart({ data }: DocumentsChartProps) {
    const chartId = "documents-processed-chart";
    const descriptionId = `${chartId}-description`;

    const totalDocuments = data.reduce(
        (sum, item) => sum + item.documents,
        0
    );

    const hasData = data.length > 0 && totalDocuments > 0;

    return (
        <section
            role="figure"
            aria-labelledby={chartId}
            aria-describedby={descriptionId}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 id={chartId} className="mb-4 text-lg font-semibold">
                Documents Processed This Week
            </h3>

            <div id={descriptionId} className="sr-only">
                Documents processed this week. Total documents processed:
                {" "}
                {totalDocuments}.
                {data.map(
                    (item) =>
                        ` ${item.day}: ${item.documents} documents.`
                )}
            </div>

            <div className="h-64 sm:h-72">
                {!hasData ? (
                    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
                        <div className="px-4 text-center">
                            <p className="text-sm font-medium text-slate-600">
                                No documents processed yet
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Upload documents to start tracking weekly processing activity.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div aria-hidden="true" className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{
                                    top: 5,
                                    right: 20,
                                    left: 10,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="day"
                                    tick={{ fontSize: 13 }}
                                />

                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 13 }}
                                />

                                <Tooltip
                                    cursor={{ fill: "#FFF7ED" }}
                                />

                                <Bar
                                    dataKey="documents"
                                    radius={[8, 8, 0, 0]}
                                    fill="#F97316"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </section>
    );
}