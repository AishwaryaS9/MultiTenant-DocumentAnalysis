"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Sparkles, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchFormProps } from "@/types";

export function SearchForm({ query }: SearchFormProps) {
    const [value, setValue] = useState(query);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateSearch = (newQuery: string) => {
        const params = new URLSearchParams(searchParams?.toString());

        if (newQuery.trim()) {
            params.set("query", newQuery);
        } else {
            params.delete("query");
        }

        router.replace(`${pathname}?${params.toString()}`);
    };

    const clearSearch = () => {
        setValue("");
        router.replace(pathname);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);

        if (newValue.trim() === "") {
            router.replace(pathname);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSearch(value);
    };

    return (
        <form
            onSubmit={handleSubmit}
            role="search"
            aria-label="Search documents form"
            className="relative w-full p-2 sm:p-4">
            <label htmlFor="document-search" className="sr-only">
                Search documents
            </label>

            <div className="group relative">
                <div className="relative overflow-hidden rounded-[24px] border border-slate-100 bg-white p-3 shadow-md md:border-white/60 md:bg-white/80 md:p-0 md:shadow-sm">
                    <div className="relative flex flex-col sm:flex-row sm:items-center">
                        {/* Search Input */}
                        <div className="relative w-full border-b border-transparent pb-2 transition-colors duration-200 group-focus-within:border-orange-400 sm:border-b-0 sm:pb-0">
                            <Search
                                className="absolute left-3 sm:left-4 top-1/2 z-10 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-orange-400" aria-hidden="true"
                            />

                            <Input
                                id="document-search"
                                type="text"
                                name="query"
                                value={value}
                                onChange={handleChange}
                                placeholder="Search documents..."
                                autoComplete="off"
                                spellCheck={false}
                                aria-label="Search documents input"
                                className="h-12 sm:h-14 md:h-16 w-full border-0 bg-transparent pl-11 sm:pl-12 pr-11 sm:pr-4 text-sm sm:text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            />

                            {/* Mobile Clear Button */}
                            {value && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    aria-label="Clear search input"
                                    className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:ring-offset-1 sm:hidden"
                                >
                                    <X className="h-4 w-4" aria-hidden="true" />
                                </button>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="mt-2 flex w-full flex-col items-center gap-2 sm:absolute sm:right-3 sm:top-1/2 sm:mt-0 sm:w-auto sm:-translate-y-1/2 sm:flex-row">
                            {/* Desktop Clear Button */}
                            {value && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    aria-label="Clear search input"
                                    className="hidden h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:ring-offset-1 sm:flex"
                                >
                                    <X className="h-4 w-4" aria-hidden="true" />
                                </button>
                            )}

                            {/* AI Badge */}
                            <div
                                className="hidden items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 whitespace-nowrap lg:flex"
                                aria-hidden="true"
                            >
                                <Sparkles className="h-3 w-3" />
                                AI Search
                            </div>

                            {/* Search Button */}
                            <Button
                                type="submit"
                                aria-label="Submit search"
                                className="h-14 w-full rounded-2xl bg-[#0B132B] px-6 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#111C3E] focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-1 cursor-pointer sm:h-11 sm:w-auto sm:rounded-xl sm:text-sm"
                            >
                                Search
                            </Button>
                        </div>
                    </div>
                </div>

                <p id="search-help" className="sr-only">
                    Search across documents, AI summaries, and workspace content.
                </p>

                <div aria-live="polite" className="sr-only">
                    {value ? `Searching for ${value}` : "Search cleared"}
                </div>
            </div>
        </form>
    );
}