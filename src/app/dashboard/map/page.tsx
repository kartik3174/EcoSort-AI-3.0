"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mapReportsData } from "@/lib/data";
import { Filter, MapPin, AlertTriangle, Layers } from "lucide-react";
import { useState } from "react";

const MapComponent = dynamic(() => import("@/components/dashboard/map-view"), { ssr: false });

const wasteTypes = ["All", "Plastic", "Organic", "Glass", "Electronic", "Hazardous"];
const severityColors: Record<string, string> = {
    Low: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    Medium: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    High: "border-orange-500/30 text-orange-400 bg-orange-500/10",
    Critical: "border-rose-500/30 text-rose-400 bg-rose-500/10",
};

export default function MapPage() {
    const [selectedType, setSelectedType] = useState("All");
    const [showHeatmap, setShowHeatmap] = useState(false);

    const filteredReports = selectedType === "All"
        ? mapReportsData
        : mapReportsData.filter(r => r.category === selectedType);

    const hazardousCount = mapReportsData.filter(r => r.category === "Hazardous").length;
    const criticalCount = mapReportsData.filter(r => r.severity === "Critical").length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Smart Waste Map
                    </h1>
                    <p className="text-sm text-white/40 mt-1">Real-time waste report visualization</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-[160px] h-9 bg-white/[0.04] border-white/[0.08] text-sm">
                            <Filter className="w-3.5 h-3.5 mr-2 text-white/40" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[hsl(220,20%,12%)] border-white/[0.08]">
                            {wasteTypes.map(type => (
                                <SelectItem key={type} value={type} className="text-white/70 focus:bg-white/[0.06] focus:text-white">
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant={showHeatmap ? "default" : "outline"}
                        size="sm"
                        className={showHeatmap ? "gradient-primary text-white" : "border-white/[0.08] text-white/50 hover:text-white"}
                        onClick={() => setShowHeatmap(!showHeatmap)}
                    >
                        <Layers className="w-3.5 h-3.5 mr-1.5" /> Heatmap
                    </Button>
                </div>
            </div>

            {/* Alert Banner */}
            {criticalCount > 0 && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3"
                >
                    <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                    <span className="text-xs text-rose-300">
                        <strong>{criticalCount} critical</strong> hazardous waste alert(s) require immediate attention
                    </span>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Map */}
                <div className="lg:col-span-3">
                    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
                        <CardContent className="p-0">
                            <div className="h-[600px]">
                                <MapComponent reports={filteredReports} showHeatmap={showHeatmap} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Report Sidebar */}
                <div className="space-y-4">
                    {/* Stats */}
                    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-white/50">Total Reports</span>
                                <span className="text-lg font-bold text-white">{filteredReports.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-white/50">Hazardous</span>
                                <Badge variant="outline" className="border-rose-500/30 text-rose-400 bg-rose-500/10 text-[10px]">
                                    {hazardousCount} alerts
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Report List */}
                    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold text-white">Recent Reports</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 max-h-[420px] overflow-y-auto scrollbar-thin space-y-2">
                            {filteredReports.map((report) => (
                                <motion.div
                                    key={report.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-emerald-500/20 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-white/80 truncate">{report.location}</span>
                                        <Badge variant="outline" className={`text-[9px] ${severityColors[report.severity]}`}>
                                            {report.severity}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-[9px] bg-white/[0.05] text-white/50 truncate">
                                            {report.category}
                                        </Badge>
                                        <span className="text-[10px] text-white/30">{report.date}</span>
                                    </div>
                                    <p className="text-[10px] text-white/30 mt-1 line-clamp-2">{report.description}</p>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
