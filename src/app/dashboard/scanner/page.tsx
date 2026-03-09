"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import {
    ScanLine, Upload, Loader2, Recycle, AlertTriangle, MapPin,
    Trash2, CheckCircle, Sparkles, Navigation, Send, Check
} from "lucide-react";

const wasteResults = [
    {
        type: "Plastic Bottle (PET)",
        confidence: 96,
        hazardLevel: "Low",
        recyclability: 92,
        disposal: "Clean and place in the blue recycling bin. Remove cap and label if possible. Crush to save space.",
        center: { name: "Chennai Green Recycling Hub", distance: "1.2 km", address: "45 Anna Salai, Mylapore" },
        bin: { type: "Blue Recyclable Bin", distance: "200m", direction: "East on 2nd Cross St" },
    },
    {
        type: "Electronic Circuit Board",
        confidence: 89,
        hazardLevel: "High",
        recyclability: 45,
        disposal: "Do not dispose in regular bins. Take to certified e-waste collection center. Contains lead and cadmium.",
        center: { name: "E-Waste Solutions Chennai", distance: "3.5 km", address: "12 Industrial Estate, Guindy" },
        bin: { type: "E-Waste Collection Point", distance: "1.8 km", direction: "South on Gandhi Road" },
    },
    {
        type: "Organic Food Waste",
        confidence: 94,
        hazardLevel: "Low",
        recyclability: 100,
        disposal: "Compostable. Place in green organic waste bin or home compost. Great for garden soil enrichment.",
        center: { name: "Community Compost Center", distance: "0.8 km", address: "Park Lane, Adyar" },
        bin: { type: "Green Organic Bin", distance: "50m", direction: "Next block, corner" },
    },
];

export default function ScannerPage() {
    const { user } = useAuth();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<typeof wasteResults[0] | null>(null);
    const [scanProgress, setScanProgress] = useState(0);
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImagePreview(ev.target?.result as string);
                setIsSent(false);
                startScan();
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSendToOfficials = async () => {
        if (!result || !user) return;
        setIsSending(true);

        try {
            // Map the type to a high-level category 
            const categoryMap: Record<string, string> = {
                "Plastic Bottle (PET)": "plastic",
                "Electronic Circuit Board": "electronic",
                "Organic Food Waste": "organic"
            };

            await addDoc(collection(db, "reports"), {
                userId: user.uid,
                userName: user.displayName || "Citizen",
                userPhoto: user.photoURL,
                category: categoryMap[result.type] || "other",
                location: "Scanned via AI Terminal",
                description: `AI Detected: ${result.type}. Confidence: ${result.confidence}%. Recommended Disposal: ${result.disposal}`,
                severity: result.hazardLevel.toLowerCase(),
                priority: result.hazardLevel === 'High' ? 'high' : 'normal',
                status: "Pending",
                image: imagePreview,
                createdAt: serverTimestamp(),
                isAIScan: true
            });

            setIsSent(true);
        } catch (error) {
            console.error("Failed to send scan result:", error);
        } finally {
            setIsSending(false);
        }
    };

    const startScan = () => {
        setIsScanning(true);
        setResult(null);
        setScanProgress(0);

        const interval = setInterval(() => {
            setScanProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsScanning(false);
                    setResult(wasteResults[Math.floor(Math.random() * wasteResults.length)]);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };

    const hazardColors: Record<string, string> = {
        Low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        Medium: "text-amber-400 bg-amber-500/10 border-amber-500/30",
        High: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl mx-auto"
        >
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <ScanLine className="w-7 h-7 text-emerald-400" />
                    AI Waste Scanner
                </h1>
                <p className="text-sm text-white/40 mt-1">Upload an image and let AI analyze waste type, hazard level, and disposal method</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div className="space-y-4">
                    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                        <CardContent className="p-6">
                            {!imagePreview ? (
                                <label className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-white/[0.08] rounded-2xl cursor-pointer hover:border-emerald-500/30 transition-all bg-white/[0.01] group">
                                    <motion.div
                                        animate={{ y: [0, -8, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                                            <ScanLine className="w-8 h-8 text-emerald-400" />
                                        </div>
                                    </motion.div>
                                    <p className="text-sm font-medium text-white/50">Drop your waste image here</p>
                                    <p className="text-xs text-white/25 mt-1">or click to browse</p>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            ) : (
                                <div className="relative rounded-2xl overflow-hidden h-80">
                                    <img src={imagePreview} alt="Scanned waste" className="w-full h-full object-cover" />
                                    {isScanning && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center"
                                        >
                                            <div className="relative w-24 h-24 mb-4">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400"
                                                />
                                                <div className="absolute inset-2 rounded-full border border-white/10 flex items-center justify-center">
                                                    <Sparkles className="w-8 h-8 text-emerald-400" />
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-white/80">AI Scanning...</p>
                                            <div className="w-48 mt-3">
                                                <Progress value={scanProgress} className="h-1.5 bg-white/10" />
                                            </div>
                                            <p className="text-xs text-white/40 mt-2">{scanProgress}% Complete</p>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                            {imagePreview && !isScanning && (
                                <div className="flex gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-white/[0.08] text-white/50"
                                        onClick={() => { setImagePreview(null); setResult(null); }}
                                    >
                                        Upload New
                                    </Button>
                                    <Button className="flex-1 gradient-primary text-white border-0" onClick={startScan}>
                                        <ScanLine className="w-4 h-4 mr-2" /> Re-scan
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Results Section */}
                <AnimatePresence mode="wait">
                    {result ? (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            {/* Waste Type */}
                            <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
                                <div className="h-1 w-full gradient-primary" />
                                <CardContent className="p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-[10px] text-white/30 uppercase tracking-wider">Detected Waste</p>
                                            <h3 className="text-lg font-bold text-white mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                                {result.type}
                                            </h3>
                                        </div>
                                        <Badge className="gradient-primary text-white border-0 text-xs">
                                            {result.confidence}% Match
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-xl bg-white/[0.03]">
                                            <div className="flex items-center gap-2 mb-1">
                                                <AlertTriangle className="w-3 h-3 text-white/40" />
                                                <span className="text-[10px] text-white/40">Hazard Level</span>
                                            </div>
                                            <Badge variant="outline" className={`text-xs ${hazardColors[result.hazardLevel]}`}>
                                                {result.hazardLevel}
                                            </Badge>
                                        </div>
                                        <div className="p-3 rounded-xl bg-white/[0.03]">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Recycle className="w-3 h-3 text-white/40" />
                                                <span className="text-[10px] text-white/40">Recyclability</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-emerald-400">{result.recyclability}%</span>
                                                <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full">
                                                    <motion.div
                                                        className="h-full bg-emerald-500 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${result.recyclability}%` }}
                                                        transition={{ duration: 1, delay: 0.3 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Disposal Method */}
                            <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                                <CardContent className="p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Trash2 className="w-4 h-4 text-emerald-400" />
                                        <h4 className="text-xs font-semibold text-white">Recommended Disposal</h4>
                                    </div>
                                    <p className="text-sm text-white/60 leading-relaxed">{result.disposal}</p>
                                </CardContent>
                            </Card>

                            {/* Action Button: Send to Officials */}
                            <Button
                                className={`w-full h-12 text-sm font-bold ${isSent ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'gradient-primary text-white shadow-lg shadow-emerald-500/20'} transition-all`}
                                onClick={handleSendToOfficials}
                                disabled={isSending || isSent}
                            >
                                {isSending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending to city database...
                                    </>
                                ) : isSent ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Report sent to Officials
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Send details to Officials
                                    </>
                                )}
                            </Button>

                            {/* Nearest Locations */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                <Recycle className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-white/30 uppercase">Nearest Recycling</p>
                                                <p className="text-xs font-medium text-white/80">{result.center.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-white/40">
                                            <MapPin className="w-3 h-3" />
                                            <span>{result.center.distance} away</span>
                                        </div>
                                        <p className="text-[10px] text-white/25 mt-1">{result.center.address}</p>
                                    </CardContent>
                                </Card>

                                <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                                <Navigation className="w-4 h-4 text-violet-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-white/30 uppercase">Nearest Bin</p>
                                                <p className="text-xs font-medium text-white/80">{result.bin.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-white/40">
                                            <MapPin className="w-3 h-3" />
                                            <span>{result.bin.distance} — {result.bin.direction}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-center h-full"
                        >
                            <div className="text-center p-8">
                                <motion.div
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <Sparkles className="w-12 h-12 text-white/10 mx-auto mb-4" />
                                </motion.div>
                                <p className="text-sm text-white/30">Upload an image to start AI analysis</p>
                                <p className="text-xs text-white/15 mt-1">Results will appear here</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
