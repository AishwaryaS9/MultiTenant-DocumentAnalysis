import { Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AIProgressCardProps {
    percentage: number;
}

export default function AIProgressCard({
    percentage,
}: AIProgressCardProps) {
    return (
        <Card className="md:col-span-2 border-none bg-dashboard-panel text-white shadow-2xl relative overflow-hidden flex flex-col justify-center">
            <div className="absolute -right-5 -bottom-5 opacity-10 rotate-12">
                <Brain className="w-48 h-48" />
            </div>

            <CardContent className="pt-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                            Neural Processing
                        </p>

                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black tracking-tighter">
                                {percentage}%
                            </span>

                            <span className="text-slate-400 font-medium">
                                Indexed
                            </span>
                        </div>
                    </div>

                    <div className="p-2 bg-slate-800/50 rounded-lg">
                        <Brain className="w-6 h-6 text-amber-400" />
                    </div>
                </div>

                <div className="w-full bg-slate-800/50 rounded-full h-3.5 p-1 mb-4">
                    <div
                        className="bg-linear-to-r from-amber-400 via-orange-500 to-amber-400 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <p className="text-slate-400 text-xs italic">
                    AI Engine is optimized and ready for queries
                </p>
            </CardContent>
        </Card>
    );
}