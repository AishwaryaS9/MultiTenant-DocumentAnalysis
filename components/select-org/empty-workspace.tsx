"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyWorkspaceStateProps } from "@/types";
import { FileText, Loader2, Plus, Users } from "lucide-react";
import { useState } from "react";

export default function EmptyWorkspace({
    orgName,
    setOrgName,
    isCreating,
    onCreate,
    onJoinWithInvite,
}: EmptyWorkspaceStateProps) {
    const [showForm, setShowForm] = useState(false);

    return (
        <section
            role="status"
            aria-label="No workspaces yet"
            className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card px-6 pb-12 pt-16 text-center"
        >
            {/* soft background circle */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 -top-[215px] h-[475px] w-[475px] -translate-x-1/2 rounded-full bg-feature-pill"
            />

            {/* illustration */}
            <div className="relative mx-auto mb-8 h-[140px] w-[180px]" aria-hidden="true">
                {/* folder tab */}
                <div className="absolute left-[40px] top-[26px] h-6 w-[50px] rounded-t-lg bg-lightPeach" />
                {/* folder body */}
                <div className="absolute left-[20px] top-[40px] flex h-[100px] w-[140px] items-center justify-center rounded-2xl border border-lightPeach/60 bg-lightPeach/40">
                    <Users className="h-9 w-9 text-primary" strokeWidth={1.75} />
                </div>
                {/* document chip */}
                <div className="absolute left-0 top-[30px] flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card shadow-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                {/* plus badge */}
                <div className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                    <Plus className="h-5 w-5" />
                </div>
            </div>

            <div className="relative space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                    Start collaborating
                </p>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-[26px]">
                    You don’t have a workspace yet
                </h1>
                <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
                    Create a workspace to organize documents, invite your team, and run
                    AI-powered analyses together.
                </p>
            </div>

            <div className="relative mt-8 flex flex-col items-center gap-3">
                {showForm ? (
                    <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
                        <label htmlFor="orgName" className="sr-only">
                            Workspace name
                        </label>
                        <Input
                            id="orgName"
                            autoFocus
                            value={orgName}
                            maxLength={60}
                            disabled={isCreating}
                            onChange={(e) => setOrgName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !isCreating && onCreate()}
                            placeholder="e.g. Acme Corp Analytics"
                            className="h-12 rounded-xl border-input bg-background px-4 text-sm focus-visible:ring-2 focus-visible:ring-primary"
                        />
                        <Button
                            onClick={onCreate}
                            disabled={isCreating || !orgName.trim()}
                            className="h-12 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:opacity-50"
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating…
                                </>
                            ) : (
                                "Create"
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        <Button
                            onClick={() => setShowForm(true)}
                            className="h-12 cursor-pointer rounded-xl bg-primary px-7 text-base font-medium text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Create your first workspace
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onJoinWithInvite}
                            className="h-12 cursor-pointer rounded-xl border-border bg-background px-7 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <Users className="mr-2 h-4 w-4" />
                            Join with invite
                        </Button>
                    </div>
                )}

                <p className="mt-2 text-[11px] text-muted-foreground">
                    Already received an invitation? Join using the link in your email.
                </p>
            </div>
        </section>
    );
}