import { testimonials } from '@/app/data/data'

const Testimonials = () => {
    return (
        <section id='testimonials' className="py-20 overflow-hidden bg-[#F9F9F9]">
            <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Trusted by industry leaders
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    See what our users are saying about how Docinate AI has transformed their document workflow.
                </p>
            </div>

            <div className="relative flex flex-col gap-8">
                {/* Gradient Overlays for the "Fade" effect */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-linear-to-r from-[#fcfbf7] to-transparent z-10" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-linear-to-l from-[#fcfbf7] to-transparent z-10" />

                {/* Row 1 */}
                <div className="flex whitespace-nowrap animate-marquee hover:paused cursor-pointer">
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <TestimonialCard key={`row1-${i}`} t={t} />
                    ))}
                </div>

                {/* Row 2 (Reverse) */}
                <div className="flex whitespace-nowrap animate-marquee-reverse hover:paused cursor-pointer">
                    {[...testimonials, ...testimonials].reverse().map((t, i) => (
                        <TestimonialCard key={`row2-${i}`} t={t} />
                    ))}
                </div>
            </div>
        </section>
    )
}

const TestimonialCard = ({ t }: { t: any }) => (
    <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 mx-4 transition-transform duration-300 hover:scale-105">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg border border-orange-200">
            {t.avatar}
        </div>
        <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">{t.text}</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Verified User</span>
        </div>
    </div>
)

export default Testimonials