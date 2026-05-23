import { auth, currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface OrgLayoutProps {
    children: React.ReactNode;
    params: Promise<{ orgSlug: string }>;
}

export default async function OrgLayout({ children, params }: OrgLayoutProps) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
        redirect("/sign-in");
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Top Navigation Row - Logged in UI */}
            <header className="hidden md:block bg-white/60 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-end gap-3">
                    <div className="flex flex-col items-end text-right">
                        <span className="text-xs text-slate-400 font-medium">Logged in as</span>
                        <span className="text-sm font-bold text-slate-700">
                            {user.firstName} {user.lastName}
                        </span>
                    </div>
                    <div className="p-0.5 ">
                        <UserButton />
                    </div>
                </div>
            </header>

            {/* Main Content View */}
            <main>
                <div className="container mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}