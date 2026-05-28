import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardHeaderProps } from "@/types";
import InviteTeamModal from "./invite-team-modal";

export default function DashboardHeader({
    orgName,
    role,
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

                </div>
            </div>

            <div className="flex items-center gap-3">
                {role === "admin" && (
                    <InviteTeamModal>
                        <Button
                            variant="ghost"
                            className="rounded-xl font-semibold text-slate-600 cursor-pointer">
                            Invite Team
                        </Button>
                    </InviteTeamModal>
                )}


                <Link href={`/${orgSlug}/documents`}>
                    <Button className="rounded-xl bg-slate-900 hover:bg-slate-800 px-8 py-6 flex gap-2 font-bold text-md cursor-pointer">
                        <Upload className="w-5 h-5" />
                        Upload Asset
                    </Button>
                </Link>
            </div>
        </div>
    );
}