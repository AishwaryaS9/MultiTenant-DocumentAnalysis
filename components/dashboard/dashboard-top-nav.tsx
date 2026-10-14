import { UserButton } from "@clerk/nextjs";
import NotificationBell from "@/components/notifications/notification-bell";

interface DashboardTopNavProps {
    firstName?: string | null;
    lastName?: string | null;
}

/** Desktop top bar shared by the org layout and user-level pages (e.g. notifications). */
export default function DashboardTopNav({ firstName, lastName }: DashboardTopNavProps) {
    return (
        <header
            role="banner"
            aria-label="Dashboard top navigation"
            className="hidden md:block bg-white/60 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-end gap-3">
                <div className="flex flex-col items-end text-right">
                    <span className="text-xs text-slate-400 font-medium" aria-label="Authentication status">
                        Logged in as
                    </span>

                    <span className="text-sm font-bold text-slate-700"
                        aria-label="Current authenticated user name">
                        {firstName} {lastName}
                    </span>
                </div>

                <NotificationBell />

                <div className="p-0.5" aria-label="User account menu">
                    <UserButton />
                </div>
            </div>
        </header>
    );
}
