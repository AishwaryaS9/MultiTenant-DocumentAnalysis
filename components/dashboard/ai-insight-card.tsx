import { Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InviteTeamModal from "./invite-team-modal";
import { AIInsightCardProps } from "@/types";

export default function AIInsightCard({ role }: AIInsightCardProps) {
    return (
        <div className="space-y-6">
            <Card
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-insight px-2 py-6 text-insight-foreground shadow-xs hover:shadow-sm hover:border-primary/30 transition-all duration-300"
                role="region"
                aria-label="AI productivity insights"
            >
                <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className="p-2.5 rounded-2xl bg-primary shadow-lg shadow-primary/20 shrink-0"
                            aria-hidden="true"
                        >
                            <Zap className="w-5 h-5 fill-white text-white" />
                        </div>

                        <div className="min-w-0">
                            <CardTitle className="text-base font-bold text-insight-foreground">
                                AI Insight
                            </CardTitle>

                            <p className="text-xs text-white/50 mt-1 uppercase tracking-wider font-medium">
                                Productivity Boost
                            </p>
                        </div>
                    </div>

                    <div
                        className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-lightOrange whitespace-nowrap"
                        role="status"
                        aria-label="Four times faster productivity"
                    >
                        4x Faster
                    </div>
                </CardHeader>

                <CardContent className="space-y-5">
                    <p className="text-sm leading-relaxed text-white/70 font-medium">
                        Documents analyzed with{" "}
                        <span className="font-semibold text-lightOrange">
                            Docinate AI
                        </span>{" "}
                        are significantly easier to search, summarize, and organize.
                    </p>

                    <div className="grid grid-cols-2 gap-2" aria-label="AI productivity metrics">
                        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3.5">
                            <p className="text-base font-black leading-tight text-insight-foreground">
                                4x
                            </p>
                            <p className="text-[11px] leading-tight text-white/50 mt-0.5">
                                Faster Search
                            </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                            <p className="text-base font-black leading-tight text-lightOrange">
                                AI
                            </p>
                            <p className="text-[11px] leading-tight text-white/50 mt-0.5">
                                Smart Indexing
                            </p>
                        </div>
                    </div>

                    {role === "admin" && (
                        <InviteTeamModal>
                            <Button
                                className="w-full h-11 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200
                                shadow-xs hover:shadow-sm cursor-pointer focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-primary focus-visible:ring-offset-insight"
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