"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BarChart3, TrendingUp, Recycle, Clock, AlertTriangle, Percent,
} from "lucide-react";
import {
    wasteTypeDistribution, dailyReportsData, areaChartData, trendsChartData,
    monthlyWasteTrends, hazardousIncidents,
} from "@/lib/data";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, Legend,
    RadialBarChart, RadialBar,
} from "recharts";

const tooltipStyle = {
    backgroundColor: "hsl(220, 20%, 12%)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "white",
    fontSize: "12px",
};

const metrics = [
    { label: "Plastic Waste", value: "35%", icon: Recycle, color: "emerald", trend: "+2.3%" },
    { label: "Recycling Rate", value: "65%", icon: Percent, color: "violet", trend: "+5.1%" },
    { label: "Monthly Reports", value: "3,456", icon: BarChart3, color: "blue", trend: "+12%" },
    { label: "Avg Response", value: "2.4 hrs", icon: Clock, color: "amber", trend: "-8%" },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AnalyticsPage() {
    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Analytics Dashboard
                </h1>
                <p className="text-sm text-white/40 mt-1">Advanced waste management analytics and insights</p>
            </motion.div>

            {/* Top Metrics */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric) => (
                    <Card key={metric.label} className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <metric.icon className={`w-4 h-4 text-${metric.color}-400`} />
                                <span className={`text-[10px] font-medium ${metric.trend.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>
                                    {metric.trend}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                {metric.value}
                            </p>
                            <p className="text-[11px] text-white/40 mt-0.5">{metric.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>

            {/* Charts */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="bg-white/[0.04] border border-white/[0.06] p-1">
                    <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="waste-types" className="text-xs data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">
                        Waste Types
                    </TabsTrigger>
                    <TabsTrigger value="hazardous" className="text-xs data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">
                        Hazardous
                    </TabsTrigger>
                    <TabsTrigger value="areas" className="text-xs data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">
                        Area-wise
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Daily Reports */}
                        <motion.div variants={itemVariants}>
                            <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-semibold text-white">Daily Reports Trend</CardTitle>
                                    <p className="text-xs text-white/40">Reports vs resolved</p>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={dailyReportsData}>
                                                <defs>
                                                    <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={tooltipStyle} />
                                                <Area type="monotone" dataKey="reports" stroke="#10b981" strokeWidth={2} fill="url(#rg)" />
                                                <Area type="monotone" dataKey="resolved" stroke="#8b5cf6" strokeWidth={2} fill="none" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Monthly Trends */}
                        <motion.div variants={itemVariants}>
                            <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-semibold text-white">Monthly Trends</CardTitle>
                                    <p className="text-xs text-white/40">12-month overview</p>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={trendsChartData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={tooltipStyle} />
                                                <Line type="monotone" dataKey="reports" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 3 }} />
                                                <Line type="monotone" dataKey="hazardous" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 3 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </TabsContent>

                {/* Waste Types Tab */}
                <TabsContent value="waste-types">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-white">Waste Type Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={wasteTypeDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value">
                                                {wasteTypeDistribution.map((entry, i) => (<Cell key={i} fill={entry.fill} />))}
                                            </Pie>
                                            <Tooltip contentStyle={tooltipStyle} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    {wasteTypeDistribution.map(item => (
                                        <div key={item.name} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                                            <span className="text-xs text-white/60">{item.name}</span>
                                            <span className="text-xs font-bold text-white/80 ml-auto">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-white">Monthly Waste by Type</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={monthlyWasteTrends}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                            <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={tooltipStyle} />
                                            <Bar dataKey="plastic" fill="#10b981" radius={[2, 2, 0, 0]} />
                                            <Bar dataKey="organic" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                                            <Bar dataKey="glass" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                                            <Bar dataKey="electronic" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                                            <Bar dataKey="hazardous" fill="#ef4444" radius={[2, 2, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Hazardous Tab */}
                <TabsContent value="hazardous">
                    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                                        Hazardous Waste Incidents
                                    </CardTitle>
                                    <p className="text-xs text-white/40 mt-0.5">Monthly breakdown by type</p>
                                </div>
                                <Badge variant="outline" className="border-rose-500/30 text-rose-400 bg-rose-500/10 text-[10px]">
                                    Trending Up
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={hazardousIncidents}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={tooltipStyle} />
                                        <Legend wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }} />
                                        <Bar dataKey="chemical" fill="#ef4444" name="Chemical" radius={[2, 2, 0, 0]} />
                                        <Bar dataKey="medical" fill="#f59e0b" name="Medical" radius={[2, 2, 0, 0]} />
                                        <Bar dataKey="electronic" fill="#8b5cf6" name="Electronic" radius={[2, 2, 0, 0]} />
                                        <Bar dataKey="other" fill="#6b7280" name="Other" radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Area-wise Tab */}
                <TabsContent value="areas">
                    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-white">Area-wise Waste Density</CardTitle>
                            <p className="text-xs text-white/40">Reports vs cleaned by area</p>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={areaChartData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                        <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <YAxis type="category" dataKey="area" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
                                        <Tooltip contentStyle={tooltipStyle} />
                                        <Bar dataKey="reports" fill="#10b981" name="Reports" radius={[0, 4, 4, 0]} barSize={12} />
                                        <Bar dataKey="cleaned" fill="#8b5cf6" name="Cleaned" radius={[0, 4, 4, 0]} barSize={12} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
}
