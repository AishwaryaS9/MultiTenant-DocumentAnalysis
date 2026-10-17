import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildDocumentsChartData, } from "@/lib/analytics";
import AnalyticsCards from "@/components/analytics/analytics-cards";
import DocumentTypesChart from "@/components/analytics/document-types-chart";
import TopKeywordsChart from "@/components/analytics/top-keywords-chart";
import AmbientBackground from "@/components/document/ambient-background";
import DocumentsByUserChart from "@/components/analytics/documents-by-user-chart";
import { Button } from "@/components/ui/button";
import AllDocumentsChart from "@/components/analytics/all-documents-chart";
import AnalyticsStatusChart from "@/components/analytics/analytics-status-chart";
import ProcessingPerformanceChart from "@/components/analytics/processing-performance-chart";

interface Props {
    params: Promise<{
        orgSlug: string;
    }>;
}

export default async function AnalyticsPage({ params }: Props) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const { orgSlug } = await params;

    const organization = await prisma.organization.findUnique({
        where: {
            slug: orgSlug,
        },
        include: {
            _count: {
                select: {
                    documents: true,
                    members: true,
                },
            },
        },
    });

    if (!organization) {
        redirect("/select-org");
    }

    const membership =
        await prisma.organizationMember.findFirst({
            where: {
                organizationId: organization.id,
                user: {
                    clerkUserId: userId,
                },
            },
        });

    if (!membership) {
        redirect("/select-org");
    }

    const documents = await prisma.document.findMany({
        where: {
            organizationId: organization.id,
        },
        select: {
            id: true,
            userId: true,
            fileType: true,
            sentiment: true,
            aiSummary: true,
            aiKeywords: true,
            createdAt: true,
            user: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    });


    const documentsChartData = buildDocumentsChartData(
        documents.map((doc) => doc.createdAt)
    );

    // KPI CARDS
    const totalDocs = documents.length;

    const totalAnalyzed = documents.filter(
        (doc) => doc.aiSummary
    ).length;

    const aiCoverage =
        totalDocs > 0
            ? Math.round((totalAnalyzed / totalDocs) * 100)
            : 0;

    const activeUsers = new Set(
        documents.map((doc) => doc.userId)
    ).size;

    const pendingAnalysis =
        totalDocs - totalAnalyzed;

    // DOCUMENT STATUS
    const documentStatusData = [
        { name: "Analyzed", value: totalAnalyzed },
        { name: "Processing", value: 0 }, // replace once you track a processing state
        { name: "Not analyzed", value: pendingAnalysis },
    ];

    // PROCESSING PERFORMANCE (coverage per workflow)
    const pct = (count: number) =>
        totalDocs > 0 ? Math.round((count / totalDocs) * 100) : 0;

    const workflowData = [
        { label: "Summary", value: pct(documents.filter((d) => d.aiSummary).length) },
        { label: "Keyword extraction", value: pct(documents.filter((d) => d.aiKeywords.length > 0).length) },
        { label: "Sentiment analysis", value: pct(documents.filter((d) => d.sentiment).length) },
    ];

    const overallCoverage = workflowData.length
        ? Math.round(workflowData.reduce((sum, w) => sum + w.value, 0) / workflowData.length)
        : 0;

    // DOCUMENT TYPES
    const typeMap: Record<string, number> = {};

    documents.forEach((doc) => {
        const type =
            doc.fileType?.toUpperCase() || "UNKNOWN";

        typeMap[type] =
            (typeMap[type] || 0) + 1;
    });

    const documentTypesData = Object.entries(
        typeMap
    ).map(([name, value]) => ({
        name,
        value,
    }));

    // Documents uploaded by user
    const userUploadMap: Record<
        string,
        {
            user: string;
            uploads: number;
        }
    > = {};

    documents.forEach((doc) => {
        const userName =
            doc.user?.name ||
            doc.user?.email ||
            "Unknown User";

        if (!userUploadMap[userName]) {
            userUploadMap[userName] = {
                user: userName,
                uploads: 0,
            };
        }

        userUploadMap[userName].uploads++;
    });

    const documentsByUserData = Object.values(
        userUploadMap
    )
        .sort((a, b) => b.uploads - a.uploads)
        .slice(0, 10);

    // KEYWORDS

    const keywordMap: Record<string, number> =
        {};

    documents.forEach((doc) => {
        doc.aiKeywords.forEach((keyword) => {
            const normalized =
                keyword.toLowerCase();

            keywordMap[normalized] =
                (keywordMap[normalized] || 0) + 1;
        });
    });

    const topKeywordsData = Object.entries(
        keywordMap
    )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([keyword, count]) => ({
            keyword,
            count,
        }));

    return (
        <main aria-labelledby="team-directory-heading" className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
            <AmbientBackground />

            <header
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 w-full"
                aria-labelledby="team-directory-heading">
                {/* Page Info */}
                <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span
                            className="text-xs font-bold uppercase tracking-wider text-orange-600 truncate"
                            aria-label={`Workspace Insights`}>
                            WORKSPACE INSIGHTS
                        </span>
                    </div>

                    <div className="flex items-baseline gap-3 flex-wrap">
                        <h1
                            id="team-directory-heading"
                            className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight truncate">
                            Analytics
                        </h1>
                    </div>

                    <p className="text-sm text-slate-500">
                        Track document activity, AI usage, and time saved.
                    </p>
                </div>

                <div
                    className="flex items-center gap-3 shrink-0 "
                    role="status">
                    <Button
                        variant="outline"
                        aria-label="Export Report"
                        className="rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 border-slate-200 shadow-sm cursor-pointer min-h-10 px-4 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-600"
                    >
                        Export Report
                    </Button>
                </div>
            </header>

            <div className="mx-auto  py-8 space-y-8">

                <AnalyticsCards
                    totalAnalyzed={totalAnalyzed}
                    aiCoverage={aiCoverage}
                    activeUsers={activeUsers}
                    pendingAnalysis={pendingAnalysis}
                />
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DocumentsByUserChart
                        data={documentsByUserData}
                    />

                    <TopKeywordsChart
                        data={topKeywordsData}
                    />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                    <AllDocumentsChart data={documentsChartData} />
                    <AnalyticsStatusChart data={documentStatusData} />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DocumentTypesChart
                        title="Document Types"
                        data={documentTypesData}
                    />
                    <ProcessingPerformanceChart
                        items={workflowData}
                        max={100}
                        badge={`${aiCoverage}% ANALYZED`}
                        footerValue={overallCoverage}
                        footerDelta={`${pendingAnalysis} pending`}
                    />
                </section>
            </div>
        </main>
    );
}