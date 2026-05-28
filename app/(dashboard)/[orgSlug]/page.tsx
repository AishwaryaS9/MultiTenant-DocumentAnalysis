import AIProgressCard from "@/components/dashboard/ai-progress-card";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import EmptyDashboard from "@/components/dashboard/empty-dashboard";
import InviteTeamModal from "@/components/dashboard/invite-team-modal";
import RecentDocuments from "@/components/dashboard/recent-documents";
import StatCard from "@/components/dashboard/stat-card";
import AmbientBackground from "@/components/document/ambient-background";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { FileText, Users, Zap } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface OrgDashboardPageProps {
    params: Promise<{ orgSlug: string }>;
}

export default async function OrgDashboardPage({
    params,
}: OrgDashboardPageProps) {
    const { userId } = await auth();
    const { orgSlug } = await params;

    if (!userId) redirect("/sign-in");

    const organization = await prisma.organization.findUnique({
        where: { slug: orgSlug },
        include: {
            _count: {
                select: { documents: true, members: true },
            },
            documents: {
                take: 5,
                orderBy: { createdAt: "desc" }
            }
        }
    });

    if (!organization) redirect("/select-org");

    const membership = await prisma.organizationMember.findFirst({
        where: {
            organizationId: organization.id,
            user: { clerkUserId: userId },
        },
    });

    if (!membership) redirect("/select-org");

    {/* Progress Calculations */ }
    const MAX_DOCS_CAP = 100;
    const MAX_MEMBERS_CAP = 25;

    const docsProgress =
        (organization._count.documents / MAX_DOCS_CAP) * 100;

    const membersProgress =
        (organization._count.members / MAX_MEMBERS_CAP) * 100;

    const analyzedDocs = await prisma.document.count({
        where: {
            organizationId: organization.id,
            aiSummary: { not: null }
        }
    });

    const analysisPercentage = organization._count.documents > 0
        ? Math.round((analyzedDocs / organization._count.documents) * 100)
        : 0;

    if (organization._count.documents === 0) {
        return (
            <EmptyDashboard
                orgName={organization.name}
                orgSlug={orgSlug}
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <AmbientBackground />
            <div className="space-y-8 max-w-7xl mx-auto px-6 py-10">
                {/* Header Section */}
                <DashboardHeader
                    orgName={organization.name}
                    role={membership.role}
                    documentCount={organization._count.documents}
                    orgSlug={orgSlug}
                />

                {/* Stats Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Assets"
                        value={organization._count.documents}
                        icon={<FileText className="text-blue-500" />}
                        description="Stored in vault"
                        gradient="from-blue-400 via-blue-500 to-indigo-400"
                        progress={docsProgress}
                    />
                    <StatCard
                        title="Active Seats"
                        value={organization._count.members}
                        icon={<Users className="text-indigo-500" />}
                        description="Team collaborators"
                        gradient="from-violet-400 via-violet-500 to-purple-400"
                        progress={membersProgress}
                    />

                    {/* Featured AI Card */}
                    <AIProgressCard
                        percentage={analysisPercentage}
                    />
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <RecentDocuments
                        documents={organization.documents}
                        orgSlug={orgSlug}
                    />

                    <div className="space-y-6">
                        <Card className="relative overflow-hidden rounded-3xl border border-amber-50 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                            <CardHeader className="pb-3 flex flex-row items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-2xl bg-amber-100">
                                        <Zap className="w-5 h-5 text-amber-600" />
                                    </div>

                                    <div>
                                        <CardTitle className="text-base font-bold text-slate-900">
                                            AI Insight
                                        </CardTitle>

                                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">
                                            Productivity Boost
                                        </p>
                                    </div>
                                </div>

                                <div className="px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-700">
                                    4x Faster
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-5">
                                <p className="text-sm leading-relaxed text-slate-600 font-medium">
                                    Documents analyzed with{" "}
                                    <span className="font-semibold text-amber-700">
                                        Docinate AI
                                    </span>{" "}
                                    are significantly easier to search, summarize, and organize.
                                </p>

                                {/* Mini Feature Cards */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                        <p className="text-xl font-black text-slate-900">
                                            4x
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Faster Search
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                        <p className="text-xl font-black text-slate-900">
                                            AI
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Smart Indexing
                                        </p>
                                    </div>
                                </div>

                                <InviteTeamModal>
                                    <Button className="w-full h-11 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-semibold transition-all 
                                    duration-200 shadow-sm hover:shadow-md cursor-pointer">
                                        <span className="flex items-center gap-2">
                                            Invite Team Members
                                            <Users className="w-4 h-4" />
                                        </span>
                                    </Button>
                                </InviteTeamModal>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

