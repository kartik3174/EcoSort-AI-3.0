"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Droplets, Wind, Scale } from "lucide-react";

export function ImpactMetricsCard() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                        <Leaf className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold text-emerald-900">4,250</div>
                    <div className="text-sm text-emerald-700 font-medium">Ibs of Waste Diverted</div>
                    <div className="text-xs text-emerald-600 mt-1">From Landfills</div>
                </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                        <Droplets className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold text-blue-900">12,500 L</div>
                    <div className="text-sm text-blue-700 font-medium">Water Sources Protected</div>
                    <div className="text-xs text-blue-600 mt-1">Via Cleanup Actions</div>
                </CardContent>
            </Card>

            <Card className="bg-teal-50 border-teal-200">
                <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
                        <Wind className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold text-teal-900">850 kg</div>
                    <div className="text-sm text-teal-700 font-medium">CO2 Emissions Reduced</div>
                    <div className="text-xs text-teal-600 mt-1">Equivalent</div>
                </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                        <Scale className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold text-amber-900">92%</div>
                    <div className="text-sm text-amber-700 font-medium">Recycling Efficiency</div>
                    <div className="text-xs text-amber-600 mt-1">In Verified Zones</div>
                </CardContent>
            </Card>
        </div>
    );
}

export function DetailedImpactAnalysis() {
    return (
        <Card className="mt-8">
            <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6">Community Impact Timeline</h3>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full bg-primary" />
                            <div className="w-0.5 h-full bg-border" />
                        </div>
                        <div className="pb-6">
                            <h4 className="font-semibold text-lg">Marina Beach Mega Cleanup</h4>
                            <p className="text-sm text-muted-foreground">May 20, 2024</p>
                            <p className="mt-2 text-sm">Mobilized 240 volunteers resulting in 500kg of plastic removal. AI analysis identified 40% recyclable PET bottles.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full bg-primary" />
                            <div className="w-0.5 h-full bg-border" />
                        </div>
                        <div className="pb-6">
                            <h4 className="font-semibold text-lg">Hazardous Waste Intervention: Guindy</h4>
                            <p className="text-sm text-muted-foreground">May 23, 2024</p>
                            <p className="mt-2 text-sm">Rapid response to reported chemical containers prevented soil contamination impact across 2 acres of parkland.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full bg-primary/40" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg text-muted-foreground">Projected: Q3 Goal</h4>
                            <p className="text-sm text-muted-foreground">August 2024</p>
                            <p className="mt-2 text-sm text-muted-foreground">Targeting 50% reduction in roadside micro-litter through citizen AI reporting.</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
