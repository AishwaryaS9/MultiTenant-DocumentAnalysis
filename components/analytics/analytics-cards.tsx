import { AnalyticsCardProps } from "@/types";
import { FileText, Users, Brain, Clock } from "lucide-react";

export default function AnalyticsCards({ totalAnalyzed, aiCoverage, activeUsers, pendingAnalysis }: AnalyticsCardProps) {

    const cards = [
        {
            title: "Total Analyzed",
            value: totalAnalyzed,
            icon: FileText,
            description:
                totalAnalyzed === 0
                    ? "No documents analyzed yet"
                    : "Documents processed by AI",
        },
        {
            title: "AI Coverage",
            value: `${aiCoverage}%`,
            icon: Brain,
            description:
                aiCoverage === 0
                    ? "Upload documents to begin analysis"
                    : "Documents with AI insights",
        },
        {
            title: "Active Users",
            value: activeUsers,
            icon: Users,
            description:
                activeUsers === 0
                    ? "No active contributors yet"
                    : "Users uploading documents",
        },
        {
            title: "Pending Analysis",
            value: pendingAnalysis,
            icon: Clock,
            description:
                pendingAnalysis === 0
                    ? "All documents analyzed"
                    : "Awaiting AI processing",
        },
    ];

    return (
        <div className="space-y-6">
            <section
                aria-label="Analytics summary"
                className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"
                role="list">
                {cards.map((card) => {
                    const headingId = `analytics-card-${card.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`;

                    return (
                        <article
                            key={card.title}
                            role="listitem"
                            aria-labelledby={headingId}
                            tabIndex={0}
                            className="rounded-2xl border bg-white p-6 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1"
                        >
                            <div className="flex items-center justify-between">
                                <h3
                                    id={headingId}
                                    className="text-sm text-slate-500"
                                >
                                    {card.title}
                                </h3>

                                <card.icon
                                    aria-hidden="true"
                                    className="h-5 w-5 text-blue-500"
                                />
                            </div>

                            <p className="mt-4 wrap-break-word text-3xl font-bold text-slate-900">
                                {card.value}
                            </p>

                            <p className="mt-2 text-xs text-slate-500">
                                {card.description}
                            </p>
                        </article>
                    );
                })}
            </section>
        </div>
    );
}