"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BrainCircuit, Loader2, Sparkles, Leaf, Recycle, AlertTriangle } from "lucide-react";

export function AdvancedAIStats() {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);

    const handleAnalyze = async () => {
        setIsLoading(true);
        // Simulate advanced AI processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        setAnalysis({
            hazardLevel: "Low",
            recyclingMethod: "Mechanical Recycling",
            cleanupPriority: 7.5,
            impactScore: 85,
            suggestions: [
                "Separate caps from bottles",
                "Rinse to remove residue",
                "Check for local collection events"
            ]
        });
        setIsLoading(false);
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BrainCircuit className="h-5 w-5 text-primary" />
                            AI Waste Analyzer
                        </CardTitle>
                        <CardDescription>
                            Describe your waste or upload data for deep analysis.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Describe the waste item (e.g., 'Broken CRT Monitor', 'Pile of mixed batteries')"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            rows={4}
                        />
                        <Button onClick={handleAnalyze} disabled={isLoading || !input} className="w-full">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Generate Insights
                        </Button>
                    </CardContent>
                </Card>

                {analysis && (
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle>Analysis Results</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-background rounded-lg border">
                                    <div className="text-sm text-muted-foreground mb-1">Hazard Level</div>
                                    <div className="font-bold flex items-center gap-2 text-green-600">
                                        <Leaf className="h-4 w-4" /> {analysis.hazardLevel}
                                    </div>
                                </div>
                                <div className="p-3 bg-background rounded-lg border">
                                    <div className="text-sm text-muted-foreground mb-1">Priority Score</div>
                                    <div className="font-bold flex items-center gap-2 text-orange-600">
                                        <AlertTriangle className="h-4 w-4" /> {analysis.cleanupPriority}/10
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <Recycle className="h-4 w-4" /> Recycling Method
                                </h4>
                                <p className="text-sm text-muted-foreground">{analysis.recyclingMethod}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Historical Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                            <li className="p-2 border-b">Plastic Bottles - Recycled via automated sorting (98% Success)</li>
                            <li className="p-2 border-b">E-Waste - Sent to specialized facility (Hazardous components safe)</li>
                            <li className="p-2 border-b">Organic Matter - Composted (Rich soil output)</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
