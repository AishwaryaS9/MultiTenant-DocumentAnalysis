"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Sparkles, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchFormProps } from "@/types";

export function SearchForm({ query }: SearchFormProps) {
    const [value, setValue] = useState(query);

    const router = useRouter();
    const pathname = usePathname();

    const clearSearch = () => {
        setValue("");
        router.push(pathname);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (newValue.trim() === "") {
            router.replace(pathname);
        }
    };

    return (
        <form action="" method="GET" className="relative">
            <div className="group relative">
                <div className="absolute inset-0 rounded-3xl blur-xl opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />
                <div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow-sm">
                    {/* Search Icon */}
                    <Search className="absolute left-6 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-amber-500 " />

                    {/* Input */}
                    <Input
                        type="text"
                        name="query"
                        value={value}
                        onChange={handleChange}
                        placeholder="Search documents, summaries, contracts..."
                        className="h-16 border-0 bg-transparent pl-16 pr-52 text-base shadow-none placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />

                    {/* Right Actions */}
                    <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                        {/* Clear Button */}
                        {value && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
                                <X className="h-4 w-4" />
                            </button>
                        )}

                        {/* AI Badge */}
                        <div className="hidden items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 md:flex" >
                            <Sparkles className="h-3 w-3" />
                            AI Search
                        </div>

                        {/* Search Button */}
                        <Button
                            type="submit"
                            className="h-12 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 cursor-pointer">
                            Search
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}