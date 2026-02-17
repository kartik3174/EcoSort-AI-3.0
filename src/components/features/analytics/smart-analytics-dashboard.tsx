"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const performanceData = [
    { month: "Jan", efficiency: 65, volume: 120 },
    { month: "Feb", efficiency: 72, volume: 132 },
    { month: "Mar", efficiency: 78, volume: 145 },
    { month: "Apr", efficiency: 85, volume: 160 },
    { month: "May", efficiency: 82, volume: 155 },
    { month: "Jun", efficiency: 90, volume: 180 },
];

const wasteComposition = [
    { type: "Plastic", value: 45 },
    { type: "Organic", value: 25 },
    { type: "Metal", value: 10 },
    { type: "Glass", value: 15 },
    { type: "Hazardous", value: 5 },
];

export function SmartAnalyticsDashboard() {
    return (
        <div className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Cleanup Efficiency Trends</CardTitle>
                        <CardDescription>Efficiency vs. Volume over time</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="efficiency" stroke="#10b981" fillOpacity={1} fill="url(#colorEff)" name="Efficiency Score" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Waste Composition Analysis</CardTitle>
                        <CardDescription>Breakdown of collected waste types</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={wasteComposition}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="type" />
                                <YAxis />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Percentage (%)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {[
                    { label: "Avg. Resolution Time", value: "4.2 Hours", trend: "-12%", good: true },
                    { label: "Community Engagement", value: "1,240 Users", trend: "+24%", good: true },
                    { label: "Pending Alerts", value: "15", trend: "+2%", good: false },
                ].map((stat, i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                            <div className="text-2xl font-bold mt-1">{stat.value}</div>
                            <div className={`text-xs mt-2 font-medium ${stat.good ? 'text-green-600' : 'text-red-500'}`}>
                                {stat.trend} from last month
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
