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
            className="relative w-full"
            role="search"
            aria-label="Search documents form"
        >
            <label htmlFor="document-search" className="sr-only">
                Search documents
            </label>

            <div className="group relative">
                {/* Glow */}
                <div className="absolute inset-0 rounded-3xl blur-xl opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />

                <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow-sm flex flex-col sm:flex-row sm:items-center">

                    {/* Search Icon */}
                    <Search
                        className="absolute left-6 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-amber-500"
                        aria-hidden="true"
                    />

                    {/* Input */}
                    <Input
                        id="document-search"
                        type="text"
                        name="query"
                        value={value}
                        onChange={handleChange}
                        placeholder="Search documents, summaries, contracts..."
                        className="h-16 border-0 bg-transparent pl-16 pr-4 text-base shadow-none placeholder:text-slate-400 
                        focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-amber-400 w-full"
                        aria-label="Search documents input"
                        aria-describedby="search-help"
                    />

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 px-4 pb-4 sm:pb-0 sm:pr-3 sm:pl-0 sm:absolute sm:right-3 sm:top-1/2 sm:-translate-y-1/2">

                        {/* Clear Button */}
                        {value && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors 
                                hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-400"
                                aria-label="Clear search input"
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                        )}

                        {/* AI Badge */}
                        <div
                            className="hidden items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 md:flex"
                            aria-hidden="true"
                        >
                            <Sparkles className="h-3 w-3" />
                            AI Search
                        </div>

                        {/* Search Button */}
                        <Button
                            type="submit"
                            className="h-11 sm:h-12 rounded-xl bg-slate-900 px-5 sm:px-6 text-sm font-semibold text-white shadow-sm transition-colors 
                            hover:bg-slate-800 cursor-pointer focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-slate-700 w-full sm:w-auto"
                            aria-label="Submit search">
                            Search
                        </Button>
                    </div>
                </div>

                <p id="search-help" className="sr-only">
                    Search across documents, AI summaries, and workspace content
                </p>
            </div>
        </form>
    );
}