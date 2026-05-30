import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardHeaderProps } from "@/types";
import InviteTeamModal from "./invite-team-modal";

export default function DashboardHeader({ orgName, role, orgSlug }: DashboardHeaderProps) {
    return (
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 pb-2 w-full" aria-label="Dashboard header">
            {/* Organization Info */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0" aria-label="Organization information">
                <div className="h-13 w-13 sm:h-15 sm:w-15 rounded-2xl bg-slate-700 flex items-center justify-center text-white shadow-2xl
                 shadow-slate-200 ring-1 ring-slate-600 shrink-0" aria-hidden="true">
                    <span className="text-2xl sm:text-3xl font-bold">
                        {orgName.charAt(0)}
                    </span>
                </div>

                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <h1 className="text-lg sm:text-xl font-extrabold text-slate-700 tracking-tight truncate" aria-label={`Organization name ${orgName}`}>
                            {orgName}
                        </h1>

                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 shadow-sm shrink-0"
                            role="status"
                            aria-label={`Your role is ${role}`}>
                            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                                {role}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap" aria-label="Dashboard actions">
                {role === "admin" && (
                    <InviteTeamModal>
                        <Button
                            variant="ghost"
                            aria-label="Invite team members"
                            className="rounded-xl font-semibold text-slate-600 cursor-pointer min-h-11 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-600"
                        >
                            Invite Team
                        </Button>
                    </InviteTeamModal>
                )}

                <Link
                    href={`/${orgSlug}/documents`}
                    aria-label="Navigate to documents upload page">
                    <Button
                        className="rounded-xl bg-slate-900 hover:bg-slate-800 px-8 py-6 flex items-center gap-2 font-bold text-md cursor-pointer min-h-11 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-900"
                        aria-label="Upload asset to documents">
                        <Upload className="w-5 h-5 shrink-0" aria-hidden="true" />
                        <span>Upload Asset</span>
                    </Button>
                </Link>
            </div>
        </header>
    );
}