import AIInsightCard from "@/components/dashboard/ai-insight-card";
import AIProgressCard from "@/components/dashboard/ai-progress-card";
import AnalysisStatusChart from "@/components/dashboard/analysis-status-chart";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DocumentsChart from "@/components/analytics/documents-chart";
import EmptyDashboard from "@/components/dashboard/empty-dashboard";
import RecentDocuments from "@/components/dashboard/recent-documents";
import StatCard from "@/components/dashboard/stat-card";
import AmbientBackground from "@/components/document/ambient-background";
import { prisma } from "@/lib/prisma";
import { getWeeklyDocumentStats } from "@/lib/analytics";
import { auth } from "@clerk/nextjs/server";
import { FileText, Users } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface OrgDashboardPageProps {
    params: Promise<{ orgSlug: string }>;
}

export default async function OrgDashboardPage({
    params,
}: OrgDashboardPageProps) {
    const { userId } = await auth();

    if (!userId) redirect("/sign-in");

    const resolvedParams = await params;
    const orgSlug = resolvedParams?.orgSlug;

    const organization = await prisma.organization.findUnique({
        where: { slug: orgSlug },
        include: {
            _count: {
                select: { documents: true, members: true },
            },
            documents: {
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });

    if (!organization) redirect("/select-org");

    const membership = await prisma.organizationMember.findFirst({
        where: {
            organizationId: organization.id,
            user: { clerkUserId: userId },
        },
    });

    if (!membership) redirect("/select-org");

    const MAX_DOCS_CAP = 100;
    const MAX_MEMBERS_CAP = 25;

    const docsProgress =
        (organization._count.documents / MAX_DOCS_CAP) * 100;

    const membersProgress =
        (organization._count.members / MAX_MEMBERS_CAP) * 100;

    const analyzedDocs = await prisma.document.count({
        where: {
            organizationId: organization.id,
            aiSummary: { not: null },
        },
    });

    const pendingDocs =
        organization._count.documents - analyzedDocs;

    const analysisStatusData = [
        {
            name: "Analyzed",
            value: analyzedDocs,
        },
        {
            name: "Pending",
            value: pendingDocs,
        },
    ];

    const weeklyChartData =
        await getWeeklyDocumentStats(
            organization.id
        );

    const analysisPercentage =
        organization._count.documents > 0
            ? Math.round(
                (analyzedDocs / organization._count.documents) * 100
            )
            : 0;

    if (organization._count.documents === 0) {
        return (
            <EmptyDashboard
                orgName={organization.name}
                orgSlug={orgSlug}
                role={membership.role}
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50" aria-label="Organization dashboard page">
            <AmbientBackground />

            <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10"
                role="main"
                aria-label="Dashboard content"
            >
                {/* Header Section */}
                <DashboardHeader
                    orgName={organization.name}
                    role={membership.role}
                    orgSlug={orgSlug}
                />

                {/* Stats Grid */}
                <section
                    aria-label="Organization statistics overview"
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 items-stretch"
                >
                    <StatCard
                        title="Total Assets"
                        value={organization._count.documents}
                        icon={<FileText className="text-blue-500" />}
                        description="Stored in vault"
                        gradient="from-blue-400 via-blue-500 to-indigo-400"
                        progress={docsProgress}
                    />

                    <StatCard
                        title="Active Members"
                        value={organization._count.members}
                        icon={<Users className="text-indigo-500" />}
                        description="Team collaborators"
                        gradient="from-violet-400 via-violet-500 to-purple-400"
                        progress={membersProgress}
                    />

                    <AIProgressCard percentage={analysisPercentage} />
                </section>

                <section
                    aria-label="Document analytics"
                    className="grid grid-cols-1 xl:grid-cols-3 gap-6"
                >
                    <div className="xl:col-span-2">
                        <DocumentsChart data={weeklyChartData} />
                    </div>

                    <AnalysisStatusChart
                        data={analysisStatusData}
                    />
                </section>

                {/* Bottom Section */}
                <section
                    aria-label="Recent activity and AI insights"
                    className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-start"
                >
                    <RecentDocuments
                        documents={organization.documents}
                        orgSlug={orgSlug}
                    />

                    <AIInsightCard role={membership.role} />
                </section>
            </div>
        </div>
    );
}