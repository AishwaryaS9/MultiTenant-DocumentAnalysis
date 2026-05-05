import { features } from '@/app/data/data';
import Image from 'next/image';

const Features = () => {
    return (
        <section className="py-24 ">
            <div className="container max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-6">
                    {features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="rounded-[2.5rem] p-10 bg-white flex flex-col justify-between shadow-sm border border-gray-100/50">
                            <div className="mb-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFF8E6] border border-[#FFE8A3] mb-6">
                                    <div className="w-3 h-3 bg-orange-400 rounded-sm" />
                                    <span className="text-[10px] font-bold tracking-wider text-orange-800 uppercase">Feature {index + 1}</span>
                                </div>
                                <h3 className="text-3xl font-semibold text-[#1A1A1A] mb-4 leading-tight">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed max-w-sm">{feature.description}</p>
                            </div>
                            <div className="relative w-full aspect-video bg-gray-50 rounded-2xl overflow-hidden mt-4">
                                <Image src={feature.image} alt="Feature Preview" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features