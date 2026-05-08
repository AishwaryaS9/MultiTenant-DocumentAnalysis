import React from 'react'
import { Card, CardContent } from '../ui/card'

const StatCard = ({ title, value, icon, description, gradient }: { title: string; value: string | number; icon: React.ReactNode; description?: string; gradient?: string }) => {
    return (
        <Card className={`border-slate-200/60 shadow-xl shadow-slate-100/40 hover:shadow-2xl hover:shadow-slate-200 transition-all rounded-3xl group overflow-hidden bg-white ${gradient}`}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all">
                        {icon}
                    </div>
                </div>
                <div>
                    <div className="text-4xl font-black text-slate-900 tracking-tighter">{value}</div>
                    <p className="text-sm font-bold text-slate-500 mt-1">{title}</p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}

export default StatCard