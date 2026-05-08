import { testimonials } from '@/app/data/data'
import React from 'react'

const Testimonials = () => {
    return (
        <section className="py-12 overflow-hidden bg-transparent">
            <div className="flex flex-col gap-6">
                {/* Row 1 */}
                <div className="flex whitespace-nowrap animate-marquee">
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100 mx-4">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                                {t.avatar}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{t.text}</span>
                        </div>
                    ))}
                </div>
                {/* Row 2 (Reverse) */}
                <div className="flex whitespace-nowrap animate-marquee-reverse">
                    {[...testimonials, ...testimonials].reverse().map((t, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100 mx-4">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                                {t.avatar}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{t.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials