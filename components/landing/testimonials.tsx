import { testimonials } from '@/app/data/data'
import TestimonialCard from '../common/testimonial-card'

const Testimonials = () => {
    return (
        <section id='testimonials'
            aria-labelledby='testimonials-heading'
            className="py-16 sm:py-20 overflow-hidden bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 sm:mb-12 text-center">
                <h2 id='testimonials-heading'
                    className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">
                    Trusted by industry leaders
                </h2>

                <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-pretty">
                    See what our users are saying about how Docinate AI has transformed their document workflow.
                </p>
            </div>

            <div className="relative flex flex-col gap-5 sm:gap-8"
                aria-label="Customer testimonials">

                <div aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 lg:w-32 bg-testimonial-fade-right z-10" />

                <div aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 lg:w-32 bg-testimonial-fade-left z-10" />

                <div className="flex whitespace-nowrap animate-marquee hover:paused"
                    role="list"
                    aria-label="Scrolling testimonials row one">
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <TestimonialCard key={`row1-${i}`} t={t} />
                    ))}
                </div>

                <div className="flex whitespace-nowrap animate-marquee-reverse hover:paused"
                    role="list"
                    aria-label="Scrolling testimonials row two">
                    {[...testimonials, ...testimonials].reverse().map((t, i) => (
                        <TestimonialCard key={`row2-${i}`} t={t} />
                    ))}
                </div>
            </div>
        </section>
    )
}


export default Testimonials