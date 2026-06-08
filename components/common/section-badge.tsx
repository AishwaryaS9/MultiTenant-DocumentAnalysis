import { Sparkles } from 'lucide-react'

type SectionBadgeProps = {
    title: string | null;
};

export default function SectionBadge({ title }: SectionBadgeProps) {
    return (
        <span
            role="status"
            aria-label={title ?? ""}
            className="px-4 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs sm:text-sm font-medium flex items-center gap-2 text-center"
        >
            <Sparkles className="w-3.5 h-3.5 fill-current shrink-0" aria-hidden="true" />
            {title}
        </span>
    )
}
