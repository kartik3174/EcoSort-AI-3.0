"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gift, Shield, Sword, Trophy, Crown, AlertTriangle, Users, Star, Zap } from "lucide-react";
import { badges, rewardsHistory } from "@/lib/data";

const iconMap: Record<string, any> = { Shield, Sword, Trophy, Crown, AlertTriangle, Users };
const colorMap: Record<string, string> = {
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20",
    violet: "from-violet-500/20 to-violet-500/5 border-violet-500/20",
    rose: "from-rose-500/20 to-rose-500/5 border-rose-500/20",
    teal: "from-teal-500/20 to-teal-500/5 border-teal-500/20",
};
const iconColorMap: Record<string, string> = {
    emerald: "text-emerald-400",
    blue: "text-blue-400",
    amber: "text-amber-400",
    violet: "text-violet-400",
    rose: "text-rose-400",
    teal: "text-teal-400",
};

export default function RewardsPage() {
    const totalPoints = 4850;
    const nextMilestone = 5000;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <Gift className="w-7 h-7 text-emerald-400" />
                    Rewards & Badges
                </h1>
                <p className="text-sm text-white/40 mt-1">Earn eco points and unlock badges for your contributions</p>
            </div>

            {/* Points Overview */}
            <Card className="border-white/[0.06] bg-gradient-to-r from-emerald-500/10 via-violet-500/5 to-white/[0.02] backdrop-blur-xl overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Star className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <p className="text-xs text-white/40 uppercase tracking-wider">Total Eco Points</p>
                            <p className="text-4xl font-bold text-white mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                {totalPoints.toLocaleString()}
                            </p>
                            <div className="mt-3">
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-white/40">Next milestone: {nextMilestone.toLocaleString()} pts</span>
                                    <span className="text-emerald-400 font-medium">{Math.round((totalPoints / nextMilestone) * 100)}%</span>
                                </div>
                                <Progress value={(totalPoints / nextMilestone) * 100} className="h-2 bg-white/[0.06]" />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-amber-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                #{4}
                            </p>
                            <p className="text-[10px] text-white/40">Global Rank</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Badges Grid */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Badges
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {badges.map((badge, i) => {
                        const Icon = iconMap[badge.icon] || Shield;
                        return (
                            <motion.div
                                key={badge.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -4, scale: 1.05 }}
                            >
                                <Card className={`border bg-gradient-to-b ${colorMap[badge.color]} backdrop-blur-xl text-center relative overflow-hidden ${!badge.earned ? "opacity-40 grayscale" : ""
                                    }`}>
                                    {badge.earned && (
                                        <div className="absolute top-2 right-2">
                                            <Zap className="w-3 h-3 text-amber-400" />
                                        </div>
                                    )}
                                    <CardContent className="p-4">
                                        <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-${badge.color}-500/10`}>
                                            <Icon className={`w-6 h-6 ${iconColorMap[badge.color]}`} />
                                        </div>
                                        <h4 className="text-xs font-semibold text-white mb-1">{badge.name}</h4>
                                        <p className="text-[9px] text-white/30 leading-tight">{badge.description}</p>
                                        {badge.earned ? (
                                            <Badge className="mt-2 text-[9px] gradient-primary text-white border-0">Earned</Badge>
                                        ) : (
                                            <Badge variant="outline" className="mt-2 text-[9px] border-white/[0.08] text-white/30">Locked</Badge>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Points History */}
            <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-white">Points History</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="divide-y divide-white/[0.04]">
                        {rewardsHistory.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center justify-between py-3"
                            >
                                <div>
                                    <p className="text-xs font-medium text-white/80">{item.action}</p>
                                    <p className="text-[10px] text-white/30 mt-0.5">{item.date}</p>
                                </div>
                                <Badge className="gradient-primary text-white border-0 text-xs">
                                    +{item.points}
                                </Badge>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
