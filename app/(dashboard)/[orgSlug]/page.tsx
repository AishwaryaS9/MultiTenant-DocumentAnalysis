import AIInsightCard from "@/components/dashboard/ai-insight-card";
import AIProgressCard from "@/components/dashboard/ai-progress-card";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DocumentsChart from "@/components/analytics/documents-chart";
import EmptyDashboard from "@/components/dashboard/empty-dashboard";
import RecentDocuments from "@/components/dashboard/recent-documents";
import StatCard from "@/components/dashboard/stat-card";
import { prisma } from "@/lib/prisma";
import { getWeeklyDocumentStats } from "@/lib/analytics";
import { auth } from "@clerk/nextjs/server";
import { FileText, Users } from "lucide-react";
import { redirect } from "next/navigation";
import AIAnalysisCta from "@/components/dashboard/ai-analysis-cta";

export const dynamic = "force-dynamic";

interface OrgDashboardPageProps {
    params: Promise<{ orgSlug: string }>;
}

export default async function OrgDashboardPage({ params }: OrgDashboardPageProps) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const { orgSlug } = await params;

    const organization = await prisma.organization.findUnique({
        where: { slug: orgSlug },
        include: {
            _count: { select: { documents: true, members: true } },
            documents: {
                take: 3,
                orderBy: { createdAt: "desc" },
                include: { user: { select: { name: true, email: true } } },
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

    const isAdmin = membership.role === "admin";

    const MAX_DOCS_CAP = 100;
    const MAX_MEMBERS_CAP = 25;

    const totalDocs = organization._count.documents;
    const totalMembers = organization._count.members;

    const docsProgress = (totalDocs / MAX_DOCS_CAP) * 100;
    const membersProgress = (totalMembers / MAX_MEMBERS_CAP) * 100;

    const analyzedDocs = await prisma.document.count({
        where: { organizationId: organization.id, aiSummary: { not: null } },
    });

    const weeklyChartData = await getWeeklyDocumentStats(organization.id);

    const analysisPercentage =
        totalDocs > 0 ? Math.round((analyzedDocs / totalDocs) * 100) : 0;


    if (totalDocs === 0) {
        return (
            <EmptyDashboard
                orgName={organization.name}
                orgSlug={orgSlug}
                role={membership.role}
            />
        );
    }

    return (
        <main
            className="min-h-screen bg-slate-50/50 text-slate-900"
            aria-label="Organization dashboard page"
        >
            <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8">
                <DashboardHeader
                    orgName={organization.name}
                    role={membership.role}
                    orgSlug={orgSlug}
                />

                {/* Overview */}
                <section
                    aria-label="Organization statistics overview"
                    className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3"
                >
                    <StatCard
                        title="Documents"
                        value={totalDocs}
                        icon={<FileText className="text-primary" />}
                        description={`of ${MAX_DOCS_CAP} Stored in vault`}
                        gradient="from-orange-500 to-amber-400"
                        progress={docsProgress}
                    />

                    <StatCard
                        title="Workspace members"
                        value={totalMembers}
                        icon={<Users className="text-primary" />}
                        description={`of ${MAX_MEMBERS_CAP} seats used`}
                        gradient="from-orange-400 to-amber-400"
                        progress={membersProgress}
                    />

                    <AIProgressCard percentage={analysisPercentage} />

                </section>

                {/* Analytics */}
                <section
                    aria-label="Document analytics"
                    className="grid grid-cols-1 gap-6 xl:grid-cols-3"
                >
                    <div className="xl:col-span-2">
                        <DocumentsChart data={weeklyChartData} />
                    </div>
                    {isAdmin ? (
                        <AIInsightCard role={membership.role} />
                    ) : (
                        <AIAnalysisCta orgSlug={orgSlug} />
                    )}
                </section>

                {/* Activity */}
                <section
                    aria-label="Recent activity and AI insights"
                    className=" items-start gap-2 lg:gap-8"
                >
                    <RecentDocuments
                        documents={organization.documents}
                        orgSlug={orgSlug}
                    />
                </section>
            </div>
        </main>
    );
}