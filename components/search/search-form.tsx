import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchFormProps } from "@/types";

export function SearchForm({ query }: SearchFormProps) {
    return (
        <form action="" method="GET" className="relative">
            <div className="group relative">
                <div className="absolute inset-0 bg-linear-to-r from-amber-100/40 via-orange-100/30 to-blue-100/20 rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-white/90 border border-slate-100 rounded-3xl shadow-sm backdrop-blur-sm overflow-hidden">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                    <Input
                        type="text"
                        name="query"
                        defaultValue={query}
                        placeholder="Search documents..."
                        className="w-full pl-14 pr-36 py-7 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm placeholder:text-slate-400"
                    />

                    <Button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-2xl px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold shadow-lg shadow-amber-200/50"
                    >
                        Search
                    </Button>
                </div>
            </div>
        </form>
    );
}