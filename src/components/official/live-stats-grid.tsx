"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Trash2, AlertTriangle, CheckCircle, ArrowUp } from "lucide-react";

type StatItem = {
    title: string;
    value: string;
    icon: any; // Using any for simplicity with dynamic icon mapping or passed component
};

interface LiveStatsGridProps {
    initialStats: StatItem[];
}

const iconMap: any = {
    ClipboardList: ClipboardList,
    Trash2: Trash2,
    AlertTriangle: AlertTriangle,
    CheckCircle: CheckCircle,
};

export function LiveStatsGrid({ initialStats }: LiveStatsGridProps) {
    const [stats, setStats] = useState(initialStats);
    const [lastUpdate, setLastUpdate] = useState<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prevStats => {
                const newStats = [...prevStats];

                // Simulate "Total Reports" increasing
                const totalReportsIndex = newStats.findIndex(s => s.title === "Total Reports");
                if (totalReportsIndex !== -1) {
                    const currentVal = parseInt(newStats[totalReportsIndex].value.replace(/,/g, ''));
                    if (Math.random() > 0.3) {
                        newStats[totalReportsIndex] = {
                            ...newStats[totalReportsIndex],
                            value: (currentVal + 1).toLocaleString()
                        };
                        setLastUpdate(totalReportsIndex); // Track which one updated for visual effect (optional)
                    }
                }

                // Simulate "Cleaned Locations" increasing
                const cleanedIndex = newStats.findIndex(s => s.title === "Cleaned Locations");
                if (cleanedIndex !== -1) {
                    const currentVal = parseInt(newStats[cleanedIndex].value.replace(/,/g, ''));
                    if (Math.random() > 0.6) {
                        newStats[cleanedIndex] = {
                            ...newStats[cleanedIndex],
                            value: (currentVal + 1).toLocaleString()
                        };
                    }
                }

                // Simulate "Pending" fluctuating
                const pendingIndex = newStats.findIndex(s => s.title === "Pending Cleanup");
                if (pendingIndex !== -1) {
                    const currentVal = parseInt(newStats[pendingIndex].value.replace(/,/g, ''));
                    // Randomly go up or down
                    const change = Math.random() > 0.5 ? 1 : -1;
                    newStats[pendingIndex] = {
                        ...newStats[pendingIndex],
                        value: Math.max(0, currentVal + change).toLocaleString()
                    };
                }


                return newStats;
            });
        }, 3000); // Update every 3 seconds for "Live" feel

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, index) => {
                const IconComponent = iconMap[stat.icon as string] || ClipboardList;
                // const isGrowing = lastUpdate === index; // unused variable

                return (
                    <Card key={stat.title} className="transition-all duration-500 hover:scale-105 border-l-4 border-l-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <IconComponent className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold flex items-center gap-2">
                                {stat.value}
                                {stat.title === "Total Reports" && (
                                    <span className="text-xs text-green-500 flex items-center animate-pulse">
                                        <ArrowUp className="h-3 w-3" /> Live
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.title === "Hazard Alerts" ? "Active High Priority" : "Updated just now"}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
