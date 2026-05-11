import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import { UserButton } from "@clerk/nextjs";
import { Brain } from "lucide-react";

export default function DashboardLayout({ children, }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <DashboardSidebar />
            {/* Content Area */}
            <main className="flex-1 overflow-y-auto">
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
                    <Brain className="text-amber-500 w-6 h-6" />
                    <UserButton />
                </div>
                <div>
                    {children}
                </div>
            </main>
        </div>
    );
}