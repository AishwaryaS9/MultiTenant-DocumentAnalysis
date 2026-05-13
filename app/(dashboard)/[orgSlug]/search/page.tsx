import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Search, FileText, Calendar, User } from "lucide-react";
import Link from "next/link";

interface SearchPageProps {
    params: Promise<{
        orgSlug: string;
    }>;
    searchParams: Promise<{
        query?: string;
    }>;
}

export default async function SearchPage({
    params,
    searchParams,
}: SearchPageProps) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const { orgSlug } = await params;
    const { query = "" } = await searchParams;

    // Find organization
    const organization = await prisma.organization.findUnique({
        where: {
            slug: orgSlug,
        },
    });

    if (!organization) {
        redirect("/select-org");
    }

    // Verify membership
    const membership = await prisma.organizationMember.findFirst({
        where: {
            organizationId: organization.id,
            user: {
                clerkUserId: userId,
            },
        },
    });

    if (!membership) {
        redirect("/select-org");
    }

    // Search documents
    const documents = query
        ? await prisma.document.findMany({
            where: {
                organizationId: organization.id,
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        content: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },

                    {
                        aiKeywords: {
                            hasSome: query.split(" "),
                        },
                    }
                ],
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })
        : [];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-125 h-125 bg-blue-100/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-100 h-100 bg-slate-200/40 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-6xl mx-auto px-6 py-10 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-medium text-slate-600">
                            <Search className="w-3.5 h-3.5" />
                            Document Search
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
                                Search Documents
                            </h1>
                            <p className="text-slate-600 mt-3 text-base max-w-2xl">
                                Instantly find reports, contracts, invoices, and AI-generated insights across your workspace.
                            </p>
                        </div>
                    </div>

                    {query && (
                        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
                            <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                                Results
                            </p>

                            <div className="mt-1 flex items-end gap-2">
                                <span className="text-3xl font-black text-slate-900">
                                    {documents.length}
                                </span>

                                <span className="text-sm text-slate-500 pb-1">
                                    document{documents.length !== 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search Form */}
                <form action="" method="GET" className="relative">
                    <div className="group relative">
                        <div className="absolute inset-0 bg-linear-to-r from-blue-100/40 to-slate-200/30 rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />

                        <div className="relative bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                            <input
                                type="text"
                                name="query"
                                defaultValue={query}
                                placeholder="Search documents, keywords, summaries, or content..."
                                className="w-full pl-14 pr-32 py-5 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm"
                            />

                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 rounded-2xl bg-slate-900 text-white text-sm font-medium hover:opacity-90 transition"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </form>

                {/* Empty State */}
                {!query && (
                    <div className="bg-white/90 backdrop-blur border border-dashed border-slate-300 rounded-[32px] p-20 text-center shadow-sm">
                        <div className="mx-auto w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
                            <Search className="w-10 h-10 text-slate-400" />
                        </div>

                        <h3 className="text-2xl font-black text-slate-900">
                            Search your workspace
                        </h3>

                        <p className="text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
                            Try searching for invoices, contracts, reports, meeting
                            notes, AI summaries, or keywords.
                        </p>

                        <div className="flex flex-wrap justify-center gap-2 mt-8">
                            {[
                                "Invoices",
                                "Contracts",
                                "Reports",
                                "Meeting Notes",
                                "AI Keywords",
                            ].map((item) => (
                                <span
                                    key={item}
                                    className="px-4 py-2 rounded-full bg-slate-100 text-sm text-slate-700"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Results */}
                {query && documents.length === 0 && (
                    <div className="bg-white border border-slate-200 rounded-[32px] p-20 text-center shadow-sm">
                        <div className="mx-auto w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
                            <FileText className="w-10 h-10 text-slate-400" />
                        </div>

                        <h3 className="text-2xl font-black text-slate-900">
                            No documents found
                        </h3>

                        <p className="text-slate-500 mt-3 max-w-md mx-auto">
                            We couldn’t find anything matching{" "}
                            <span className="font-semibold text-slate-700">
                                "{query}"
                            </span>
                            . Try another keyword or phrase.
                        </p>
                    </div>
                )}

                {/* Results */}
                {documents.length > 0 && (
                    <div className="grid gap-5">
                        {documents.map((document) => {
                            const plainSummary = document.aiSummary
                                ?.replace(/[#*_`>-]/g, "")
                                .replace(/\n/g, " ")
                                .slice(0, 240);

                            return (
                                <div
                                    key={document.id}
                                    className="group relative bg-white border border-slate-200 rounded-[28px] p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                                >
                                    {/* Glow */}
                                    <div className="absolute inset-0 bg-linear-to-r from-blue-50/0 via-blue-50/40 to-slate-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative space-y-5">
                                        {/* Top */}
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100">
                                                    <FileText className="w-5 h-5 text-blue-600" />
                                                </div>

                                                <div>
                                                    <h2 className="font-black text-slate-900 text-xl leading-tight">
                                                        {document.name}
                                                    </h2>

                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                                                            {document.fileType}
                                                        </span>

                                                        <span className="text-xs text-slate-400">
                                                            {document.fileSize
                                                                ? `${(document.fileSize / 1024 / 1024).toFixed(1)} MB`
                                                                : "Unknown size"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {document.fileUrl && (
                                                <Link
                                                    href={document.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="shrink-0 px-4 py-2 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-sm font-medium text-slate-700 transition"
                                                >
                                                    Download
                                                </Link>
                                            )}
                                        </div>

                                        {/* Summary */}
                                        {plainSummary && (
                                            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                                <p className="text-sm leading-7 text-slate-600">
                                                    {plainSummary}...
                                                </p>
                                            </div>
                                        )}

                                        {/* Keywords */}
                                        {document.aiKeywords?.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {document.aiKeywords
                                                    .slice(0, 8)
                                                    .map((keyword) => (
                                                        <span
                                                            key={keyword}
                                                            className="px-3 py-1.5 rounded-full bg-blue-50 text-xs font-medium text-blue-700 border border-blue-100"
                                                        >
                                                            #{keyword}
                                                        </span>
                                                    ))}
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                                <div className="flex items-center gap-1.5">
                                                    <User className="w-3.5 h-3.5" />
                                                    {document.user?.name || "Unknown"}
                                                </div>

                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(
                                                        document.createdAt
                                                    ).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="text-xs text-slate-400">
                                                AI indexed document
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}