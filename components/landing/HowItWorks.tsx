import { steps } from "@/app/data/data";
import { BarChart3 } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="py-24 bg-[#F9F7F2]">
      <div className="container max-w-7xl mx-auto px-4">
        
        {/* Brand Icon - Ref: image_99347d.png */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 bg-[#1A1A1A] rounded-2xl flex items-center justify-center shadow-2xl">
            <BarChart3 className="w-7 h-7 text-orange-400" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1A1A1A] tracking-tight max-w-3xl mx-auto leading-tight">
            How Docinate Empowers <br /> Your Document Analysis
          </h2>
        </div>

        {/* Single Row 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4 group">
              {/* Orange Icon Box */}
              <div className="shrink-0 w-11 h-11 bg-orange-400 rounded-xl flex items-center justify-center text-black shadow-sm group-hover:scale-110 transition-transform duration-300">
                <step.icon className="w-6 h-6" />
              </div>
              
              {/* Content */}
              <div className="space-y-1">
                <h3 className="font-bold text-[#1A1A1A] text-[17px] leading-tight">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-snug">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}