import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardTopNav from "@/components/dashboard/dashboard-top-nav";

interface OrgLayoutProps {
    children: React.ReactNode;
    params: Promise<{ orgSlug: string }>;
}

export default async function OrgLayout({ children }: OrgLayoutProps) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect("/sign-in");
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Desktop Top Navigation */}
            <DashboardTopNav firstName={user.firstName} lastName={user.lastName} />

            {/* Main Content */}
            <main role="main"
                aria-label="Dashboard main content"
                className="w-full">
                <div className="container mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
