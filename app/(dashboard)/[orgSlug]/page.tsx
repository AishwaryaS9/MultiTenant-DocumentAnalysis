import AIProgressCard from "@/components/dashboard/ai-progress-card";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import EmptyDashboard from "@/components/dashboard/empty-dashboard";
import RecentDocuments from "@/components/dashboard/recent-documents";
import StatCard from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { FileText, Users, Zap } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface OrgDashboardPageProps {
    params: Promise<{ orgSlug: string }>;
}

// interface OrgDashboardPageProps {
//     params: { orgSlug: string };
// }

export default async function OrgDashboardPage({
    params,
}: OrgDashboardPageProps) {
    const { userId } = await auth();
    const { orgSlug } = await params;
    // const { orgSlug } = params;

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
                    />
                    <StatCard
                        title="Active Seats"
                        value={organization._count.members}
                        icon={<Users className="text-indigo-500" />}
                        description="Team collaborators"
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
                        <Card className="border-none bg-linear-to-br from-amber-50 to-orange-50 shadow-sm border border-amber-100/50 rounded-3xl p-4">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-black text-amber-900 flex items-center gap-2 uppercase tracking-widest">
                                    <div className="p-1.5 bg-amber-200/50 rounded-lg">
                                        <Zap className="w-4 h-4 text-amber-600" />
                                    </div>
                                    Search Documents
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-amber-800 leading-relaxed font-medium">
                                    Instantly search across all organizational documents using AI-powered indexing.
                                    Find insights, contracts, notes, and assets in seconds.
                                </p>
                                <Button
                                    asChild
                                    className="w-full mt-6 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-200/50"
                                >
                                    <Link href={`/${orgSlug}/search`}>
                                        Search Documents
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

