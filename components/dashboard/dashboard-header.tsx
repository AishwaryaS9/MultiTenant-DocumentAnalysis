import Link from "next/link";
import { DashboardHeaderProps } from "@/types";
import InviteTeamModal from "./invite-team-modal";
import { Button } from "../ui/button";
import { Upload } from "lucide-react";

export default function DashboardHeader({ orgName, role, orgSlug }: DashboardHeaderProps) {
    return (
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 w-full" aria-label="Dashboard header">
            {/* Organization Info */}
            <div className="flex flex-col gap-1 min-w-0" aria-label="Organization information">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600" aria-label={`Your role is ${role}`}>
                        {role}
                    </span>
                </div>

                <div className="flex items-baseline gap-3 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight truncate" aria-label={`Organization name ${orgName}`}>
                        {orgName}
                    </h1>
                </div>

                <p className="text-sm text-slate-500">
                    Here's what's happening in your organization today.
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap" aria-label="Dashboard actions">
                {role === "admin" && (
                    <InviteTeamModal>
                        <Button
                            variant="outline"
                            aria-label="Invite team members"
                            className="rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 border-slate-200 shadow-sm cursor-pointer min-h-10 px-4 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-600"
                        >
                            Invite Team
                        </Button>
                    </InviteTeamModal>
                )}

                <Link
                    href={`/${orgSlug}/documents`}
                    aria-label="Navigate to documents upload page">
                    <Button
                        className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 flex items-center gap-2 font-medium text-sm cursor-pointer min-h-10 shadow-sm focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-900"
                        aria-label="Upload asset to documents">
                        <Upload className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>Upload Asset</span>
                    </Button>
                </Link>
            </div>
        </header>
    );
}