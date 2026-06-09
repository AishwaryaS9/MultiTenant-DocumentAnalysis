"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MembersToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  const updateUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== (searchParams.get("search") || "")) {
        updateUrl("search", searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
      <label htmlFor="member-search" className="sr-only">
        Search members by name or email
      </label>
      <div className="relative w-full sm:max-w-sm">
        <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="member-search"
          aria-label="Search members"
          type="search"
          placeholder="Search name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 bg-slate-50/50 pl-9 transition-all focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-1 focus-visible:ring-offset-gray-50"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-1.5 px-1 py-1.5 text-xs font-medium text-muted-foreground">
          <SlidersHorizontal aria-hidden="true" className="h-3.5 w-3.5" />
          <span>Filters</span>
        </div>

        <Select
          value={searchParams.get("role") || "all"}
          onValueChange={(value) => updateUrl("role", value)}
        >
          <SelectTrigger
            aria-label="Filter members by role"
            className="h-10 w-32.5 bg-white font-medium text-slate-700"
          >
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent position="popper"
            side="bottom"
            align="start"
            sideOffset={4}>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("sort") || "newest"}
          onValueChange={(value) => updateUrl("sort", value)}
        >
          <SelectTrigger
            aria-label="Sort members"
            className="h-10 w-35 bg-white font-medium text-slate-700"
          >
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent position="popper"
            side="bottom"
            align="start"
            sideOffset={4}>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}