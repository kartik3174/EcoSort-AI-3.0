"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
    ShieldCheck, ClipboardList, AlertTriangle, Users, Truck, Calendar,
    TrendingUp, MapPin, Clock, CheckCircle, XCircle, Eye, BarChart3,
    Zap, Target, Loader2, Sparkles, Send,
} from "lucide-react";
import {
    allReportsData, alertsData, cleanupTasksData, activeTeams,
    wasteCollectionSchedule, predictedWasteZones, futureWasteProjection,
    areaChartData,
} from "@/lib/data";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, LineChart, Line, Legend,
} from "recharts";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { useState, useEffect } from "react";

const tooltipStyle = {
    backgroundColor: "hsl(220, 20%, 12%)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "white",
    fontSize: "12px",
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const statusColors: Record<string, string> = {
    "Pending": "border-amber-500/30 text-amber-400 bg-amber-500/10",
    "In Progress": "border-blue-500/30 text-blue-400 bg-blue-500/10",
    "Cleaned": "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    "Pending Assignment": "border-amber-500/30 text-amber-400 bg-amber-500/10",
    "Completed": "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
};

const priorityColors: Record<string, string> = {
    "Critical": "border-rose-500/30 text-rose-400 bg-rose-500/10",
    "High": "border-orange-500/30 text-orange-400 bg-orange-500/10",
    "Medium": "border-amber-500/30 text-amber-400 bg-amber-500/10",
    "Low": "border-blue-500/30 text-blue-400 bg-blue-500/10",
};

export default function AdminPage() {
    const { role, loading: authLoading } = useAuth();
    const router = useRouter();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([
        { label: "Total Reports", value: "0", icon: ClipboardList, color: "emerald" },
        { label: "Pending", value: "0", icon: Clock, color: "amber" },
        { label: "Hazard Alerts", value: "0", icon: AlertTriangle, color: "rose" },
        { label: "Active Teams", value: "0", icon: Users, color: "blue" },
        { label: "Efficiency", value: "0%", icon: Target, color: "violet" },
    ]);

    useEffect(() => {
        if (!authLoading && role !== "official") {
            router.push("/dashboard");
        }
    }, [role, authLoading, router]);

    useEffect(() => {
        const reportsQuery = query(collection(db, "reports"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(reportsQuery, (snapshot) => {
            const allReports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReports(allReports);

            const pendingCount = allReports.filter((r: any) => r.status === "Pending").length;
            const hazardousCount = allReports.filter((r: any) => r.category === "hazardous").length;
            const activeTeamsCount = 0; // Still no real teams collection yet
            const efficiency = allReports.length > 0 ? Math.round((allReports.filter((r: any) => r.status === "Cleaned").length / allReports.length) * 100) : 0;

            setStats([
                { label: "Total Reports", value: allReports.length.toLocaleString(), icon: ClipboardList, color: "emerald" },
                { label: "Pending", value: pendingCount.toString(), icon: Clock, color: "amber" },
                { label: "Hazard Alerts", value: hazardousCount.toString(), icon: AlertTriangle, color: "rose" },
                { label: "Active Teams", value: activeTeamsCount.toString(), icon: Users, color: "blue" },
                { label: "Efficiency", value: `${efficiency}%`, icon: Target, color: "violet" },
            ]);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (authLoading || loading || role !== "official") {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
            </div>
        );
    }

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <ShieldCheck className="w-7 h-7 text-violet-400" />
                    Admin Panel
                </h1>
                <p className="text-sm text-white/40 mt-1">City waste management control center — Officials only</p>
            </motion.div>

            {/* Admin Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                        <CardContent className="p-4">
                            <stat.icon className={`w-4 h-4 text-${stat.color}-400 mb-2`} />
                            <p className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                {stat.value}
                            </p>
                            <p className="text-[10px] text-white/40">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>

            <Tabs defaultValue="reports" className="space-y-4">
                <TabsList className="bg-white/[0.04] border border-white/[0.06] p-1 flex-wrap">
                    <TabsTrigger value="reports" className="text-xs data-[state=active]:bg-violet-500/15 data-[state=active]:text-violet-400">
                        Reports
                    </TabsTrigger>
                    <TabsTrigger value="teams" className="text-xs data-[state=active]:bg-violet-500/15 data-[state=active]:text-violet-400">
                        Teams & Cleanup
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="text-xs data-[state=active]:bg-violet-500/15 data-[state=active]:text-violet-400">
                        Schedule
                    </TabsTrigger>
                    <TabsTrigger value="predictions" className="text-xs data-[state=active]:bg-violet-500/15 data-[state=active]:text-violet-400">
                        AI Predictions
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="text-xs data-[state=active]:bg-violet-500/15 data-[state=active]:text-violet-400">
                        Analytics
                    </TabsTrigger>
                </TabsList>

                {/* Reports Tab */}
                <TabsContent value="reports">
                    <motion.div variants={itemVariants}>
                        <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-semibold text-white">All Waste Reports</CardTitle>
                                    <Select defaultValue="all">
                                        <SelectTrigger className="w-32 h-8 bg-white/[0.04] border-white/[0.08] text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[hsl(220,20%,12%)] border-white/[0.08]">
                                            <SelectItem value="all" className="text-white/70 focus:bg-white/[0.06] text-xs">All</SelectItem>
                                            <SelectItem value="pending" className="text-white/70 focus:bg-white/[0.06] text-xs">Pending</SelectItem>
                                            <SelectItem value="progress" className="text-white/70 focus:bg-white/[0.06] text-xs">In Progress</SelectItem>
                                            <SelectItem value="cleaned" className="text-white/70 focus:bg-white/[0.06] text-xs">Cleaned</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="divide-y divide-white/[0.04]">
                                    {reports.map((report) => (
                                        <div key={report.id} className="flex items-center gap-4 py-3 hover:bg-white/[0.01] transition-colors">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
                                                {report.image ? (
                                                    <img src={report.image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="text-[10px] text-white/20 uppercase tracking-tighter">No Image</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-medium text-white/80">{report.location}</span>
                                                    <Badge variant="outline" className={`text-[9px] ${statusColors[report.status]}`}>
                                                        {report.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] text-white/30">{report.id.substring(0, 8)}</span>
                                                    <span className="text-[10px] text-white/20">•</span>
                                                    <span className="text-[10px] text-white/30 capitalize">{report.category}</span>
                                                    <span className="text-[10px] text-white/20">•</span>
                                                    <span className="text-[10px] text-white/30">{report.createdAt?.toDate().toLocaleTimeString() || "Live"}</span>
                                                    {report.isAIScan && (
                                                        <>
                                                            <span className="text-[10px] text-white/20">•</span>
                                                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[8px] flex items-center gap-1">
                                                                <Sparkles className="w-2 h-2" /> AI SCAN
                                                            </Badge>
                                                        </>
                                                    )}
                                                </div>
                                                {report.description && (
                                                    <p className="text-[10px] text-white/40 mt-1 line-clamp-1 italic">
                                                        {report.description}
                                                    </p>
                                                )}
                                            </div>
                                            <Badge variant="outline" className={`text-[9px] capitalize ${priorityColors[report.priority || 'normal'] || ""}`}>
                                                {report.priority || 'normal'}
                                            </Badge>
                                            <div className="flex gap-1">
                                                <Button size="icon" variant="ghost" className="h-7 w-7 text-white/30 hover:text-emerald-400 hover:bg-emerald-500/10">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-7 w-7 text-white/30 hover:text-blue-400 hover:bg-blue-500/10">
                                                    <Eye className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {reports.length === 0 && (
                                        <div className="py-20 text-center">
                                            <p className="text-sm text-white/20">No reports found. New citizen reports will appear here automatically.</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                {/* Teams Tab */}
                <TabsContent value="teams">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <motion.div variants={itemVariants}>
                            <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-semibold text-white">Active Teams</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-2">
                                    {activeTeams.map((team) => (
                                        <div key={team.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-violet-500/20 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-semibold text-white">{team.name}</span>
                                                <Badge variant="outline" className={`text-[9px] ${team.status === "On Field" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" :
                                                    team.status === "Standby" ? "border-amber-500/30 text-amber-400 bg-amber-500/10" :
                                                        "border-white/10 text-white/30 bg-white/5"
                                                    }`}>
                                                    {team.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] text-white/40">
                                                <span><Users className="w-3 h-3 inline mr-1" />{team.members} members</span>
                                                <span><MapPin className="w-3 h-3 inline mr-1" />{team.activeArea}</span>
                                                <span><CheckCircle className="w-3 h-3 inline mr-1" />{team.tasksCompleted} done</span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-semibold text-white">Cleanup Tasks</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-2">
                                    {cleanupTasksData.map((task) => (
                                        <div key={task.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium text-white/80">{task.location}</span>
                                                <Badge variant="outline" className={`text-[9px] ${statusColors[task.status]}`}>
                                                    {task.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-white/40">
                                                <span>Assigned: {task.assignedTo}</span>
                                                <span>•</span>
                                                <Badge variant="outline" className={`text-[9px] ${priorityColors[task.priority]}`}>{task.priority}</Badge>
                                            </div>
                                            {task.status === "Pending Assignment" && (
                                                <Button size="sm" className="mt-2 h-7 text-xs gradient-accent text-white border-0">
                                                    <Truck className="w-3 h-3 mr-1" /> Assign Team
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </TabsContent>

                {/* Schedule Tab */}
                <TabsContent value="schedule">
                    <motion.div variants={itemVariants}>
                        <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-violet-400" /> Waste Collection Schedule
                                    </CardTitle>
                                    <Button size="sm" className="gradient-accent text-white border-0 text-xs h-8">
                                        + Add Schedule
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="divide-y divide-white/[0.04]">
                                    <div className="grid grid-cols-6 gap-4 py-2 text-[10px] text-white/30 uppercase tracking-wider font-medium">
                                        <div>Area</div>
                                        <div>Days</div>
                                        <div>Time</div>
                                        <div>Team</div>
                                        <div>Type</div>
                                        <div>Actions</div>
                                    </div>
                                    {wasteCollectionSchedule.map((schedule) => (
                                        <div key={schedule.id} className="grid grid-cols-6 gap-4 py-3 items-center text-xs">
                                            <div className="text-white/80 font-medium">{schedule.area}</div>
                                            <div className="text-white/50">{schedule.day}</div>
                                            <div className="text-white/50">{schedule.time}</div>
                                            <div className="text-white/50">{schedule.team}</div>
                                            <div>
                                                <Badge variant="outline" className={`text-[9px] ${schedule.type === "Hazardous" ? "border-rose-500/30 text-rose-400 bg-rose-500/10" :
                                                    schedule.type === "Recyclable" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" :
                                                        "border-white/10 text-white/40 bg-white/5"
                                                    }`}>
                                                    {schedule.type}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px] text-white/30 hover:text-white">
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                {/* AI Predictions Tab */}
                <TabsContent value="predictions">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <motion.div variants={itemVariants}>
                            <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-amber-400" /> Waste Generation Forecast
                                    </CardTitle>
                                    <p className="text-xs text-white/40">Actual vs predicted waste reports</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={futureWasteProjection}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                                <XAxis dataKey="week" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={tooltipStyle} />
                                                <Legend wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }} />
                                                <Line type="monotone" dataKey="actual" name="Actual" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} connectNulls={false} />
                                                <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "#f59e0b", r: 4 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                                        <Target className="w-4 h-4 text-rose-400" /> High-Risk Zones
                                    </CardTitle>
                                    <p className="text-xs text-white/40">Predicted waste hotspots</p>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-2">
                                    {predictedWasteZones.map((zone) => (
                                        <div key={zone.area} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium text-white/80">{zone.area}</span>
                                                <Badge variant="outline" className={`text-[9px] ${zone.riskLevel === "Critical" ? "border-rose-500/30 text-rose-400 bg-rose-500/10" :
                                                    zone.riskLevel === "High" ? "border-orange-500/30 text-orange-400 bg-orange-500/10" :
                                                        zone.riskLevel === "Medium" ? "border-amber-500/30 text-amber-400 bg-amber-500/10" :
                                                            "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                                                    }`}>
                                                    {zone.riskLevel}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 text-[10px] text-white/40 mt-1">
                                                <span>Load: {zone.currentLoad}</span>
                                                <span>•</span>
                                                <span className="text-amber-400">↑ {zone.predictedIncrease}% predicted increase</span>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-white">Cleanup Efficiency by Area</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={areaChartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                            <XAxis dataKey="area" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={tooltipStyle} />
                                            <Legend wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }} />
                                            <Bar dataKey="reports" fill="#10b981" name="Reports" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="cleaned" fill="#8b5cf6" name="Cleaned" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold text-white">Citizen Engagement</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                {[
                                    { label: "Active reporters this month", value: "1,842", change: "+12%" },
                                    { label: "New signups this week", value: "156", change: "+8%" },
                                    { label: "Cleanup event participation", value: "89%", change: "+5%" },
                                    { label: "Average reports per citizen", value: "3.2", change: "+15%" },
                                    { label: "Repeat contributors", value: "67%", change: "+3%" },
                                ].map((metric) => (
                                    <div key={metric.label} className="flex items-center justify-between py-2">
                                        <span className="text-xs text-white/50">{metric.label}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-white">{metric.value}</span>
                                            <span className="text-[10px] text-emerald-400">{metric.change}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
}
