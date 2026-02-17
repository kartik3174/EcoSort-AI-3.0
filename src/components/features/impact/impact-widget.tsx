"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TreeDeciduous, Car, CloudRain } from "lucide-react";

export function EnvironmentalImpactWidget() {
    return (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-none shadow-sm">
            <CardContent className="p-6">
                <h3 className="font-semibold text-green-800 mb-4">Your Environmental Impact</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col items-center">
                        <div className="h-10 w-10 bg-green-200 rounded-full flex items-center justify-center mb-2 text-green-700">
                            <TreeDeciduous className="h-5 w-5" />
                        </div>
                        <span className="text-2xl font-bold text-green-900">12</span>
                        <span className="text-xs text-green-700">Trees Saved</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="h-10 w-10 bg-blue-200 rounded-full flex items-center justify-center mb-2 text-blue-700">
                            <Car className="h-5 w-5" />
                        </div>
                        <span className="text-2xl font-bold text-green-900">45kg</span>
                        <span className="text-xs text-green-700">CO2 Offset</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="h-10 w-10 bg-teal-200 rounded-full flex items-center justify-center mb-2 text-teal-700">
                            <CloudRain className="h-5 w-5" />
                        </div>
                        <span className="text-2xl font-bold text-green-900">200L</span>
                        <span className="text-xs text-green-700">Water Saved</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
