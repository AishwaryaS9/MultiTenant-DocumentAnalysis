import { EmptySearchState } from "@/components/search/empty-search-state";
import { NoResultsState } from "@/components/search/no-results-state";
import { SearchForm } from "@/components/search/search-form";
import { SearchHeader } from "@/components/search/search-header";
import { SearchResultCard } from "@/components/search/search-result-card";
import { prisma } from "@/lib/prisma";
import { SearchPageProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const { orgSlug } = await params;
    const { query = "" } = await searchParams;

    const organization = await prisma.organization.findUnique({
        where: {
            slug: orgSlug,
        },
    });

    if (!organization) {
        redirect("/select-org");
    }

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
                    },
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
        <div className="min-h-screen bg-slate-50/50">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-125 h-125 bg-amber-100/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-100 h-100 bg-blue-100/20 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-6xl mx-auto px-6 py-10 space-y-8">
                <SearchHeader
                    query={query}
                    resultsCount={documents.length}
                />

                <SearchForm query={query} />

                {!query && <EmptySearchState />}

                {query && documents.length === 0 && (
                    <NoResultsState query={query} />
                )}

                {documents.length > 0 && (
                    <div className="grid gap-5">
                        {documents.map((document) => (
                            <SearchResultCard
                                key={document.id}
                                document={document}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}