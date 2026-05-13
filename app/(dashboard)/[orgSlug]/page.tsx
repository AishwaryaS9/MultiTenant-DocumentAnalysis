import StatCard from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, Brain, FileText, Upload, Users, Clock, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="max-w-2xl w-full">
                    <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
                        <CardContent className="p-12 text-center">

                            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-50">
                                <Upload className="h-12 w-12 text-amber-500" />
                            </div>

                            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">
                                Welcome to {organization.name}
                            </h1>

                            <p className="text-slate-500 text-lg leading-relaxed max-w-xl mx-auto mb-10">
                                Your workspace is ready. Upload your first document to unlock AI-powered summaries,
                                semantic search, and team collaboration.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href={`/${orgSlug}/documents`}>
                                    <Button className="rounded-2xl px-8 py-6 text-base font-bold bg-slate-900 hover:bg-black flex gap-2">
                                        <Upload className="w-5 h-5" />
                                        Upload First Document
                                    </Button>
                                </Link>

                                <Button
                                    variant="outline"
                                    className="rounded-2xl px-8 py-6 text-base font-semibold"
                                >
                                    Invite Team
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14">

                                <div className="rounded-2xl border bg-slate-50 p-5">
                                    <Brain className="w-6 h-6 text-amber-500 mx-auto mb-3" />
                                    <p className="font-semibold text-slate-900">
                                        AI Analysis
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Generate instant summaries and insights
                                    </p>
                                </div>

                                <div className="rounded-2xl border bg-slate-50 p-5">
                                    <Zap className="w-6 h-6 text-amber-500 mx-auto mb-3" />
                                    <p className="font-semibold text-slate-900">
                                        Fast Search
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Find answers across all documents instantly
                                    </p>
                                </div>

                                <div className="rounded-2xl border bg-slate-50 p-5">
                                    <Users className="w-6 h-6 text-amber-500 mx-auto mb-3" />
                                    <p className="font-semibold text-slate-900">
                                        Collaboration
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Work together with your organization
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="space-y-8 max-w-7xl mx-auto px-6 py-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                    <div className="flex items-center gap-6">
                        <div className="h-15 w-15 rounded-2xl bg-slate-700 flex items-center justify-center text-white shadow-2xl shadow-slate-200 ring-1 ring-slate-600">
                            <span className="text-3xl font-bold">{organization.name.charAt(0)}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-extrabold text-slate-700 tracking-tight">
                                    {organization.name}
                                </h1>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 shadow-sm">
                                    {/* <Zap className="w-3 h-3 fill-amber-500" /> */}
                                    <span className="text-[11px] font-bold uppercase tracking-wider">{membership.role}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                                <p className="text-slate-500 text-sm flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    System Active
                                </p>
                                <span className="text-slate-300">•</span>
                                <p className="text-slate-500 text-sm flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                                    {organization._count.documents} assets secured
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" className="rounded-xl font-semibold text-slate-600 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                            Invite Team
                        </Button>
                        <Link href={`/${orgSlug}/documents`}>
                            <Button className="rounded-xl bg-slate-900 hover:bg-black px-8 py-6 shadow-xl shadow-slate-200 transition-all active:scale-95 flex gap-2 font-bold text-md cursor-pointer">
                                <Upload className="w-5 h-5" />
                                Upload Asset
                            </Button>
                        </Link>
                    </div>
                </div>

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
                    <Card className="md:col-span-2 border-none bg-[#0F172A] text-white shadow-2xl relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute -right-5 -bottom-5 opacity-10 rotate-12">
                            <Brain className="w-48 h-48" />
                        </div>
                        <CardContent className="pt-6 relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Neural Processing</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black tracking-tighter">{analysisPercentage}%</span>
                                        <span className="text-slate-400 font-medium">Indexed</span>
                                    </div>
                                </div>
                                <div className="p-2 bg-slate-800/50 rounded-lg">
                                    <Brain className="w-6 h-6 text-amber-400" />
                                </div>
                            </div>

                            <div className="w-full bg-slate-800/50 rounded-full h-3.5 p-1 mb-4">
                                <div
                                    className="bg-linear-to-r from-amber-400 via-orange-500 to-amber-400 bg-size-[200%_auto] animate-gradient-x h-full rounded-full transition-all duration-1000"
                                    style={{ width: `${analysisPercentage}%` }}
                                />
                            </div>
                            <p className="text-slate-400 text-xs flex items-center gap-2 italic">
                                AI Engine is optimized and ready for queries
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 border-slate-200/60 shadow-xl shadow-slate-100/50 rounded-3xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-white/50 px-8 py-6">
                            <div>
                                <CardTitle className="text-xl font-bold text-slate-900">Recent Documents</CardTitle>
                                <p className="text-sm text-slate-500 mt-0.5">Knowledge base activity</p>
                            </div>
                            <Link href={`/${orgSlug}/documents`}>
                                <Button variant="outline" size="sm" className="rounded-xl border-slate-200 hover:bg-slate-50">
                                    View All
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent className="p-4">
                            {organization.documents.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 ring-1 ring-slate-100">
                                        <FileText className="h-10 w-10 text-slate-300" />
                                    </div>
                                    <p className="text-slate-900 font-bold text-lg">Empty Vault</p>
                                    <p className="text-slate-500 text-sm max-w-60 mt-2">
                                        Start your engine by uploading your first document.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {organization.documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-100"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <FileText className="h-6 w-6 text-slate-400 group-hover:text-amber-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors">{doc.name}</p>
                                                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(doc.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {doc.aiSummary ? (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-50 text-green-700 text-[10px] font-black border border-green-100 uppercase tracking-tighter">
                                                        <Brain className="h-3 w-3" />
                                                        Analyzed
                                                    </div>
                                                ) : (
                                                    <Button variant="secondary" size="sm" className="rounded-lg h-8 text-xs font-bold">
                                                        Process
                                                    </Button>
                                                )}
                                                <div className="h-8 w-8 rounded-full flex items-center justify-center bg-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="border-none bg-linear-to-br from-amber-50 to-orange-50 shadow-sm border border-amber-100/50 rounded-3xl p-2">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-black text-amber-900 flex items-center gap-2 uppercase tracking-widest">
                                    <div className="p-1.5 bg-amber-200/50 rounded-lg">
                                        <Zap className="w-4 h-4 text-amber-600" />
                                    </div>
                                    Insight
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-amber-800 leading-relaxed font-medium">
                                    Documents analyzed with Docinate AI are 4x faster to search through.
                                    Maximize your team's efficiency by indexing all assets.
                                </p>
                                <Button className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-lg shadow-amber-200/50">
                                    Invite Team Members
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
