import { AnalyticsCardProps } from "@/types";
import { FileText, Users, Brain, Clock } from "lucide-react";

export default function AnalyticsCards({ totalAnalyzed, aiCoverage, activeUsers, pendingAnalysis }: AnalyticsCardProps) {
    const cards = [
        {
            title: "Total Analyzed",
            value: totalAnalyzed,
            icon: FileText,
        },
        {
            title: "AI Coverage",
            value: `${aiCoverage}%`,
            icon: Brain,
        },
        {
            title: "Active Users",
            value: activeUsers,
            icon: Users,
        },
        {
            title: "Pending Analysis",
            value: pendingAnalysis,
            icon: Clock,
        },
    ];

    return (
        <section
            aria-label="Analytics summary"
            className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"
            role="list"
        >
            {cards.map((card) => {
                const headingId = `analytics-card-${card.title.toLowerCase().replace(/\s+/g, "-")}`;

                return (
                    <article
                        key={card.title}
                        role="listitem"
                        aria-labelledby={headingId}
                        tabIndex={0}
                        className="bg-white rounded-2xl border p-6 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1"
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

                        <p className="mt-4 text-3xl font-bold wrap-break-word">
                            {card.value}
                        </p>
                    </article>
                );
            })}
        </section>
    );
}