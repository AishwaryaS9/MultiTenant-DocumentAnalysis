import { EmptySearchState } from "@/components/search/empty-search-state";
import { NoResultsState } from "@/components/search/no-results-state";
import { SearchForm } from "@/components/search/search-form";
import { SearchHeader } from "@/components/search/search-header";
import { SearchResultCard } from "@/components/search/search-result-card";
import { Document, SearchPageProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function generateMetadata({ searchParams }: SearchPageProps) {
    const { query = "" } = await searchParams;

    return {
        title: query ? `Search: ${query}` : "Search Documents",
        description: "Search and discover AI-analyzed documents in your workspace.",
    };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
    const { userId } = await auth();

    if (!userId) redirect("/sign-in");

    const { orgSlug } = await params;
    const { query = "" } = await searchParams;

    let documents: Document[] = [];

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
                next: { revalidate: 0 },
            });

            if (response.ok) {
                const data = await response.json();
                documents = data.documents || [];
            } else if ([401, 403, 404].includes(response.status)) {
                redirect("/select-org");
            }
        } catch (error) {
            console.error("Failed to fetch documents from API:", error);
        }
    }

    const resultCountText =
        query && documents.length > 0
            ? `Found ${documents.length} result${documents.length !== 1 ? "s" : ""} for ${query}`
            : "";

    return (
        <main className="min-h-screen overflow-hidden bg-slate-50/50" aria-label="Document search page">
            <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 space-y-8 sm:space-y-10">

                {/* SEO H1 */}
                <h1 className="sr-only">Search organization documents</h1>

                {/* Header */}
                <header aria-label="Search page header">
                    <SearchHeader query={query} resultsCount={documents.length} />
                </header>

                {/* Sticky Search */}
                <div className="sticky top-4 z-20 sm:top-6" aria-label="Search form">
                    <SearchForm query={query} />
                </div>

                {/* Screen reader live announcement */}
                {query && (
                    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                        {resultCountText}
                    </div>
                )}

                {/* States */}
                {!query && (
                    <section aria-label="Empty search state">
                        <EmptySearchState />
                    </section>
                )}

                {query && documents.length === 0 && (
                    <section aria-label="No results state">
                        <NoResultsState query={query} />
                    </section>
                )}

                {/* Results */}
                {documents.length > 0 && (
                    <section aria-label="Search results" role="list" className="grid gap-4 sm:gap-6">
                        {documents.map((document: Document, index: number) => (
                            <div
                                key={document.id}
                                role="listitem"
                                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                style={{ animationDelay: `${index * 60}ms` }}
                            >
                                <SearchResultCard document={document} />
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
}