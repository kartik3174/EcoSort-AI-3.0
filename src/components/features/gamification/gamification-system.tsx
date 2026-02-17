"use client";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Medal, Target, Gift, Download, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function GamificationSystem() {
    const { toast } = useToast();
    const [points, setPoints] = useState(0);
    const [level, setLevel] = useState(1);
    const [nextLevelPoints, setNextLevelPoints] = useState(500);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const syncData = () => {
            const uid = auth.currentUser?.uid || 'guest';
            const storageKey = `ecosort_session_${uid}`;
            const savedData = localStorage.getItem(storageKey);

            if (savedData) {
                const data = JSON.parse(savedData);
                setPoints(data.points || 0);
                setLevel(data.level || 1);
                setNextLevelPoints((data.level || 1) * 500);
            }
            setIsInitialized(true);
        };

        const unsubscribe = onAuthStateChanged(auth, syncData);

        // Poll for changes every 2 seconds to catch updates from the report form
        const interval = setInterval(syncData, 2000);

        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, []);

    const achievements = [
        { id: 1, title: "First Report", icon: Star, description: "Submitted your first litter report", completed: points > 0 },
        { id: 2, title: "Green Warrior", icon: Medal, description: "Reached Level 5", completed: level >= 5 },
        { id: 3, title: "Clean Sweep", icon: Target, description: "Reported 10 cleaned locations", completed: points > 1000 },
        { id: 4, title: "Top Contributor", icon: Trophy, description: "Made it to the weekly leaderboard", completed: level >= 3 },
    ];

    const leaderboard = [
        { rank: 1, name: "You", points: points },
        { rank: 2, name: "RecycleMike", points: 50 },
        { rank: 3, name: "EcoNovice", points: 20 },
    ].sort((a, b) => b.points - a.points).map((u, i) => ({ ...u, rank: i + 1 }));

    const handleDownloadCertificate = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1200;
        canvas.height = 1600;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 1200, 1600);

        // Border
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 40;
        ctx.strokeRect(40, 40, 1120, 1520);

        ctx.strokeStyle = "#064e3b";
        ctx.lineWidth = 10;
        ctx.strokeRect(70, 70, 1060, 1460);

        // Header
        ctx.fillStyle = "#064e3b";
        ctx.font = "bold 65px serif";
        ctx.textAlign = "center";
        ctx.fillText("CERTIFICATE OF ACHIEVEMENT", 600, 280);

        ctx.font = "italic 35px serif";
        ctx.fillText("This certificate is proudly awarded to", 600, 420);

        // Name
        const userName = auth.currentUser?.displayName || "Eco Warrior";
        ctx.font = "bold 90px serif";
        ctx.fillStyle = "#10b981";
        ctx.fillText(userName.toUpperCase(), 600, 560);

        ctx.beginPath();
        ctx.moveTo(350, 580);
        ctx.lineTo(850, 580);
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Reason
        ctx.fillStyle = "#064e3b";
        ctx.font = "38px serif";
        ctx.fillText("For outstanding dedication to city cleanliness,", 600, 720);
        ctx.fillText("waste reduction, and environmental stewardship.", 600, 780);

        // Award Name
        ctx.font = "bold 75px serif";
        ctx.fillStyle = "#d97706";
        ctx.fillText("ECO-CHAMPION 2026", 600, 950);

        // Stats
        ctx.font = "30px serif";
        ctx.fillStyle = "#6b7280";
        ctx.fillText(`Total Contribution: ${points} XP | Rank Reached: #1`, 600, 1100);

        // Gold Seal (Optional Visual)
        ctx.beginPath();
        ctx.arc(600, 1250, 70, 0, Math.PI * 2);
        ctx.fillStyle = "#fbbf24";
        ctx.fill();
        ctx.strokeStyle = "#d97706";
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.fillStyle = "#d97706";
        ctx.font = "bold 20px serif";
        ctx.fillText("VERIFIED", 600, 1245);
        ctx.fillText("EXCELLENCE", 600, 1265);

        // Signatures
        ctx.fillStyle = "#1e293b";
        ctx.font = "italic 45px 'Brush Script MT', cursive, serif";
        ctx.fillText("EcoSort AI", 300, 1420); // Team Signature
        ctx.fillText("H. Commissioner", 900, 1420); // Dept Signature

        // Signature Lines & Titles
        ctx.strokeStyle = "#064e3b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(180, 1440);
        ctx.lineTo(420, 1440);
        ctx.moveTo(780, 1440);
        ctx.lineTo(1020, 1440);
        ctx.stroke();

        ctx.font = "bold 25px serif";
        ctx.fillStyle = "#064e3b";
        ctx.fillText("EcoSort AI Team", 300, 1480);
        ctx.fillText("City Environment Dept", 900, 1480);

        // Download
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `EcoSort_Certificate_${userName.replace(/\s/g, '_')}.png`;
        link.href = dataUrl;
        link.click();

        toast({
            title: "Success",
            description: "Your certificate has been downloaded!",
        });
    };

    if (!isInitialized) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-r-4"></div>
            <p className="font-medium animate-pulse">Syncing your progress...</p>
        </div>
    );

    return (
        <div className="space-y-6 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 border-primary/20 bg-card/40 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-3xl font-black tracking-tight flex items-center gap-2">
                                    <Trophy className="h-8 w-8 text-yellow-500" />
                                    Your Impact
                                </CardTitle>
                                <CardDescription className="text-base font-medium mt-1">
                                    Every report makes your city greener.
                                </CardDescription>
                            </div>
                            <Badge variant="secondary" className="px-4 py-1 text-xl font-black bg-primary/10 text-primary border-primary/20 hover:scale-110 transition-transform">
                                LVL {level}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                                <span className="text-primary flex items-center gap-2">
                                    <Star className="h-4 w-4 fill-current" />
                                    {points} Total XP
                                </span>
                                <span className="text-muted-foreground">{nextLevelPoints - points} XP to next level</span>
                            </div>
                            <Progress value={(points / nextLevelPoints) * 100} className="h-5 overflow-hidden bg-primary/5 p-1 border border-primary/10 rounded-full">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-1000 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                    style={{ width: `${(points / nextLevelPoints) * 100}%` }}
                                />
                            </Progress>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-3 bg-background/50 backdrop-blur-md px-5 py-3 rounded-2xl border border-primary/20 shadow-sm">
                                <Trophy className="h-6 w-6 text-yellow-500" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Global Rank</p>
                                    <p className="text-lg font-black">{leaderboard.find(u => u.name === 'You')?.rank || '--'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-background/50 backdrop-blur-md px-5 py-3 rounded-2xl border border-primary/20 shadow-sm">
                                <Target className="h-6 w-6 text-primary" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Milestone</p>
                                    <p className="text-sm font-black">Level {level + 1} Target</p>
                                </div>
                            </div>

                            {level >= 3 ? (
                                <Button
                                    onClick={handleDownloadCertificate}
                                    className="ml-auto rounded-xl px-6 h-14 bg-gradient-to-r from-amber-500 to-yellow-600 hover:scale-105 transition-all shadow-lg text-amber-950 font-black flex flex-col items-center justify-center border-b-4 border-amber-800"
                                >
                                    <div className="flex items-center gap-2">
                                        <Download className="h-5 w-5" />
                                        CLAIM CERTIFICATE
                                    </div>
                                    <span className="text-[8px] opacity-80 uppercase tracking-[0.2em]">Verified PNG Format</span>
                                </Button>
                            ) : (
                                <div className="ml-auto opacity-50 bg-muted px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold border border-dashed border-muted-foreground/30">
                                    <div className="h-8 w-8 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                                        <Download className="h-4 w-4" />
                                    </div>
                                    <span>Reach Level 3 to unlock achievement certificate</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-primary/20 bg-card/40 backdrop-blur-xl shadow-2xl h-full flex flex-col">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Medal className="h-5 w-5 text-primary" />
                            Live Rankings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto max-h-[400px] lg:max-h-full scrollbar-hide">
                        <div className="space-y-3">
                            {leaderboard.map((user) => (
                                <div
                                    key={user.rank}
                                    className={cn(
                                        "flex justify-between items-center p-3 rounded-xl transition-all duration-300",
                                        user.name === 'You'
                                            ? 'bg-primary/20 border-2 border-primary ring-4 ring-primary/10 shadow-lg scale-105 z-10'
                                            : 'bg-muted/30 border border-transparent hover:border-primary/20'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-8 h-8 flex items-center justify-center rounded-full text-xs font-black shadow-inner",
                                            user.rank === 1 ? 'bg-yellow-400 text-yellow-950 scale-110' :
                                                user.rank === 2 ? 'bg-slate-300 text-slate-800' :
                                                    user.rank === 3 ? 'bg-amber-600 text-white' : 'bg-background/80 text-muted-foreground'
                                        )}>
                                            {user.rank === 1 ? '👑' : user.rank}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={cn(
                                                "font-bold text-sm",
                                                user.name === 'You' ? 'text-primary-foreground' : ''
                                            )}>
                                                {user.name} {user.name === 'You' && '(Me)'}
                                            </span>
                                            {user.rank <= 3 && (
                                                <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-black">
                                                    {user.rank === 1 ? 'Eco Master' : user.rank === 2 ? 'Green Guardian' : 'Litter Scout'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-mono font-black text-sm">{user.points.toLocaleString()}</span>
                                        <span className="text-[8px] text-muted-foreground uppercase font-bold">XP</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="pt-8">
                <h3 className="text-3xl font-black mb-6 flex items-center gap-3">
                    <Badge variant="outline" className="text-xl rounded-full px-4 py-1 border-primary text-primary">Achievements</Badge>
                </h3>
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                    {achievements.map((achievement) => (
                        <Card
                            key={achievement.id}
                            className={cn(
                                "transition-all duration-500 overflow-hidden relative",
                                achievement.completed
                                    ? "border-green-500/50 bg-gradient-to-br from-green-500/10 to-transparent shadow-xl translate-y-[-4px]"
                                    : "opacity-40 border-dashed border-2 grayscale"
                            )}
                        >
                            <div className={cn(
                                "absolute top-0 right-0 w-16 h-16 opacity-10",
                                achievement.completed ? "animate-pulse" : "hidden"
                            )}>
                                <achievement.icon className="w-full h-full" />
                            </div>
                            <CardContent className="pt-8 pb-4 flex flex-col items-center text-center gap-3">
                                <div className={cn(
                                    "p-4 rounded-2xl shadow-lg transition-transform duration-700",
                                    achievement.completed
                                        ? "bg-green-500 text-white rotate-[360deg] scale-110 shadow-green-500/20"
                                        : "bg-muted text-muted-foreground"
                                )}>
                                    <achievement.icon className="h-7 w-7" />
                                </div>
                                <div>
                                    <h4 className="font-black text-sm tracking-tight">{achievement.title}</h4>
                                    <p className="text-[10px] text-muted-foreground mt-1 leading-tight font-medium">{achievement.description}</p>
                                </div>
                                {achievement.completed ? (
                                    <div className="mt-2 flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-100 px-3 py-1 rounded-full border border-green-200">
                                        <CheckCircle2 className="h-3 w-3" />
                                        VALOR UNLOCKED
                                    </div>
                                ) : (
                                    <div className="mt-2 text-[10px] font-bold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-dashed">
                                        LOCKED
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
