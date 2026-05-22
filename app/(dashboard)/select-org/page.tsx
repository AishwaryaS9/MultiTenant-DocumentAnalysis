"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import {
    ArrowRight,
    Building2,
    Loader2,
    Plus,
    Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SelectOrgPage() {
    const { user } = useUser();
    const router = useRouter();
    const { organization } = useOrganization();

    const { userMemberships, setActive, createOrganization } =
        useOrganizationList({
            userMemberships: {
                infinite: true,
            },
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
            const response = await fetch(
                "/api/organizations",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: orgName,
                        // slug: organization?.slug
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            if (setActive) {
                await setActive({
                    organization: data.organization.clerkOrgId,
                });
            }

            toast.success("Workspace created");
            setOrgName("");
            router.push(
                `/${data.organization.slug}`
            );

        } catch (error: any) {
            toast.error(
                error.message ||
                "Something went wrong"
            );
            setOrgName("");
        } finally {
            setIsCreating(false);
        }
    };



    const handleSelectOrg = async (organization: any) => {
        try {
            if (setActive) {
                await setActive({
                    organization: organization.id,
                });
            }
            router.push(`/${organization.slug}`);
        } catch (error) {
            toast.error("Failed to switch workspace");
        }
    };

    return (
        <main className="relative min-h-screen w-full bg-slate-50/50 text-slate-900 overflow-x-hidden flex items-center justify-center py-12 md:py-20">
            {/* Ambient Aurora Background Gradients */}
            <div className="absolute inset-0 max-w-full overflow-hidden pointer-events-none select-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-linear-to-br from-orange-200/40 to-amber-200/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-112.5 h-112.5 bg-linear-to-tr from-orange-100/40 to-rose-100/30 blur-[100px] rounded-full" />
                <div className="absolute top-1/3 -left-20 w-75 h-75 bg-slate-200/40 blur-[80px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[80vh]">

                    {/* LEFT SIDE: Heading & Creation Card */}
                    <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
                        {/* Elegant Feature Badge */}
                        <div className="flex">
                            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 backdrop-blur-md px-3.5 py-1.5 shadow-xs transition-all hover:border-orange-200">
                                <Sparkles className="h-3.5 w-3.5 text-orange-500 animate-pulse" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                                    AI-Powered Spaces
                                </span>
                            </div>
                        </div>

                        {/* Title and Subtitle */}
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                                Welcome back,<br />
                                <span className="text-slate-900">
                                    {user?.firstName || "User"}
                                </span>
                            </h1>
                            <p className="text-base sm:text-lg text-slate-500 max-w-md leading-relaxed">
                                Create a new workspace or continue collaborating with your team using AI-powered document analysis.
                            </p>
                        </div>

                        {/* Create Workspace Glassmorphic Card */}
                        <div className="rounded-3xl border border-white bg-white/60 backdrop-blur-xl shadow-xl shadow-slate-100/40 p-6 sm:p-8 transition-all hover:shadow-2xl hover:shadow-slate-200/30">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md shadow-slate-900/10 transition-transform hover:scale-105">
                                    <Plus className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-slate-900">Create Workspace</h3>
                                    <p className="text-xs text-slate-400">Start collaborating instantly</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    placeholder="e.g., Acme Corporation"
                                    className="h-12 rounded-xl border border-slate-200 bg-white/50 text-sm px-4 shadow-2xs focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:border-orange-500 transition-all"
                                    onKeyDown={(e) => e.key === "Enter" && handleCreateOrg()}
                                />

                                <Button
                                    onClick={handleCreateOrg}
                                    disabled={isCreating}
                                    className="h-12 w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium shadow-md shadow-slate-900/10 hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                                >
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
                        </div>
                    </div>

                    {/* RIGHT SIDE: Workspace List */}
                    <div className="lg:col-span-7 w-full lg:pl-8">
                        <div className="flex items-end justify-between mb-4 px-2">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Your Workspaces</h2>
                                <p className="text-xs text-slate-400 mt-0.5">Pick an workspace destination environment</p>
                            </div>
                            <div className="text-xs font-semibold px-2.5 py-1 bg-slate-200/60 rounded-full text-slate-600 backdrop-blur-xs">
                                {userMemberships?.count || 0} Workspaces
                            </div>
                        </div>

                        {/* Outer Container Wrapper */}
                        <div className="rounded-3xl border border-slate-100 bg-white/40 backdrop-blur-xl p-3 shadow-lg shadow-slate-100/30">
                            <div className="thin-scrollbar max-h-120 overflow-y-auto pr-1.5 space-y-3">
                                {userMemberships?.count === 0 ? (
                                    /* Empty State Card */
                                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white/40 p-12 text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center mb-4 text-slate-400 shadow-inner">
                                            <Building2 className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-1">No Active Hubs</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                                            It looks lonely here. Use the builder utility on the left side to get operational.
                                        </p>
                                    </div>
                                ) : (
                                    /* Interactive Buttons List */
                                    userMemberships?.data?.map((membership) => (
                                        <button
                                            key={membership.organization.id}
                                            onClick={() => handleSelectOrg(membership.organization)}
                                            className="group relative w-full overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-md p-4 text-left transition-all duration-300 hover:shadow-md hover:shadow-slate-100 hover:border-slate-300 hover:-translate-y-0.5 flex items-center justify-between cursor-pointer"
                                        >
                                            {/* Hover Glow Effect Layer */}
                                            <div className="absolute inset-0 bg-linear-to-r from-orange-500/0 via-orange-500/2 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            <div className="relative flex items-center gap-4 min-w-0">
                                                {/* Clean Minimal Initials Avatar */}
                                                <div className="relative shrink-0">
                                                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-slate-800 to-slate-950 flex items-center justify-center shadow-md transition-transform group-hover:scale-[1.03]">
                                                        <span className="text-lg text-white font-semibold tracking-wide uppercase">
                                                            {membership.organization.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    {/* Active Indicator dot */}
                                                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                                                </div>

                                                {/* Text Elements */}
                                                <div className="min-w-0">
                                                    <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                                                        {membership.organization.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wider border border-slate-200/50">
                                                            {membership.role.replace("org:", "")}
                                                        </span>
                                                        <span className="text-[11px] font-mono text-slate-400 truncate max-w-30 sm:max-w-none">
                                                            {membership.organization.id.slice(0, 12)}...
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Arrow Micro-interaction Box */}
                                            <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-all duration-300 group-hover:bg-slate-900 group-hover:border-slate-900 ml-4">
                                                <ArrowRight className="w-4 h-4 text-slate-400 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5" />
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main >
    );
}