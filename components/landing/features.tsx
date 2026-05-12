import { features } from '@/app/data/data'
import Image from 'next/image'

export default function Features() {
    return (
        <section id="features"
            className="py-16 md:py-24 relative overflow-hidden"
            aria-labelledby="features-title"
        >
            {/* Decorative Background Elements - Hidden from Screen Readers */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 pointer-events-none" aria-hidden="true">
                <div className="absolute top-24 left-10 w-72 h-72 bg-blue-200 rounded-full blur-[120px]" />
                <div className="absolute bottom-24 right-10 w-72 h-72 bg-purple-200 rounded-full blur-[120px]" />
            </div>

            <div className="container max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
                        <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                            Features
                        </span>
                    </div>
                    <h2
                        id="features-title"
                        className="text-3xl md:text-5xl font-semibold tracking-tight text-[#1A1A1A] mb-4"
                    >
                        Everything You Need
                    </h2>
                    <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
                        Powerful tools designed to help teams analyze, summarize, and collaborate on complex documents in seconds.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {features.slice(0, 4).map((feature, index) => (
                        <article
                            key={index}
                            className="rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 bg-white flex flex-col justify-between shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="mb-8">
                                <div
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFF8E6] border border-[#FFE8A3] mb-6"
                                    role="note"
                                >
                                    <div className="w-2 h-2 bg-orange-400 rounded-full" aria-hidden="true" />
                                    <span className="text-[10px] font-bold tracking-widest text-orange-800 uppercase">
                                        {feature.badge}
                                    </span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-4 leading-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                                    {feature.description}
                                </p>
                            </div>

                            <div className="relative w-full aspect-video bg-gray-50 rounded-2xl overflow-hidden mt-4">
                                <Image
                                    src={feature.image}
                                    alt={`Interface preview showing ${feature.title}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority={index < 2} // Preload first two feature images for better performance
                                />
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}