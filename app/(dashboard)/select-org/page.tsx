"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";
import { Organization } from "@/types";
import {
    ArrowRight,
    Building2,
    Loader2,
    Plus,
    Sparkles,
    Users2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAppSelector } from "@/app/store/hooks";
import DashboardTopNav from "@/components/dashboard/dashboard-top-nav";

export default function SelectOrgPage() {
    const user = useAppSelector((state) => state.user);
    const router = useRouter();

    const { organization: activeOrg } = useOrganization();

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
                await setActive({
                    organization: data.organization.clerkOrgId,
                });
            }

            router.refresh();
            toast.success("Workspace created");
            setOrgName("");
            router.push(`/ ${data.organization.slug} `);
        } catch (error: unknown) {
            const msg =
                error instanceof Error ? error.message : String(error);

            toast.error(msg || "Something went wrong");
            setOrgName("");
        } finally {
            setIsCreating(false);
        }
    };

    const handleSelectOrg = async (organization: Organization) => {
        try {
            if (setActive) {
                await setActive({ organization: organization.id });
            }

            if (!organization.slug) {
                toast.error("Organization slug missing");
                return;
            }

            router.push(`/${organization.slug}`);
        } catch {
            toast.error("Failed to switch workspace");
        }
    };

    const sortedMemberships = [...(userMemberships?.data ?? [])].sort((a, b) =>
        a.organization.id === activeOrg?.id ? -1 : b.organization.id === activeOrg?.id ? 1 : 0
    );

    return (
        <main
            role="main"
            aria-label="Organization selection page"
            className="relative min-h-screen overflow-hidden bg-slate-50/50 text-foreground">

            {/* Navigation */}

            <DashboardTopNav firstName={user.firstName} lastName={user.lastName} />

            <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
                <div className="grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr] xl:gap-24">

                    {/* LEFT: OPEN, BORDERLESS CREATE SECTION */}
                    <section
                        aria-label="Create workspace section"
                        className="min-w-0 lg:sticky lg:top-12"
                    >
                        <div className="mb-7 inline-flex items-center gap-2.5 py-2">
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                            <span className="text-xs font-bold uppercase tracking-wider text-primary" aria-label='subtitle'>
                                A fresh space for new ideas
                            </span>
                        </div>

                        <header>
                            <h1 className="text-3xl sm:text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 ">
                                Good things
                                <br />
                                happen when
                                <br />
                                <span className="font-serif font-normal italic text-primary">
                                    we work
                                </span>{" "}
                                together.
                            </h1>

                            <p className="mt-6 max-w-107.5 text-[14px] leading-7 text-muted-foreground sm:text-[15px]">
                                Welcome back,{" "}
                                <span className="font-semibold text-foreground">
                                    {user?.firstName || "User"}
                                </span>
                                . Pick a workspace to jump back in, or create a new home for your team's next big idea.
                            </p>
                        </header>

                        {/* Borderless create workspace area */}
                        <div className="mt-10 max-w-115 sm:mt-12">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lightPeach/50">
                                    <Plus className="h-4.25 w-4.25 text-primary" />
                                </div>

                                <div>
                                    <h2 className="text-[15px] font-semibold tracking-[-0.3px] text-lightOrange-foreground">
                                        Create a workspace
                                    </h2>
                                    <p className="mt-1 text-[11px] text-slate-500">
                                        It only takes a moment to get started.
                                    </p>
                                </div>
                            </div>

                            <label
                                htmlFor="orgName"
                                className="mb-2.5 block text-[11px] font-semibold text-slate-800"
                            >
                                What would you like to call it?
                            </label>

                            <Input
                                id="orgName"
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                                placeholder="e.g., Acme Studio"
                                aria-label="Enter organization name"
                                className="h-12.75 rounded-xl border-border bg-card px-4 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/20"
                                onKeyDown={(e) => e.key === "Enter" && handleCreateOrg()}
                            />

                            <Button
                                onClick={handleCreateOrg}
                                disabled={isCreating}
                                aria-label="Create workspace"
                                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Creating workspace...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4" />
                                        <span>Create workspace</span>
                                    </>
                                )}
                            </Button>
                            <div className="mt-5 flex items-start gap-2.5">
                                <p className="max-w-92.5 text-[11px] leading-5 text-slate-500">
                                    A dedicated place to bring your team
                                    together and work with AI-powered document
                                    analysis.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* RIGHT: WORKSPACE SELECTION */}
                    <section
                        aria-label="Workspace list"
                        className="min-w-0 mt-8"
                    >
                        <header className="mb-6 flex items-end justify-between gap-3">
                            <div>
                                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[2px] text-primary">
                                    Your personal directory
                                </p>

                                <h2 className="text-[20px] font-semibold tracking-[-1px] text-lightOrange-foreground sm:text-[28px]">
                                    Your workspaces
                                </h2>

                                <p className="mt-2 text-xs leading-5 text-slate-500">
                                    Where would you like to go today?
                                </p>
                            </div>

                            <div className="mb-1 flex shrink-0 items-center gap-2 rounded-full border border-[#e9e4da] bg-white/80 px-3 py-2">
                                <Building2 className="h-3.5 w-3.5 text-primary/80" />
                                <span
                                    role="status"
                                    aria-label="workspace count"
                                    className="text-[11px] font-semibold tabular-nums text-primary"
                                >
                                    {userMemberships?.count || 0}
                                </span>
                            </div>
                        </header>

                        <div className="overflow-hidden rounded-[22px] border border-border bg-card shadow-sm">
                            <div className="flex items-center justify-between border-b border-[#efebe4] px-5 py-4 sm:px-6">
                                <span className="text-[10px] font-semibold uppercase tracking-[1.5px] text-slate-600">
                                    All spaces
                                </span>

                                <span className="text-[10px] text-slate-500">
                                    Select to continue
                                </span>
                            </div>

                            <div className="thin-scrollbar max-h-[min(330px,45vh)] overflow-y-auto overscroll-contain px-3 py-2 sm:px-4">

                                {userMemberships?.count === 0 ? (
                                    <div
                                        role="status"
                                        aria-label="no workspaces available"
                                        className="flex min-h-80 flex-col items-center justify-center px-5 py-12 text-center"
                                    >
                                        <div className="relative mb-5 flex h-19 w-19 items-center justify-center rounded-full border border-[#f0dfd0] bg-[#fff5eb]">
                                            <Building2 className="h-8 w-8 text-primary/80" />
                                            <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-primary text-white">
                                                <Plus className="h-3.5 w-3.5" />
                                            </span>
                                        </div>

                                        <h3 className="text-[16px] font-semibold tracking-[-0.4px] text-[#454239]">
                                            A little room for something new.
                                        </h3>

                                        <p className="mt-2 max-w-66.25 text-xs leading-6 text-slate-500">
                                            You haven't joined a workspace yet.
                                            Create your first one and give your
                                            next idea a home.
                                        </p>

                                        <div className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[1.2px] text-primary">
                                            <ArrowRight className="h-3.5 w-3.5" />
                                            Create your first workspace
                                        </div>
                                    </div>
                                ) : (
                                    sortedMemberships?.map(
                                        (membership, index) => {
                                            const isActive = activeOrg?.id === membership.organization.id;

                                            return (
                                                <button
                                                    key={membership.organization.id}
                                                    onClick={() =>
                                                        handleSelectOrg(
                                                            membership.organization
                                                        )
                                                    }
                                                    aria-label={`Open workspace ${membership.organization.name} `}
                                                    className="group relative flex w-full cursor-pointer items-center gap-3 border-b border-border px-3 py-4 text-left transition-colors last:border-b-0 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:gap-4 sm:px-4 sm:py-[18px]"
                                                >
                                                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] border border-primary/15 bg-lightPeach/40 transition-colors group-hover:bg-lightPeach/70 sm:h-13.5 sm:w-13.5">
                                                        <span className="text-[19px] font-semibold uppercase tracking-tight text-primary">
                                                            {membership.organization.name.charAt(
                                                                0
                                                            )}
                                                        </span>

                                                    </div>


                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                                                            {membership.organization.name}
                                                        </h3>

                                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                                            <span className="rounded-md border border-border bg-secondary px-2 py-1 text-[9px] font-semibold uppercase text-muted-foreground">
                                                                {membership.role.replace("org:", "")}
                                                            </span>

                                                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                                                                <Users2 className="h-3 w-3" />
                                                                {membership.organization.membersCount ?? 0}{" "}
                                                                {membership.organization.membersCount === 1 ? "member" : "members"}
                                                            </span>


                                                        </div>
                                                    </div>

                                                    {isActive && (
                                                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                            Active
                                                        </span>
                                                    )}

                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-all group-hover:bg-lightPeach/50 group-hover:text-primary">
                                                        <ArrowRight className="h-4 w-4" />
                                                    </div>


                                                    <span className="sr-only">
                                                        Workspace {index + 1}
                                                    </span>
                                                </button>
                                            )
                                        }
                                    )
                                )}
                            </div>

                            <div className="flex items-center justify-between gap-3 border-t border-[#efebe4] bg-[#fdfcf9] px-5 py-3.5 sm:px-6">
                                <div className="flex items-center gap-2">
                                    <Users2 className="h-3.5 w-3.5 text-slate-500" />
                                    <span className="text-[10px] text-slate-500">
                                        Your team, your space
                                    </span>
                                </div>

                                <span className="text-[9px] font-medium uppercase tracking-[1.3px] text-slate-500">
                                    Workspace hub
                                </span>
                            </div>
                        </div>

                        <p className="mt-4 px-1 text-[10px] leading-5 text-slate-500">
                            Choose a workspace to access its projects,
                            documents, and collaborative tools.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}

