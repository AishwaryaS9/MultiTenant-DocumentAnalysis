
export default function TestimonialCard({ t }: { t: any }) {
    return (
        <article role="listitem"
            tabIndex={0}
            aria-label={`Testimonial from verified user: ${t.text}`}
            className="flex items-center gap-3 sm:gap-4 bg-white px-5 sm:px-8 py-4 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 mx-2 
            sm:mx-4 min-w-65 sm:min-w-fit transition-transform duration-300 motion-reduce:transition-none hover:scale-[1.02] motion-reduce:hover:scale-100 
            focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-orange-200">
            <div aria-hidden="true"
             className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg border border-orange-200 shrink-0">
                {t.avatar}
            </div>

            <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-gray-800 truncate sm:whitespace-normal">
                    {t.text}
                </span>

                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mt-1">
                    Verified User
                </span>
            </div>
        </article>
    )
}
