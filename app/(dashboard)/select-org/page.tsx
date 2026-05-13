"use client"
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

    const { userMemberships, setActive, createOrganization } = useOrganizationList({
        userMemberships: {
            infinite: true
        }
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
            if (!createOrganization) {
                throw new Error("Organization creation unavailable");
            }
            const newOrg = await createOrganization({
                name: orgName.trim()
            });

            // SAVE TO PRISMA
            await fetch("/api/organizations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    clerkOrgId: newOrg.id,
                    name: newOrg.name,
                    slug: newOrg.slug,
                }),
            });

            if (setActive) {
                await setActive({
                    organization: newOrg.id,
                });
            }
            toast.success("Workspace created");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setIsCreating(false);
        }
    };

    const handleSelectOrg = async (organization: any) => {
        try {
            if (setActive) {
                await setActive({
                    organization: organization.id
                });
            }
            console.log('selcted-Org', JSON.stringify(organization.slug))
            router.push(`/${organization.slug}`);
        } catch (error) {
            toast.error("Failed to switch workspace");
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#FAFAF8]">
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none ">
                <div className="absolute -top-50 left-1/2 -translate-x-1/2 w-225 h-225 bg-orange-200/20 blur-3xl rounded-full" />
                <div className="absolute -bottom-75 -right-25 w-125 h-125 bg-orange-100/30 blur-3xl rounded-full" />
                <div className="absolute top-[20%] -left-25 w-75 h-75 bg-black/2 blur-3xl rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 min-h-screen">
                    {/* LEFT SIDE */}
                    <div className="flex flex-col justify-center py-20 pr-0 lg:pr-16">
                        {/* Badge */}
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 backdrop-blur px-4 py-2 shadow-sm">
                                <Sparkles className="h-4 w-4 text-orange-500 fill-orange-400" />
                                <span className="text-sm font-medium text-gray-700">
                                    AI Workspace
                                </span>
                            </div>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl md:text-5xl font-semibold tracking-loose leading-none text-[#111111]">
                            Welcome back,
                            <br />
                            {user?.firstName}
                        </h1>

                        <p className="mt-8 text-lg text-gray-500 leading-relaxed max-w-xl">
                            Create a new workspace or continue collaborating
                            with your team using AI-powered document analysis.
                        </p>

                        {/* Create Workspace */}
                        <div className="mt-14">
                            <div className="rounded-[32px] border border-black/5 bg-white/70 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.06)] p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-[#111111] flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-[#111111]">
                                            Create Workspace
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Start collaborating instantly
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Input
                                        value={orgName}
                                        onChange={(e) => setOrgName(e.target.value)}
                                        placeholder="Acme Inc."
                                        className="h-14 rounded-2xl border-0 bg-[#F5F5F3] text-base px-5 shadow-none focus-visible:ring-2 focus-visible:ring-orange-400"
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && handleCreateOrg()
                                        }
                                    />

                                    <Button
                                        onClick={handleCreateOrg}
                                        disabled={isCreating}
                                        className="h-14 w-full rounded-2xl bg-[#111111] hover:bg-black text-white text-base font-medium shadow-lg"
                                    >
                                        {isCreating ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Creating Workspace...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4 mr-2 text-yellow-400 fill-yellow-400" />
                                                Create Workspace
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center py-20">
                        <div className="w-full">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-semibold text-[#111111]">
                                        Your Workspaces
                                    </h2>

                                    <p className="text-gray-500 mt-1">
                                        Select a workspace to continue
                                    </p>
                                </div>

                                <div className="text-sm text-gray-400">
                                    {userMemberships?.count || 0} Workspaces
                                </div>
                            </div>

                            {/* Workspace List */}
                            <div className="space-y-4">

                                {userMemberships?.count === 0 ? (

                                    <div className="rounded-[32px] border border-dashed border-black/10 bg-white/50 backdrop-blur-xl p-14 text-center">

                                        <div className="w-20 h-20 rounded-3xl bg-[#111111] mx-auto flex items-center justify-center mb-6">
                                            <Building2 className="w-9 h-9 text-white" />
                                        </div>

                                        <h3 className="text-2xl font-semibold text-[#111111] mb-3">
                                            No Workspaces Yet
                                        </h3>

                                        <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
                                            Create your first organization and start
                                            analyzing documents with your team.
                                        </p>
                                    </div>

                                ) : (

                                    userMemberships?.data?.map((membership) => (
                                        <button
                                            key={membership.organization.id}
                                            onClick={() =>
                                                handleSelectOrg(
                                                    membership.organization
                                                )
                                            }
                                            className="group relative w-full overflow-hidden rounded-[32px] border border-black/5 bg-white/70 backdrop-blur-xl p-6 text-left hover:shadow-xs"
                                        >
                                            <div className="relative flex items-center justify-between">

                                                <div className="flex items-center gap-5">

                                                    {/* Logo */}
                                                    <div className="relative">

                                                        <div className="w-16 h-16 rounded-3xl bg-slate-700 flex items-center justify-center shadow-sm">
                                                            {/* <Building2 className="w-7 h-7 text-white" /> */}
                                                            <span className="text-3xl text-white font-bold">{membership.organization.name.charAt(0)}</span>
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-4 border-white" />
                                                    </div>

                                                    {/* Content */}
                                                    <div>

                                                        <h3 className="text-xl font-semibold text-[#111111]">
                                                            {membership.organization.name}
                                                        </h3>

                                                        <div className="flex items-center gap-3 mt-2">

                                                            <span className="px-3 py-1 rounded-full bg-[#F3F3F1] text-xs font-medium text-gray-600 capitalize">
                                                                {membership.role}
                                                            </span>

                                                            <span className="text-sm text-gray-400">
                                                                {membership.organization.id.slice(0, 10)}...
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Arrow */}
                                                <div className="w-12 h-12 rounded-full bg-[#F5F5F3] flex items-center justify-center transition-all duration-300 group-hover:bg-slate-800">
                                                    <ArrowRight className="w-5 h-5 text-gray-500 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5" />
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}