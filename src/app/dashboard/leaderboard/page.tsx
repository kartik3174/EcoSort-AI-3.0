"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown, Star, TrendingUp } from "lucide-react";
import { leaderboardData } from "@/lib/data";

const rankIcons: Record<number, JSX.Element> = {
    1: <Crown className="w-5 h-5 text-amber-400" />,
    2: <Medal className="w-5 h-5 text-slate-300" />,
    3: <Medal className="w-5 h-5 text-amber-600" />,
};

const rankColors: Record<number, string> = {
    1: "from-amber-500/20 via-amber-500/5 to-transparent border-amber-500/20",
    2: "from-slate-400/15 via-slate-400/5 to-transparent border-slate-400/15",
    3: "from-amber-700/15 via-amber-700/5 to-transparent border-amber-700/15",
};

const badgeColors: Record<string, string> = {
    "Eco Hero": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    "Plastic Warrior": "bg-blue-500/10 text-blue-400 border-blue-500/30",
    "Clean City Champion": "bg-amber-500/10 text-amber-400 border-amber-500/30",
    "Top Reporter": "bg-violet-500/10 text-violet-400 border-violet-500/30",
};

export default function LeaderboardPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl mx-auto"
        >
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <Trophy className="w-7 h-7 text-amber-400" />
                    Leaderboard
                </h1>
                <p className="text-sm text-white/40 mt-1">Top eco contributors making a difference</p>
            </div>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-3 mb-2">
                {[1, 0, 2].map((index) => {
                    const user = leaderboardData[index];
                    const isFirst = user.rank === 1;
                    return (
                        <motion.div
                            key={user.rank}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15, duration: 0.5 }}
                            className={isFirst ? "row-span-1 -mt-4" : "mt-4"}
                        >
                            <Card className={`border bg-gradient-to-b ${rankColors[user.rank] || "border-white/[0.06] from-white/[0.02]"} backdrop-blur-xl text-center overflow-hidden`}>
                                <CardContent className="p-5">
                                    <div className="flex justify-center mb-3">
                                        {rankIcons[user.rank]}
                                    </div>
                                    <div className={`w-14 h-14 rounded-full mx-auto mb-3 overflow-hidden ring-2 ${user.rank === 1 ? "ring-amber-400" : user.rank === 2 ? "ring-slate-300" : "ring-amber-600"
                                        }`}>
                                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-xs font-semibold text-white truncate">{user.username}</h3>
                                    <p className="text-xl font-bold text-white mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                        {user.ecoPoints.toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-white/40">Eco Points</p>
                                    <Badge variant="outline" className={`text-[9px] mt-2 ${badgeColors[user.badge]}`}>
                                        {user.badge}
                                    </Badge>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Full Leaderboard */}
            <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
                <div className="divide-y divide-white/[0.04]">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-4 px-5 py-3 text-[10px] text-white/30 uppercase tracking-wider font-medium">
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-4">User</div>
                        <div className="col-span-2 text-center">Reports</div>
                        <div className="col-span-2 text-center">Eco Points</div>
                        <div className="col-span-3 text-right">Badge</div>
                    </div>
                    {/* Rows */}
                    {leaderboardData.map((user, i) => (
                        <motion.div
                            key={user.rank}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="grid grid-cols-12 gap-4 px-5 py-3 items-center hover:bg-white/[0.02] transition-colors"
                        >
                            <div className="col-span-1">
                                {rankIcons[user.rank] || (
                                    <span className="text-sm font-bold text-white/40">#{user.rank}</span>
                                )}
                            </div>
                            <div className="col-span-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-xs font-medium text-white/80 truncate">{user.username}</span>
                            </div>
                            <div className="col-span-2 text-center text-xs text-white/60">{user.reports}</div>
                            <div className="col-span-2 text-center">
                                <span className="text-xs font-bold text-emerald-400">{user.ecoPoints.toLocaleString()}</span>
                            </div>
                            <div className="col-span-3 text-right">
                                <Badge variant="outline" className={`text-[9px] ${badgeColors[user.badge]}`}>
                                    {user.badge}
                                </Badge>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>
        </motion.div>
    );
}
