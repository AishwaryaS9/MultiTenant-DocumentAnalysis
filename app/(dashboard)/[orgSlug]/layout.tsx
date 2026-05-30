import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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
                            {user.firstName} {user.lastName}
                        </span>
                    </div>

                    <div className="p-0.5" aria-label="User account menu">
                        <UserButton />
                    </div>
                </div>
            </header>

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