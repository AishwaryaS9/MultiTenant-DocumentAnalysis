import { EmptySearchState } from "@/components/search/empty-search-state";
import { NoResultsState } from "@/components/search/no-results-state";
import { SearchForm } from "@/components/search/search-form";
import { SearchHeader } from "@/components/search/search-header";
import { SearchResultCard } from "@/components/search/search-result-card";
import { Document, SearchPageProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const { orgSlug } = await params;
    const { query = "" } = await searchParams;

    let documents = [];

    if (query) {
        try {
            const reqHeaders = await headers();
            const host = reqHeaders.get("host") || "localhost:3000";
            const protocol = host.startsWith("localhost") ? "http" : "https";

            const apiUrl = `${protocol}://${host}/api/documents/search?orgSlug=${orgSlug}&query=${encodeURIComponent(query)}`;

            const response = await fetch(apiUrl, {
                headers: {
                    cookie: reqHeaders.get("cookie") || "",
                },
                next: { revalidate: 0 }
            });

            if (response.ok) {
                const data = await response.json();
                documents = data.documents || [];
            } else if (response.status === 401 || response.status === 403 || response.status === 404) {
                redirect("/select-org");
            }
        } catch (error) {
            console.error("Failed to fetch documents from API:", error);
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-white via-amber-50/40 to-orange-50/30 overflow-hidden">
            <div className="relative mx-auto max-w-6xl px-6 py-10 space-y-10">
                <SearchHeader
                    query={query}
                    resultsCount={documents.length}
                />

                {/* Sticky Search */}
                <div className="sticky top-6 z-20">
                    <SearchForm query={query} />
                </div>

                {!query && <EmptySearchState />}

                {query && documents.length === 0 && (
                    <NoResultsState query={query} />
                )}

                {documents.length > 0 && (
                    <div className="grid gap-6">
                        {documents.map((document: Document, index: number) => (
                            <div
                                key={document.id}
                                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                style={{
                                    animationDelay: `${index * 60}ms`,
                                }}
                            >
                                <SearchResultCard
                                    document={document}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}