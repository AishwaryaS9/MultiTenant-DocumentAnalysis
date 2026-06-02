"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  page: number;
  totalPages: number;
}

export default function Pagination({ page, totalPages }: Props) {
  const searchParams = useSearchParams();

  // Helper to generate correct URLs without blowing away existing filter states
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
      {/* Current Context Tracker */}
      <p className="text-xs text-muted-foreground font-medium">
        Showing page <span className="text-foreground font-semibold">{page}</span> of{" "}
        <span className="text-foreground font-semibold">{totalPages}</span>
      </p>

      {/* Action Controls using shadcn's outline variant sizing */}
      <div className="flex items-center gap-2">
        <Link
          href={createPageUrl(page - 1)}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-9 gap-1 text-xs font-medium px-3 shadow-xs transition-all",
            page <= 1 && "pointer-events-none opacity-40"
          )}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </Link>

        <Link
          href={createPageUrl(page + 1)}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-9 gap-1 text-xs font-medium px-3 shadow-xs transition-all",
            page >= totalPages && "pointer-events-none opacity-40"
          )}
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}