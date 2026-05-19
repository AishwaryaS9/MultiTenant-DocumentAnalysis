import { Brain, Upload, Users, Zap } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { EmptyDashboardProps } from "@/types";
import InviteTeamModal from "./invite-team-modal";

export default async function EmptyDashboard({ orgName, orgSlug }: EmptyDashboardProps) {

    return (
        <div>
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
                <div className="max-w-2xl w-full">
                    <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
                        <CardContent className="p-12 text-center">

                            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-50">
                                <Upload className="h-12 w-12 text-amber-500" />
                            </div>

                            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">
                                Welcome to {orgName}
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

                                <InviteTeamModal>
                                    <Button
                                        variant="outline"
                                        className="rounded-2xl px-8 py-6 text-base font-semibold"
                                    >
                                        Invite Team
                                    </Button>
                                    {/* <InviteTeamModal /> */}
                                </InviteTeamModal>
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
        </div>
    );
}