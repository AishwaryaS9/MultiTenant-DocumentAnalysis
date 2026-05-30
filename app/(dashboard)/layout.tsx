import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import { UserButton } from "@clerk/nextjs";
import { Brain } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <DashboardSidebar />

            {/* Content Area */}
            <main role="main" aria-label="Dashboard content" className="flex-1 overflow-y-auto min-w-0">
                {/* Mobile Top Bar */}
                <header className="md:hidden sticky top-0 z-40 flex items-center justify-between gap-4 p-2 bg-white/95 backdrop-blur-sm border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <div className="bg-amber-500 p-1.5 rounded-lg">
                            <Brain className="text-white w-5 h-5" aria-hidden="true" />
                        </div>
                        <span className="text-sm font-semibold text-slate-900 tracking-tight">
                            Docinate AI
                        </span>
                    </div>

                    <div aria-label="User account menu">
                        <UserButton />
                    </div>
                </header>

                {/* Page Content */}
                <div className="w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}