import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getWeeklyDocumentStats } from "@/lib/analytics";
import AnalyticsCards from "@/components/analytics/analytics-cards";
import DocumentTypesChart from "@/components/analytics/document-types-chart";
import TopKeywordsChart from "@/components/analytics/top-keywords-chart";
import AmbientBackground from "@/components/document/ambient-background";
import DocumentsChart from "@/components/analytics/documents-chart";
import DocumentsByUserChart from "@/components/analytics/documents-by-user-chart";

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

    //weekly new documents
    const weeklyChartData =
        await getWeeklyDocumentStats(
            organization.id
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
        <div className="min-h-screen bg-slate-50/50">
            <AmbientBackground />

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

                <AnalyticsCards
                    totalAnalyzed={totalAnalyzed}
                    aiCoverage={aiCoverage}
                    activeUsers={activeUsers}
                    pendingAnalysis={pendingAnalysis}
                />

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DocumentTypesChart
                        title="Document Types"
                        data={documentTypesData}
                    />

                    <DocumentsChart
                        data={weeklyChartData}
                    />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DocumentsByUserChart
                        data={documentsByUserData}
                    />

                    <TopKeywordsChart
                        data={topKeywordsData}
                    />
                </section>
            </div>
        </div>
    );
}