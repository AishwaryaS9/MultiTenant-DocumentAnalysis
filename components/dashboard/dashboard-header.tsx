import { ShieldCheck, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardHeaderProps } from "@/types";
import InviteTeamModal from "./invite-team-modal";

export default function DashboardHeader({
    orgName,
    role,
    documentCount,
    orgSlug,
}: DashboardHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div className="flex items-center gap-6">
                <div className="h-15 w-15 rounded-2xl bg-slate-700 flex items-center justify-center text-white shadow-2xl shadow-slate-200 ring-1 ring-slate-600">
                    <span className="text-3xl font-bold">
                        {orgName.charAt(0)}
                    </span>
                </div>

                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-extrabold text-slate-700 tracking-tight">
                            {orgName}
                        </h1>

                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 shadow-sm">
                            <span className="text-[11px] font-bold uppercase tracking-wider">
                                {role}
                            </span>
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
                            {documentCount} assets secured
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* <Button
                    variant="ghost"
                    className="rounded-xl font-semibold text-slate-600"
                >
                    Invite Team
                </Button> */}
                {/* <InviteTeamModal /> */}
                <InviteTeamModal>
                    <Button
                        variant="ghost"
                        className="rounded-xl font-semibold text-slate-600"
                    >
                        {/* <UserPlus className="w-4 h-4 mr-2" /> */}
                        Invite Team
                    </Button>
                </InviteTeamModal>

                <Link href={`/${orgSlug}/documents`}>
                    <Button className="rounded-xl bg-slate-900 hover:bg-black px-8 py-6 flex gap-2 font-bold text-md">
                        <Upload className="w-5 h-5" />
                        Upload Asset
                    </Button>
                </Link>
            </div>
        </div>
    );
}