import { Brain, Upload, Users, Zap, Sparkles } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { EmptyDashboardProps } from "@/types";
import InviteTeamModal from "./invite-team-modal";

export default async function EmptyDashboard({ orgName, orgSlug, role }: EmptyDashboardProps) {
    return (
        <main
            className="min-h-screen overflow-hidden bg-linear-to-br from-slate-50 via-white to-amber-50/40 flex items-center justify-center px-4 py-6 sm:py-8"
            role="main"
            aria-label="Empty dashboard onboarding">
            <div className="w-full max-w-xl">
                <Card className="relative overflow-hidden rounded-[28px] border border-slate-50 bg-white/95 shadow-sm"
                    role="region"
                    aria-label="Workspace onboarding card">
                    <CardContent className="relative p-6 sm:p-8">
                        {/* Header */}
                        <div className="flex flex-col items-center text-center">
                            {/* Badge */}
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-orange-50 border-orange-100 text-orange-600  px-3.5 py-1 text-xs font-medium shadow-sm"
                                role="status"
                                aria-label="AI workspace ready">
                                <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                AI Workspace Ready
                            </div>

                            {/* Icon */}
                            <div className="relative mb-5" aria-hidden="true">
                                <div className="absolute inset-0 rounded-3xl bg-amber-200 blur-2xl opacity-40" />

                                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-amber-100 to-amber-50 border border-amber-100 shadow-lg">
                                    <Upload className="h-8 w-8 text-amber-500" />
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 wrap-break-word">
                                Welcome to {orgName}
                            </h1>

                            {/* Subtitle */}
                            <p className="mt-3 max-w-lg text-slate-500 text-sm sm:text-base leading-relaxed">
                                Upload your first document to unlock AI-powered summaries, semantic search, and seamless collaboration.
                            </p>

                            {/* CTA */}
                            <div className="mt-7 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <Link href={`/${orgSlug}/documents`} aria-label="Upload your first document">
                                    <Button className="group w-full sm:w-auto h-11 rounded-2xl px-6 text-sm font-semibold bg-slate-900 hover:bg-black shadow-lg 
                                    shadow-slate-900/10 transition-all cursor-pointer focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-900">
                                        <Upload className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
                                        Upload First Document
                                    </Button>
                                </Link>

                                {role === "admin" && (
                                    <InviteTeamModal>
                                        <Button
                                            variant="outline"
                                            className="w-full sm:w-auto h-11 rounded-2xl px-6 text-sm font-semibold border-slate-300 bg-white/70 hover:bg-slate-50
                                             focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-400"
                                            aria-label="Invite team members">
                                            Invite Team
                                        </Button>
                                    </InviteTeamModal>
                                )}
                            </div>
                        </div>

                        {/* Features */}
                        <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3" aria-label="Platform features">
                            <div className="group rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50 p-4 hover:shadow-xs">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600"
                                    aria-hidden="true">
                                    <Brain className="h-4.5 w-4.5" />
                                </div>

                                <h2 className="font-semibold text-sm text-slate-900">
                                    AI Analysis
                                </h2>

                                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                    Generate instant summaries and insights.
                                </p>
                            </div>

                            <div className="group rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50 p-4 hover:shadow-xs">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600" aria-hidden="true">
                                    <Zap className="h-4.5 w-4.5" />
                                </div>

                                <h2 className="font-semibold text-sm text-slate-900">
                                    Fast Search
                                </h2>

                                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                    Find answers across documents instantly.
                                </p>
                            </div>

                            <div className="group rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50 p-4 hover:shadow-xs">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600" aria-hidden="true">
                                    <Users className="h-4.5 w-4.5" />
                                </div>

                                <h2 className="font-semibold text-sm text-slate-900">
                                    Collaboration
                                </h2>

                                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                    Work securely with your organization.
                                </p>
                            </div>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}