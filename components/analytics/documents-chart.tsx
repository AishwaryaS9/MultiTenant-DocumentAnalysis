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
                <div aria-hidden="true" className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 20,
                                left: 10,
                                bottom: 5,
                            }}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 12 }}
                            />

                            <YAxis
                                allowDecimals={false}
                                tick={{ fontSize: 12 }}
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
            </div>
        </section>
    );
}