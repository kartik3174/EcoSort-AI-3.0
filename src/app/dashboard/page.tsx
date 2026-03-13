"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FileText, AlertTriangle, Users, Leaf, TrendingUp, TrendingDown,
    ArrowUpRight, ArrowDownRight, MapPin, Zap, Recycle, BarChart3,
} from "lucide-react";
import { dashboardStats, dailyReportsData, wasteTypeDistribution, mapReportsData } from "@/lib/data";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const iconMap: Record<string, any> = {
    FileText, AlertTriangle, Users, Leaf,
};

const colorMap: Record<string, string> = {
    emerald: "from-emerald-500/20 to-emerald-500/5",
    rose: "from-rose-500/20 to-rose-500/5",
    violet: "from-violet-500/20 to-violet-500/5",
    teal: "from-teal-500/20 to-teal-500/5",
};

const iconColorMap: Record<string, string> = {
    emerald: "text-emerald-400 bg-emerald-500/10",
    rose: "text-rose-400 bg-rose-500/10",
    violet: "text-violet-400 bg-violet-500/10",
    teal: "text-teal-400 bg-teal-500/10",
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState([
        { title: "Total Reports Today", value: "0", change: "0%", icon: "FileText", color: "emerald" },
        { title: "Hazardous Alerts", value: "0", change: "0%", icon: "AlertTriangle", color: "rose" },
        { title: "Active Citizens", value: "0", change: "0%", icon: "Users", color: "violet" },
        { title: "My Eco Score", value: "0", change: "0%", icon: "Leaf", color: "teal" },
    ]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const reportsQuery = query(collection(db, "reports"));
        const unsubscribe = onSnapshot(reportsQuery, (snapshot) => {
            const allReports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReports(allReports);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const reportsToday = allReports.filter((r: any) => {
                const createdAt = r.createdAt?.toDate();
                return createdAt >= today;
            }).length;

            const hazardousCount = allReports.filter((r: any) => r.category === "hazardous").length;

            // For demo purposes, we'll use a fixed number for users or count unique IDs in reports
            const uniqueCitizens = new Set(allReports.map((r: any) => r.userId)).size;

            const userReports = allReports.filter((r: any) => r.userId === user?.uid);
            const userScore = userReports.length * 50;

            setStats([
                { title: "Total Reports Today", value: reportsToday.toString(), change: "+0%", icon: "FileText", color: "emerald" },
                { title: "Hazardous Alerts", value: hazardousCount.toString(), change: "0%", icon: "AlertTriangle", color: "rose" },
                { title: "Active Citizens", value: uniqueCitizens.toString(), change: "0%", icon: "Users", color: "violet" },
                { title: "My Eco Score", value: userScore.toString(), change: "0%", icon: "Leaf", color: "teal" },
            ]);

            // Map some reports to activity
            const activity = allReports.slice(0, 5).map((r: any) => ({
                action: `New ${r.category} report`,
                location: r.location,
                time: r.createdAt?.toDate().toLocaleTimeString() || "Just now",
                type: r.category === 'hazardous' ? 'alert' : 'report'
            }));
            setRecentActivity(activity);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (authLoading || loading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
            </div>
        );
    }

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            {/* Header */}
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Dashboard Overview
                </h1>
                <p className="text-sm text-white/40 mt-1">Real-time waste management insights for your city</p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => {
                    const Icon = iconMap[stat.icon];
                    const isPositive = stat.change.startsWith("+");
                    return (
                        <motion.div
                            key={stat.title}
                            whileHover={{ y: -8, scale: 1.03 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                            <Card className={`relative overflow-hidden border-[1px] border-white/[0.1] bg-gradient-to-br ${colorMap[stat.color]} backdrop-blur-xl shadow-xl hover:shadow-[0_0_40px_rgba(var(--primary),0.1)] transition-all duration-300 ease-in-out group`}>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.03] rounded-full -translate-y-8 translate-x-8 group-hover:scale-125 transition-transform duration-500" />
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-white/50 uppercase tracking-wider">{stat.title}</p>
                                            <p className="text-3xl font-bold text-white mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                                {stat.value}
                                            </p>
                                            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                                                {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                {stat.change} from yesterday
                                            </div>
                                        </div>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColorMap[stat.color]}`}>
                                            {Icon && <Icon className="w-5 h-5" />}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Daily Reports Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className="border-white/[0.1] bg-white/[0.02] backdrop-blur-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] transition-all duration-500 overflow-hidden relative">
                         <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-teal-500/0 opacity-0 hover:opacity-100 transition-opacity duration-700 blur" />
                        <CardHeader className="pb-2 relative z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-sm font-semibold text-white">Daily Waste Reports</CardTitle>
                                    <p className="text-xs text-white/40 mt-0.5">Live platform activity</p>
                                </div>
                                <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px]">
                                    <TrendingUp className="w-3 h-3 mr-1" /> Live
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="h-[280px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={reports.length > 0 ? Array.from({ length: 7 }, (_, i) => {
                                        const d = new Date();
                                        d.setDate(d.getDate() - (6 - i));
                                        const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
                                        const count = reports.filter(r => {
                                            const rd = r.createdAt?.toDate();
                                            return rd && rd.toDateString() === d.toDateString();
                                        }).length;
                                        return { date: dateStr, reports: count, resolved: 0 };
                                    }) : dailyReportsData.map(d => ({ ...d, reports: 0, resolved: 0 }))}>
                                        <defs>
                                            <linearGradient id="reportGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="hsl(152, 68%, 50%)" stopOpacity={0.3} />
                                                <stop offset="100%" stopColor="hsl(152, 68%, 50%)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "hsl(220, 20%, 12%)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: "12px",
                                                color: "white",
                                                fontSize: "12px",
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="reports"
                                            stroke="hsl(152, 68%, 50%)"
                                            strokeWidth={2}
                                            fill="url(#reportGradient)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Waste Distribution */}
                <motion.div variants={itemVariants}>
                    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-white">Waste Distribution</CardTitle>
                            <p className="text-xs text-white/40">By real reports</p>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={reports.length > 0 ? [
                                                { name: "Plastic", value: reports.filter(r => r.category === 'plastic').length, fill: "hsl(152, 68%, 50%)" },
                                                { name: "Organic", value: reports.filter(r => r.category === 'organic').length, fill: "hsl(30, 95%, 55%)" },
                                                { name: "Glass", value: reports.filter(r => r.category === 'glass').length, fill: "hsl(200, 80%, 55%)" },
                                                { name: "Electronic", value: reports.filter(r => r.category === 'electronic').length, fill: "hsl(262, 68%, 60%)" },
                                                { name: "Hazardous", value: reports.filter(r => r.category === 'hazardous').length, fill: "hsl(0, 72%, 51%)" },
                                            ] : [
                                                { name: "No Data", value: 1, fill: "rgba(255,255,255,0.05)" }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={80}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {(reports.length > 0 ? [
                                                { name: "Plastic", value: reports.filter(r => r.category === 'plastic').length, fill: "hsl(152, 68%, 50%)" },
                                                { name: "Organic", value: reports.filter(r => r.category === 'organic').length, fill: "hsl(30, 95%, 55%)" },
                                                { name: "Glass", value: reports.filter(r => r.category === 'glass').length, fill: "hsl(200, 80%, 55%)" },
                                                { name: "Electronic", value: reports.filter(r => r.category === 'electronic').length, fill: "hsl(262, 68%, 60%)" },
                                                { name: "Hazardous", value: reports.filter(r => r.category === 'hazardous').length, fill: "hsl(0, 72%, 51%)" },
                                            ] : []).map((entry, index) => (
                                                <Cell key={index} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "hsl(220, 20%, 12%)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: "12px",
                                                color: "white",
                                                fontSize: "12px",
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {(reports.length > 0 ? [
                                    { name: "Plastic", value: reports.filter(r => r.category === 'plastic').length, fill: "hsl(152, 68%, 50%)" },
                                    { name: "Organic", value: reports.filter(r => r.category === 'organic').length, fill: "hsl(30, 95%, 55%)" },
                                    { name: "Glass", value: reports.filter(r => r.category === 'glass').length, fill: "hsl(200, 80%, 55%)" },
                                    { name: "Electronic", value: reports.filter(r => r.category === 'electronic').length, fill: "hsl(262, 68%, 60%)" },
                                    { name: "Hazardous", value: reports.filter(r => r.category === 'hazardous').length, fill: "hsl(0, 72%, 51%)" },
                                ] : [
                                    { name: "Plastic", value: 0, fill: "hsl(152, 68%, 50%)" },
                                    { name: "Organic", value: 0, fill: "hsl(30, 95%, 55%)" },
                                    { name: "Glass", value: 0, fill: "hsl(200, 80%, 55%)" },
                                    { name: "Electronic", value: 0, fill: "hsl(262, 68%, 60%)" },
                                    { name: "Hazardous", value: 0, fill: "hsl(0, 72%, 51%)" },
                                ]).map((item) => (
                                    <div key={item.name} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                                        <span className="text-[11px] text-white/50">{item.name}</span>
                                        <span className="text-[11px] text-white/70 font-medium ml-auto">{reports.length > 0 ? Math.round((item.value / reports.length) * 100) : 0}%</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Recent Activity */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                    <Card className="border-white/[0.1] bg-white/[0.02] backdrop-blur-xl h-full hover:border-white/[0.15] hover:shadow-lg transition-all duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-white">Recent Activity</CardTitle>
                            <p className="text-xs text-white/40">Latest platform updates</p>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-3">
                                {recentActivity.map((activity, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors"
                                    >
                                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activity.type === "alert" ? "bg-rose-400" :
                                            activity.type === "cleanup" ? "bg-emerald-400" :
                                                activity.type === "verified" ? "bg-blue-400" :
                                                    "bg-violet-400"
                                            }`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-white/80">{activity.action}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <MapPin className="w-2.5 h-2.5 text-white/30" />
                                                <span className="text-[10px] text-white/40">{activity.location}</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-white/25 whitespace-nowrap">{activity.time}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Hazardous Alerts */}
                <motion.div variants={itemVariants}>
                    <Card className="border-white/[0.1] bg-white/[0.02] backdrop-blur-xl h-full hover:border-rose-500/20 hover:shadow-[0_0_20px_rgba(225,29,72,0.1)] transition-all duration-300">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-semibold text-white">Hazardous Alerts</CardTitle>
                                <Badge variant="destructive" className="text-[10px] animate-pulse">
                                    {reports.filter(r => r.category === 'hazardous').length} Active
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-2">
                                {reports.filter(r => r.category === 'hazardous').slice(0, 4).map((alert: any) => (
                                    <div key={alert.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-rose-500/20 transition-colors">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-medium text-white/80">{alert.category}</span>
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] ${alert.severity === "critical" ? "border-rose-500/30 text-rose-400 bg-rose-500/10" :
                                                    alert.severity === "high" ? "border-amber-500/30 text-amber-400 bg-amber-500/10" :
                                                        "border-blue-500/30 text-blue-400 bg-blue-500/10"
                                                    }`}
                                            >
                                                {alert.severity}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-2.5 h-2.5 text-white/30" />
                                            <span className="text-[11px] text-white/40">{alert.location}</span>
                                            <span className="text-[10px] text-white/20 ml-auto">{alert.createdAt?.toDate().toLocaleTimeString() || "Live"}</span>
                                        </div>
                                    </div>
                                ))}
                                {reports.filter(r => r.category === 'hazardous').length === 0 && (
                                    <p className="text-xs text-center text-white/20 py-8">No active hazardous alerts</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Quick Stats */}
                <motion.div variants={itemVariants}>
                    <Card className="border-white/[0.1] bg-white/[0.02] backdrop-blur-xl h-full hover:border-white/[0.15] hover:shadow-lg transition-all duration-300">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-white">Quick Metrics</CardTitle>
                            <p className="text-xs text-white/40">Platform performance</p>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-4">
                            {[
                                { label: "Cleanup Efficiency", value: "87%", color: "bg-emerald-500", width: "87%" },
                                { label: "Recycling Rate", value: "65%", color: "bg-violet-500", width: "65%" },
                                { label: "Response Time", value: "2.4 hrs", color: "bg-amber-500", width: "76%" },
                                { label: "Citizen Satisfaction", value: "94%", color: "bg-blue-500", width: "94%" },
                            ].map((metric) => (
                                <div key={metric.label}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-xs text-white/50">{metric.label}</span>
                                        <span className="text-xs font-semibold text-white/80">{metric.value}</span>
                                    </div>
                                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full ${metric.color}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: metric.width }}
                                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
