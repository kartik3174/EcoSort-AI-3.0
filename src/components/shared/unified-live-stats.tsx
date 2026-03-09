"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Trash2, AlertTriangle, CheckCircle, ArrowUp, FileText, MapPin, Leaf, Hourglass, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

type StatItem = {
    title: string;
    value: string;
    icon: any;
};

interface UnifiedLiveStatsGridProps {
    initialStats: StatItem[];
    userType: 'citizen' | 'official';
}

const iconMap: any = {
    ClipboardList: ClipboardList,
    Trash2: Trash2,
    AlertTriangle: AlertTriangle,
    CheckCircle: CheckCircle,
    FileText: FileText,
    MapPin: MapPin,
    Leaf: Leaf,
    Hourglass: Hourglass
};

function generateCSV(type: 'citizen' | 'official') {
    // Generate dummy data rows
    const rows = [];
    const headers = type === 'official'
        ? ["ReportID", "Location", "Type", "Status", "Date", "Priority"]
        : ["MyReportID", "Location", "WasteType", "Status", "PointsEarned", "Date"];

    rows.push(headers.join(","));

    const locations = ["Central Park", "Market Square", "North Ave", "Beach Road", "Tech Park"];
    const statuses = ["Pending", "Cleaned", "In Progress"];
    const priorities = ["High", "Medium", "Low", "Critical"];

    for (let i = 0; i < 50; i++) {
        const id = `REP-${1000 + i}`;
        const loc = locations[Math.floor(Math.random() * locations.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        if (type === 'official') {
            const priority = priorities[Math.floor(Math.random() * priorities.length)];
            rows.push(`${id},"${loc}",Mixed Waste,${status},2024-05-${10 + (i % 20)},${priority}`);
        } else {
            rows.push(`${id},"${loc}",Plastic,${status},50,2024-05-${10 + (i % 20)}`);
        }
    }

    const csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${type}_report_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


export function UnifiedLiveStatsGrid({ initialStats, userType }: UnifiedLiveStatsGridProps) {
    const [stats, setStats] = useState(initialStats);
    const [lastUpdate, setLastUpdate] = useState<number | null>(null);
    const [isNewUser, setIsNewUser] = useState(false);

    useEffect(() => {
        const syncData = () => {
            const uid = auth.currentUser?.uid || 'guest';
            const storageKey = `ecosort_session_${uid}`;
            const savedData = localStorage.getItem(storageKey);

            if (!savedData) {
                // Initialize as zero for new users
                setIsNewUser(true);
                const zeroStats = initialStats.map(s => ({
                    ...s,
                    value: "0"
                }));
                setStats(zeroStats);
                // Save initial zero state
                localStorage.setItem(storageKey, JSON.stringify({ reports: 0, points: 0, level: 1, hasActivity: true }));
            } else {
                const session = JSON.parse(savedData);
                // If they are a new user session (hasActivity: true), start from their saved progress
                if (session.hasActivity) {
                    const progressStats = initialStats.map(s => {
                        if (s.title === "Reports Submitted" || s.title === "Total Reports") {
                            return { ...s, value: (session.reports || 0).toString() };
                        }
                        if (s.title === "Eco Contribution Score" || s.title === "Points Earned") {
                            return { ...s, value: (session.points || 0).toLocaleString() };
                        }
                        // For others, we can either use 0 or a very small number
                        return { ...s, value: "0" };
                    });
                    setStats(progressStats);
                    setIsNewUser(true); // Treat as "progressing" user
                } else {
                    setStats(initialStats);
                }
            }
        };

        const unsubscribe = onAuthStateChanged(auth, syncData);
        const interval = setInterval(syncData, 2000);

        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, [initialStats]);

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prevStats => {
                const newStats = [...prevStats];
                const randomIndex = Math.floor(Math.random() * newStats.length);
                const item = newStats[randomIndex];
                const currentVal = parseInt(item.value.replace(/,/g, ''));

                if (!isNaN(currentVal)) {
                    // New users see faster initial growth to demo "active tracking"
                    const prob = isNewUser ? 0.7 : 0.4;
                    const change = Math.random() > (1 - prob) ? 1 : 0;

                    if (change !== 0) {
                        newStats[randomIndex] = {
                            ...item,
                            value: (currentVal + change).toLocaleString()
                        };
                        setLastUpdate(randomIndex);
                    }
                }
                return newStats;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [isNewUser]);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, index) => {
                const IconComponent = iconMap[stat.icon as string] || ClipboardList;
                const isTargetCard = (userType === 'citizen' && stat.title === "Reports Submitted") ||
                    (userType === 'official' && stat.title === "Total Reports");

                return (
                    <Card key={stat.title} className="relative transition-all duration-500 hover:scale-105 border-l-4 border-l-primary/20 group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <IconComponent className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex items-center gap-2">
                                {stat.value}
                                {isTargetCard && (
                                    <span className="text-xs text-green-500 flex items-center animate-pulse">
                                        ● Live
                                    </span>
                                )}
                            </div>

                            {isTargetCard && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => generateCSV(userType)}
                                        title="Download Dataset"
                                    >
                                        <Download className="h-4 w-4 text-primary" />
                                    </Button>
                                </div>
                            )}

                            <p className="text-xs text-muted-foreground mt-1">
                                {isTargetCard ? "Click icon to download CSV" : "Updated just now"}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
