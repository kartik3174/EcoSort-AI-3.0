"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, Target, MapPin, Clock, Trophy, ChevronRight } from "lucide-react";
import { communityEvents, ecoChallenges } from "@/lib/data";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function CommunityPage() {
    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants}>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Community
                </h1>
                <p className="text-sm text-white/40 mt-1">Join cleanup events and complete eco challenges</p>
            </motion.div>

            <Tabs defaultValue="events" className="space-y-4">
                <TabsList className="bg-white/[0.04] border border-white/[0.06] p-1">
                    <TabsTrigger value="events" className="text-xs data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" /> Cleanup Events
                    </TabsTrigger>
                    <TabsTrigger value="challenges" className="text-xs data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">
                        <Target className="w-3.5 h-3.5 mr-1.5" /> Eco Challenges
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="events">
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {communityEvents.map((event) => (
                            <motion.div key={event.id} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400 }}>
                                <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden h-full">
                                    <div className={`h-1 w-full ${event.status === "Completed" ? "bg-emerald-500" : "gradient-primary"}`} />
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-sm font-semibold text-white">{event.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <MapPin className="w-3 h-3 text-white/30" />
                                                    <span className="text-xs text-white/40">{event.location}</span>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className={`text-[10px] ${event.status === "Completed"
                                                ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                                                : "border-blue-500/30 text-blue-400 bg-blue-500/10"
                                                }`}>
                                                {event.status}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-4 mb-4 text-xs text-white/40">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {event.date}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {event.time}
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-white/40">Participants</span>
                                                <span className="text-white/60 font-medium">{event.participants}/{event.maxParticipants}</span>
                                            </div>
                                            <Progress
                                                value={(event.participants / event.maxParticipants) * 100}
                                                className="h-1.5 bg-white/[0.06]"
                                            />
                                        </div>

                                        {event.status !== "Completed" && (
                                            <Button size="sm" className="w-full gradient-primary text-white border-0 text-xs">
                                                <Users className="w-3 h-3 mr-1.5" /> Join Event
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </TabsContent>

                <TabsContent value="challenges">
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ecoChallenges.map((challenge) => (
                            <motion.div key={challenge.id} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400 }}>
                                <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                                    {challenge.progress === 100 && <Trophy className="w-4 h-4 text-amber-400" />}
                                                    {challenge.title}
                                                </h3>
                                                <p className="text-xs text-white/40 mt-1">{challenge.description}</p>
                                            </div>
                                            <Badge className={`text-[10px] ${challenge.progress === 100
                                                ? "gradient-primary text-white border-0"
                                                : "bg-white/[0.05] text-white/50 border-0"
                                                }`}>
                                                +{challenge.reward} pts
                                            </Badge>
                                        </div>

                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-xs mb-1.5">
                                                <span className="text-white/40">{challenge.deadline}</span>
                                                <span className="text-white/60 font-semibold">{challenge.progress}%</span>
                                            </div>
                                            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full rounded-full ${challenge.progress === 100 ? "bg-emerald-500" : "bg-violet-500"}`}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${challenge.progress}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-white/30">
                                                <Users className="w-3 h-3 inline mr-1" />{challenge.participants} participants
                                            </span>
                                            {challenge.progress < 100 && (
                                                <Button size="sm" variant="ghost" className="text-xs text-emerald-400 hover:bg-emerald-500/10 h-7 px-3">
                                                    View <ChevronRight className="w-3 h-3 ml-1" />
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </TabsContent>
            </Tabs>
        </motion.div>
    );
}
