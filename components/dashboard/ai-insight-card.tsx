import { Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InviteTeamModal from "./invite-team-modal";
import { AIInsightCardProps } from "@/types";

export default function AIInsightCard({ role }: AIInsightCardProps) {
    return (
        <div className="space-y-6">
            <Card className="relative overflow-hidden rounded-3xl border border-gray-50 bg-white shadow-xs hover:shadow-sm transition-all duration-300"
                role="region"
                aria-label="AI productivity insights">
                <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 rounded-2xl bg-amber-100 shrink-0" aria-hidden="true">
                            <Zap className="w-5 h-5 text-amber-600" />
                        </div>

                        <div className="min-w-0">
                            <CardTitle className="text-base font-bold text-slate-900">
                                AI Insight
                            </CardTitle>

                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">
                                Productivity Boost
                            </p>
                        </div>
                    </div>

                    <div className="px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-700 whitespace-nowrap"
                        role="status"
                        aria-label="Four times faster productivity">
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

                    <div className="grid grid-cols-2 gap-3" aria-label="AI productivity metrics">
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

                    {role === "admin" && (
                        <InviteTeamModal>
                            <Button
                                className="w-full h-11 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-semibold transition-all duration-200 
                                shadow-xs hover:shadow-sm cursor-pointer focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-amber-500"
                                aria-label="Invite team members to organization"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Invite Team Members
                                    <Users className="w-4 h-4" aria-hidden="true" />
                                </span>
                            </Button>
                        </InviteTeamModal>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}