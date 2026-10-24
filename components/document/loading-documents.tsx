import { cn } from "@/lib/utils";

const ROWS = [
    { name: "w-48", meta: "w-28", owner: "w-24", date: "w-20" },
    { name: "w-64", meta: "w-24", owner: "w-28", date: "w-20" },
    { name: "w-40", meta: "w-32", owner: "w-20", date: "w-20" },
    { name: "w-56", meta: "w-28", owner: "w-24", date: "w-20" },
    { name: "w-44", meta: "w-24", owner: "w-28", date: "w-20" },
    { name: "w-60", meta: "w-32", owner: "w-20", date: "w-20" },
];

function Bone({ className, index = 0 }: { className?: string; index?: number }) {
    return (
        <span
            aria-hidden="true"
            style={{ animationDelay: `${index * 90}ms` }}
            className={cn(
                "block animate-pulse rounded-md bg-slate-200/70 motion-reduce:animate-none",
                className
            )}
        />
    );
}

export default function LoadingDocuments() {
    return (
        <section
            role="status"
            aria-live="polite"
            aria-busy="true"
            aria-label="Loading documents"
            className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white"
        >
            <span className="sr-only">Loading documents…</span>

            {/* TOOLBAR */}
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <Bone className="h-12 w-full rounded-2xl bg-stone-100 sm:max-w-md" />
                <div className="flex items-center gap-2.5">
                    <Bone className="h-11 w-28 rounded-xl" index={1} />
                    <Bone className="h-11 w-36 rounded-xl" index={2} />
                </div>
            </div>

            {/* ROWS */}
            <ul className="border-t border-slate-100" aria-hidden="true">
                {ROWS.map((row, i) => (
                    <li
                        key={i}
                        className={cn(
                            "grid grid-cols-[1fr_auto] items-center gap-x-4 border-b border-slate-100 px-4 py-4 last:border-b-0 sm:px-6",
                            "md:grid-cols-[minmax(0,1fr)_160px_130px_120px_24px] md:gap-x-6"
                        )}
                    >
                        <div className="flex min-w-0 items-center gap-4">
                            <Bone className="h-12 w-12 shrink-0 rounded-2xl bg-orange-100/60" index={i} />
                            <div className="min-w-0 space-y-2">
                                <Bone className={cn("h-3.5 max-w-full", row.name)} index={i} />
                                <Bone className={cn("h-3 max-w-full bg-slate-100", row.meta)} index={i} />
                            </div>
                        </div>

                        <Bone className={cn("hidden h-3.5 md:block", row.owner)} index={i} />
                        <Bone className={cn("hidden h-3.5 md:block", row.date)} index={i} />
                        <Bone className="h-6 w-20 justify-self-end rounded-full md:justify-self-start" index={i} />
                        <Bone className="hidden h-4 w-4 justify-self-end md:block" index={i} />
                    </li>
                ))}
            </ul>
        </section>
    );
}