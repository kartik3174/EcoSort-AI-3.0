"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trash2, Recycle, Wind, Users, TrendingUp, Leaf, Globe } from "lucide-react";
import { impactMetrics, impactOverTime } from "@/lib/data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const iconMap: Record<string, any> = { Trash2, Recycle, Wind, Users };
const colorMap: Record<string, string> = {
    emerald: "text-emerald-400 bg-emerald-500/10",
    blue: "text-blue-400 bg-blue-500/10",
    teal: "text-teal-400 bg-teal-500/10",
    violet: "text-violet-400 bg-violet-500/10",
};
const progressColorMap: Record<string, string> = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    teal: "bg-teal-500",
    violet: "bg-violet-500",
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ImpactPage() {
    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <Globe className="w-7 h-7 text-teal-400" />
                    Environmental Impact
                </h1>
                <p className="text-sm text-white/40 mt-1">Measuring our collective contribution to a cleaner planet</p>
            </motion.div>

            {/* Impact Metrics */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {impactMetrics.map((metric, i) => {
                    const Icon = iconMap[metric.icon] || Leaf;
                    return (
                        <motion.div
                            key={metric.label}
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
                                <CardContent className="p-5">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[metric.color]}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider">{metric.label}</p>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <motion.span
                                            className="text-2xl font-bold text-white"
                                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            {metric.value}
                                        </motion.span>
                                        <span className="text-xs text-white/30">{metric.unit}</span>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between text-[10px] mb-1">
                                            <span className="text-white/30">Target Progress</span>
                                            <span className="text-white/50">{metric.progress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full rounded-full ${progressColorMap[metric.color]}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${metric.progress}%` }}
                                                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 + i * 0.1 }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Impact Over Time */}
            <motion.div variants={itemVariants}>
                <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-white">Impact Over Time</CardTitle>
                        <p className="text-xs text-white/40">Monthly environmental contribution metrics</p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={impactOverTime}>
                                    <defs>
                                        <linearGradient id="wc" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="pr" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="co" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                    <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{
                                        backgroundColor: "hsl(220, 20%, 12%)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "12px",
                                        color: "white",
                                        fontSize: "12px",
                                    }} />
                                    <Legend wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }} />
                                    <Area type="monotone" dataKey="wasteCollected" name="Waste Collected (T)" stroke="#10b981" strokeWidth={2} fill="url(#wc)" />
                                    <Area type="monotone" dataKey="plasticRecycled" name="Plastic Recycled (T)" stroke="#3b82f6" strokeWidth={2} fill="url(#pr)" />
                                    <Area type="monotone" dataKey="co2Prevented" name="CO₂ Prevented (T)" stroke="#14b8a6" strokeWidth={2} fill="url(#co)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Summary Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { title: "Trees Equivalent", value: "847", subtitle: "Trees' worth of CO₂ absorbed", icon: Leaf, gradient: "from-emerald-500/20 to-emerald-700/20" },
                    { title: "Clean Water", value: "2.1M", subtitle: "Liters of water protected", icon: Wind, gradient: "from-blue-500/20 to-blue-700/20" },
                    { title: "Community Hours", value: "5,280", subtitle: "Volunteer hours contributed", icon: Users, gradient: "from-violet-500/20 to-violet-700/20" },
                ].map((card) => (
                    <Card key={card.title} className={`border-white/[0.06] bg-gradient-to-br ${card.gradient} backdrop-blur-xl`}>
                        <CardContent className="p-5 text-center">
                            <card.icon className="w-8 h-8 text-white/60 mx-auto mb-3" />
                            <p className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                {card.value}
                            </p>
                            <p className="text-xs text-white/40 mt-1">{card.subtitle}</p>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>
        </motion.div>
    );
}
