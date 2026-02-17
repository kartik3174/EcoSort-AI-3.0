"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Map } from "lucide-react";

const hotspots = [
    { area: "Market Square", riskLevel: "Critical", trend: "Increasing", reason: "Weekend Crowds" },
    { area: "North Bridge Underpass", riskLevel: "High", trend: "Stable", reason: "Illegal Dumping History" },
    { area: "Tech Park Entrance", riskLevel: "Medium", trend: "Decreasing", reason: "New Bins Installed" },
];

export function PredictiveHotspotWidget() {
    return (
        <Card className="h-full border-l-4 border-l-purple-500">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    AI Waste Prediction Model
                </CardTitle>
                <CardDescription>Target high-risk zones before waste accumulates.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {hotspots.map((spot, i) => (
                        <div key={i} className="flex flex-col p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold flex items-center gap-2">
                                    <Map className="h-3 w-3 text-muted-foreground" />
                                    {spot.area}
                                </span>
                                <Badge variant={spot.riskLevel === 'Critical' ? 'destructive' : 'secondary'}>
                                    {spot.riskLevel} Risk
                                </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground flex justify-between">
                                <span>Trend: <span className={spot.trend === 'Increasing' ? 'text-red-500 font-bold' : 'text-green-500'}>{spot.trend}</span></span>
                                <span>Factor: {spot.reason}</span>
                            </div>
                        </div>
                    ))}
                    <div className="text-xs text-center text-muted-foreground mt-2 italic">
                        *Predictions based on 12-month historical reporting data + local event calendar.
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
