"use client";

import { TopKeywordsChartProps } from "@/types";

const TOP_N = 5;

export default function TopKeywordsChart({ data }: TopKeywordsChartProps) {
    const chartId = "top-keywords-chart";
    const descriptionId = `${chartId}-description`;
    const totalKeywordUses = data.reduce((sum, item) => sum + item.count, 0);

    const topKeywords = [...data]
        .sort((a, b) => b.count - a.count)
        .slice(0, TOP_N)
        .map((item) => ({
            ...item,
            percent:
                totalKeywordUses > 0
                    ? Math.round((item.count / totalKeywordUses) * 100)
                    : 0,
        }));

    return (
        <section
            role="figure"
            aria-labelledby={chartId}
            aria-describedby={descriptionId}
            className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7"
        >
            <div className="mb-7">
                <h3
                    id={chartId}
                    className="chart-title"
                >
                    Top keywords
                </h3>

                <p className="chart-subtitle">
                    Most frequent search terms over the last 30 days
                </p>
            </div>

            <div id={descriptionId} className="sr-only">
                Top {TOP_N} keywords. Total keyword uses: {totalKeywordUses}.
                {topKeywords.map(
                    (item) =>
                        ` ${item.keyword}: ${item.count} uses, ${item.percent} percent.`
                )}
            </div>

            {topKeywords.length === 0 ? (
                <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
                    <div className="px-4 text-center">
                        <p className="text-sm font-medium text-slate-600">
                            No keywords available
                        </p>

                        <p className="chart-subtitle">
                            Upload and analyze documents to generate keyword insights.
                        </p>
                    </div>
                </div>
            ) : (
                <ul aria-hidden="true" className="space-y-5">
                    {topKeywords.map((item) => (
                        <li key={item.keyword}>
                            <div className="mb-2 flex items-baseline justify-between gap-4">
                                <span className="truncate text-xs font-normal text-slate-700 capitalize">
                                    {item.keyword}
                                </span>

                                <span className="shrink-0 text-xs font-normal  text-slate-500">
                                    {item.percent}%
                                </span>
                            </div>

                            <div className="h-2 w-full overflow-hidden rounded-full bg-[#F1EDE8]">
                                <div
                                    className="h-full rounded-full bg-primary"
                                    style={{ width: `${item.percent}%` }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}