import { Brain, Search, Sparkles, Upload, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { EmptyDashboardProps } from "@/types";
import InviteTeamModal from "./invite-team-modal";

const STEPS = [
    {
        icon: Upload,
        title: "Upload a document",
        description: "Add a file to your workspace. Everyone in your organization can open it.",
    },
    {
        icon: Sparkles,
        title: "Read the summary",
        description: "A short summary and key points are written for you as soon as it's processed.",
    },
    {
        icon: Search,
        title: "Search everything",
        description: "Look up an answer across all your documents instead of opening them one by one.",
    },
];

export default async function EmptyDashboard({ orgName, orgSlug, role }: EmptyDashboardProps) {

    return (
        <main
            className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-start px-5 py-5 sm:px-8 lg:py-8"
            aria-labelledby="empty-dashboard-title"
        >
            <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
                <div className="text-left">
                    <p className="text-xs font-bold text-primary uppercase wrap-break-word">
                        {orgName}
                    </p>

                    <h1
                        id="empty-dashboard-title"
                        className="mt-3 text-2xl leading-[1.05] font-semibold tracking-tight text-foreground sm:text-3xl"
                    >
                        Your workspace is empty. Add the first document.
                    </h1>

                    <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                        Once a document is uploaded you can read a summary of it, search its
                        contents, and share it with your team.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button
                            asChild
                            className="h-12 w-full cursor-pointer rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto"
                        >
                            <Link href={`/${orgSlug}/documents`}>
                                <Upload className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
                                Upload a document
                            </Link>
                        </Button>

                        {role === "admin" && (
                            <InviteTeamModal>
                                <Button
                                    variant="outline"
                                    className="h-12 w-full cursor-pointer rounded-xl border-border bg-transparent px-6 text-sm font-semibold text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
                                >
                                    <Users className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
                                    Invite your team
                                </Button>
                            </InviteTeamModal>
                        )}
                    </div>
                </div>

                {/* Preview of a processed document (decorative) */}
                <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden="true">
                    {/* Back sheet, offset to suggest a stack of documents */}
                    <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-lg border border-border bg-muted sm:translate-x-4 sm:translate-y-4" />

                    {/* Front sheet */}
                    <div className="relative rounded-lg border border-foreground/15 bg-card p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-3 border-b border-border pb-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white">
                                <Brain className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="h-2.5 w-2/3 rounded-sm bg-muted-foreground/30" />
                                <div className="mt-2 h-2 w-1/3 rounded-sm bg-muted-foreground/30" />
                            </div>
                        </div>

                        {/* Summary block: the one accent on the page */}
                        <div className="mt-5 rounded-md border-l-4 border-primary bg-feature-pill/60 p-4">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                                <Sparkles className="h-3.5 w-3.5" />
                                Summary
                            </div>
                            <div className="mt-3 space-y-2">
                                <div className="h-1.5 w-full rounded-sm bg-foreground/25" />
                                <div className="h-1.5 w-11/12 rounded-sm bg-foreground/25" />
                                <div className="h-1.5 w-3/5 rounded-sm bg-foreground/25" />
                            </div>
                        </div>

                        {/* Body text lines */}
                        <div className="mt-5 space-y-2.5">
                            <div className="h-1.5 w-full rounded-sm bg-muted-foreground/20" />
                            <div className="h-1.5 w-full rounded-sm bg-muted-foreground/20" />
                            <div className="h-1.5 w-10/12 rounded-sm bg-muted-foreground/20" />
                            <div className="h-1.5 w-full rounded-sm bg-muted-foreground/20" />
                            <div className="h-1.5 w-7/12 rounded-sm bg-muted-foreground/20" />
                        </div>
                    </div>
                </div>

            </div>

            {/* What happens next: a real sequence, so it is numbered */}
            <section className="mt-16 lg:mt-24" aria-labelledby="empty-dashboard-steps">
                <h2
                    id="empty-dashboard-steps"
                    className="text-lg font-semibold tracking-tight text-foreground"
                >
                    What happens after you upload
                </h2>

                <ol className="mt-5 grid grid-cols-1 border-t border-border sm:grid-cols-3">
                    {STEPS.map(({ icon: Icon, title, description }, index) => (
                        <li
                            key={title}
                            className="flex gap-4 border-b border-border py-5 sm:block sm:border-b-0 sm:py-6 sm:pr-8 sm:not-first:border-l sm:not-first:pl-8"
                        >
                            <span className="text-3xl font-black leading-none text-primary/60 sm:block">
                                {index + 1}
                            </span>
                            <div className="sm:mt-4">
                                <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                                    <Icon
                                        className="h-4 w-4 shrink-0 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                    {title}
                                </h3>
                                <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>
        </main>
    );
}