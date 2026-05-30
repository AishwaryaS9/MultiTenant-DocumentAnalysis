"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrganizationList, useUser } from "@clerk/nextjs";
import { ArrowRight, Building2, Loader2, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SelectOrgPage() {
    const { user } = useUser();
    const router = useRouter();

    const { userMemberships, setActive } = useOrganizationList({
        userMemberships: { infinite: true },
    });

    const [orgName, setOrgName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateOrg = async () => {
        if (!orgName.trim()) {
            toast.error("Please enter organization name");
            return;
        }

        setIsCreating(true);

        try {
            const response = await fetch("/api/organizations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: orgName }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error);

            if (setActive) {
                await setActive({ organization: data.organization.clerkOrgId });
            }

            toast.success("Workspace created");
            setOrgName("");
            router.push(`/${data.organization.slug}`);
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
            setOrgName("");
        } finally {
            setIsCreating(false);
        }
    };

    const handleSelectOrg = async (organization: any) => {
        try {
            if (setActive) {
                await setActive({ organization: organization.id });
            }
            router.push(`/${organization.slug}`);
        } catch {
            toast.error("Failed to switch workspace");
        }
    };

    return (
        <main
            role="main"
            aria-label="Organization selection page"
            className="relative min-h-screen w-full bg-slate-50/50 text-slate-900 overflow-x-hidden flex items-center justify-center py-8 sm:py-12 md:py-20"
        >
            {/* Background Decorative Blobs */}
            <div aria-hidden="true" className="absolute inset-0 max-w-full overflow-hidden pointer-events-none select-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 sm:w-150 sm:h-150 bg-linear-to-br from-orange-200/40 to-amber-200/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-75 h-75 sm:w-112.5 sm:h-112.5 bg-linear-to-tr from-orange-100/40 to-rose-100/30 blur-[100px] rounded-full" />
                <div className="absolute top-1/3 -left-20 w-50 h-50 sm:w-75 sm:h-75 bg-slate-200/40 blur-[80px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">

                    {/* LEFT: CREATE WORKSPACE */}
                    <section aria-label="Create workspace section" className="lg:col-span-5 flex flex-col justify-center space-y-6 sm:space-y-8">
                        <div className="flex">
                            <div tabIndex={0}
                                className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-orange-600
                                shadow-xs transition-all hover:border-orange-200 focus:outline-none focus:ring-1 focus:ring-orange-300 focus:ring-offset-1"
                                role="status"
                                aria-label="AI powered badge"
                            >
                                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                                AI-Powered Spaces
                            </div>
                        </div>

                        <header className="space-y-3 sm:space-y-4">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                                Welcome back,<br />
                                <span className="text-slate-900">{user?.firstName || "User"}</span>
                            </h1>

                            <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-md leading-relaxed">
                                Create a new workspace or continue collaborating with your team using AI-powered document analysis.
                            </p>
                        </header>

                        {/* CREATE CARD */}
                        <section
                            aria-label="Create workspace form"
                            className="rounded-2xl sm:rounded-3xl border border-white bg-white/60 backdrop-blur-xl shadow-xl shadow-slate-100/40 p-5 sm:p-8 transition-all hover:shadow-2xl hover:shadow-slate-200/30"
                        >
                            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-slate-900 flex items-center justify-center shadow-md shadow-slate-900/10 transition-transform hover:scale-105 shrink-0">
                                    <Plus className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-sm sm:text-base text-slate-900">Create Workspace</h2>
                                    <p className="text-[11px] sm:text-xs text-slate-400">Start collaborating instantly</p>
                                </div>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                <label htmlFor="orgName" className="sr-only">
                                    Organization name
                                </label>

                                <Input
                                    id="orgName"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    placeholder="e.g., Acme Corporation"
                                    aria-label="Enter organization name"
                                    className="h-11 sm:h-12 rounded-xl border border-slate-200 bg-white/50 text-sm px-4 shadow-sm focus-visible:ring-1 
                                    focus-visible:ring-orange-500 focus-visible:ring-offset-1 focus-visible:border-orange-500 transition-all w-full"
                                    onKeyDown={(e) => e.key === "Enter" && handleCreateOrg()}
                                />

                                <Button
                                    onClick={handleCreateOrg}
                                    disabled={isCreating}
                                    aria-label="Create workspace"
                                    className="h-11 sm:h-12 w-full rounded-xl bg-slate-900 hover:bg-slate-800 focus-visible:ring-1 focus-visible:ring-slate-800 
                                    focus-visible:ring-offset-1 text-white text-sm font-medium shadow-md shadow-slate-900/10 hover:shadow-lg transition-all duration-200 
                                    cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Creating Workspace...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2 text-amber-400 fill-amber-400" />
                                            Create Workspace
                                        </>
                                    )}
                                </Button>
                            </div>
                        </section>
                    </section>

                    {/* RIGHT: WORKSPACE LIST */}
                    <section aria-label="Workspace list" className="lg:col-span-7 w-full lg:pl-8 mt-4 lg:mt-0">
                        <header className="flex items-end justify-between mb-4 px-1 sm:px-2">
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                                    Your Workspaces
                                </h2>
                                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                                    Pick a workspace destination environment
                                </p>
                            </div>

                            <div
                                role="status"
                                aria-label="workspace count"
                                className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 bg-slate-200/60 rounded-full text-slate-600 backdrop-blur-sm shrink-0 ml-2">
                                {userMemberships?.count || 0} Workspaces
                            </div>
                        </header>

                        <div className="rounded-2xl sm:rounded-3xl border border-slate-100 bg-white/40 backdrop-blur-xl p-2 sm:p-3 shadow-lg shadow-slate-100/30">
                            <div className="thin-scrollbar max-h-87.5 sm:max-h-120 overflow-y-auto pr-1 space-y-2.5 sm:space-y-3">
                                {userMemberships?.count === 0 ? (
                                    <div
                                        role="status"
                                        aria-label="no workspaces available"
                                        className="rounded-xl sm:rounded-2xl border border-dashed border-slate-200 bg-white/40 p-8 sm:p-12 text-center"
                                    >
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-slate-100 mx-auto flex items-center justify-center mb-3 sm:mb-4 text-slate-400 shadow-inner">
                                            <Building2 className="w-6 h-6 sm:w-7" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
                                            No Active Hubs
                                        </h3>
                                        <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                                            It looks lonely here. Use the builder utility on the left side to get operational.
                                        </p>
                                    </div>
                                ) : (
                                    userMemberships?.data?.map((membership) => (
                                        <button
                                            key={membership.organization.id}
                                            onClick={() => handleSelectOrg(membership.organization)}
                                            aria-label={`Open workspace ${membership.organization.name}`}
                                            className="group relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-md 
                                            p-3 sm:p-4 text-left transition-all duration-300 hover:shadow-md hover:shadow-slate-100 hover:border-slate-300 
                                            hover:-translate-y-0.5 flex items-center justify-between cursor-pointer focus:outline-none focus:ring-1 focus:ring-slate-100 
                                            focus:ring-offset-1 gap-2 sm:gap-4"
                                        >
                                            <div className="absolute inset-0 bg-linear-to-r from-orange-500/0 via-orange-500/2 to-orange-500/0 opacity-0 group-hover:opacity-100
                                            transition-opacity duration-500" />

                                            <div className="relative flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                                <div className="relative shrink-0">
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-linear-to-br from-slate-800 to-slate-950 flex items-center justify-center shadow-md transition-transform group-hover:scale-[1.03]">
                                                        <span className="text-sm sm:text-lg text-white font-semibold tracking-wide uppercase">
                                                            {membership.organization.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                                                        {membership.organization.name}
                                                    </h3>
                                                    <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 flex-wrap">
                                                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[9px] sm:text-[10px] font-bold text-slate-600 uppercase tracking-wider border border-slate-200/50 shrink-0">
                                                            {membership.role.replace("org:", "")}
                                                        </span>
                                                        <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 truncate max-w-20 sm:max-w-none">
                                                            {membership.organization.id.slice(0, 12)}...
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-all duration-300 group-hover:bg-slate-900 group-hover:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:ring-offset-1">
                                                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5" />
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}