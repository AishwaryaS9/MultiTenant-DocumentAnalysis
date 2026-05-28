import {
    Brain,
    Upload,
    Users,
    Zap,
    Sparkles,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { EmptyDashboardProps } from "@/types";
import InviteTeamModal from "./invite-team-modal";

export default async function EmptyDashboard({
    orgName,
    orgSlug,
}: EmptyDashboardProps) {
    return (
        <div className="min-h-screen overflow-hidden bg-linear-to-br from-slate-50 via-white to-amber-50/40 flex items-center justify-center px-4 py-4">
            <div className="w-full max-w-xl">
                <Card className="relative overflow-hidden rounded-[28px] border border-slate-50 bg-white/95 shadow-sm">
                    <CardContent className="relative p-7 sm:p-8">
                        {/* Header */}
                        <div className="flex flex-col items-center text-center">

                            {/* Badge */}
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-medium text-amber-700 shadow-sm">
                                <Sparkles className="h-3.5 w-3.5" />
                                AI Workspace Ready
                            </div>

                            {/* Icon */}
                            <div className="relative mb-5">
                                <div className="absolute inset-0 rounded-3xl bg-amber-200 blur-2xl opacity-40" />
                                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-100 to-amber-50 border border-amber-100 shadow-lg">
                                    <Upload className="h-8 w-8 text-amber-500" />
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                                Welcome to {orgName}
                            </h1>

                            {/* Subtitle */}
                            <p className="mt-3 max-w-lg text-slate-500 text-sm sm:text-base leading-relaxed">
                                Upload your first document to unlock AI-powered summaries,
                                semantic search, and seamless collaboration.
                            </p>

                            {/* CTA */}
                            <div className="mt-7 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <Link href={`/${orgSlug}/documents`}>
                                    <Button className="group h-11 rounded-2xl px-6 text-sm font-semibold bg-slate-900 hover:bg-black shadow-lg shadow-slate-900/10 transition-all">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload First Document
                                    </Button>
                                </Link>

                                <InviteTeamModal>
                                    <Button
                                        variant="outline"
                                        className="h-11 rounded-2xl px-6 text-sm font-semibold border-slate-300 bg-white/70 hover:bg-slate-50"
                                    >
                                        Invite Team
                                    </Button>
                                </InviteTeamModal>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">

                            <div className="group rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50 p-4 hover:shadow-xs">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                    <Brain className="h-4.5 w-4.5" />
                                </div>

                                <h3 className="font-semibold text-sm text-slate-900">
                                    AI Analysis
                                </h3>

                                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                    Generate instant summaries and insights.
                                </p>
                            </div>

                            <div className="group rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50 p-4 hover:shadow-xs">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                    <Zap className="h-4.5 w-4.5" />
                                </div>

                                <h3 className="font-semibold text-sm text-slate-900">
                                    Fast Search
                                </h3>

                                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                    Find answers across documents instantly.
                                </p>
                            </div>

                            <div className="group rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50 p-4 hover:shadow-xs">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                    <Users className="h-4.5 w-4.5" />
                                </div>

                                <h3 className="font-semibold text-sm text-slate-900">
                                    Collaboration
                                </h3>

                                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                    Work securely with your organization.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}