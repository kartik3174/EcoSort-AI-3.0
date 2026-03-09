"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Upload, MapPin, Camera, AlertTriangle, CheckCircle, Loader2,
    Trash2, Recycle, Zap, FileImage,
} from "lucide-react";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";

const wasteCategories = [
    { value: "plastic", label: "Plastic", icon: "♻️", color: "emerald" },
    { value: "organic", label: "Organic", icon: "🌿", color: "amber" },
    { value: "glass", label: "Glass", icon: "🔷", color: "blue" },
    { value: "electronic", label: "Electronic", icon: "⚡", color: "violet" },
    { value: "hazardous", label: "Hazardous", icon: "☠️", color: "rose" },
];

const severityLevels = [
    { value: "low", label: "Low", color: "bg-blue-500" },
    { value: "medium", label: "Medium", color: "bg-amber-500" },
    { value: "high", label: "High", color: "bg-orange-500" },
    { value: "critical", label: "Critical", color: "bg-rose-500" },
];

export default function ReportWastePage() {
    const [step, setStep] = useState(1);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiDetected, setAiDetected] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [severity, setSeverity] = useState("medium");
    const [location, setLocation] = useState("Marina Beach, Chennai");
    const [description, setDescription] = useState("");
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsubscribe();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImagePreview(ev.target?.result as string);
                simulateAIAnalysis();
            };
            reader.readAsDataURL(file);
        }
    };

    const simulateAIAnalysis = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            const types = ["plastic", "organic", "glass", "electronic", "hazardous"];
            const detected = types[Math.floor(Math.random() * types.length)];
            setAiDetected(detected);
            setSelectedCategory(detected);
            setIsAnalyzing(false);
        }, 2000);
    };

    const handleSubmit = async () => {
        if (!user) return;
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "reports"), {
                userId: user.uid,
                userName: user.displayName,
                userPhoto: user.photoURL,
                category: selectedCategory,
                location: location,
                description: description,
                severity: severity,
                status: "Pending",
                image: imagePreview,
                createdAt: serverTimestamp(),
            });
            setSubmitted(true);
        } catch (error) {
            console.error("Error submitting report:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center min-h-[60vh]"
            >
                <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl max-w-md w-full text-center p-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                    </motion.div>
                    <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Report Submitted!
                    </h2>
                    <p className="text-sm text-white/50 mb-6">
                        Your waste report has been submitted and added to the city map. Thank you for contributing to a cleaner city!
                    </p>
                    <div className="space-y-2 mb-6">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03]">
                            <span className="text-xs text-white/50">Eco Points Earned</span>
                            <Badge className="gradient-primary text-white border-0">+50 points</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03]">
                            <span className="text-xs text-white/50">Report ID</span>
                            <span className="text-xs font-mono text-white/70">REP-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            className="flex-1 gradient-primary text-white border-0"
                            onClick={() => { setSubmitted(false); setStep(1); setImagePreview(null); setAiDetected(null); }}
                        >
                            New Report
                        </Button>
                        <Button variant="outline" className="flex-1 border-white/[0.08] text-white/60">
                            View on Map
                        </Button>
                    </div>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl mx-auto"
        >
            <div>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Report Waste
                </h1>
                <p className="text-sm text-white/40 mt-1">Upload a photo and let AI classify the waste automatically</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-3">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? "gradient-primary text-white shadow-lg shadow-emerald-500/20" : "bg-white/[0.05] text-white/30"
                            }`}>
                            {s}
                        </div>
                        <span className={`text-xs font-medium hidden sm:block ${step >= s ? "text-white/80" : "text-white/30"}`}>
                            {s === 1 ? "Upload Photo" : s === 2 ? "Details" : "Submit"}
                        </span>
                        {s < 3 && <div className={`flex-1 h-px ${step > s ? "bg-emerald-500/50" : "bg-white/[0.06]"}`} />}
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Camera className="w-4 h-4 text-emerald-400" /> Upload Waste Image
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!imagePreview ? (
                                    <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/[0.08] rounded-xl cursor-pointer hover:border-emerald-500/30 transition-colors bg-white/[0.01]">
                                        <Upload className="w-10 h-10 text-white/20 mb-3" />
                                        <p className="text-sm font-medium text-white/50">Click to upload or drag & drop</p>
                                        <p className="text-xs text-white/25 mt-1">PNG, JPG up to 10MB</p>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="relative rounded-xl overflow-hidden h-64">
                                            <img src={imagePreview} alt="Uploaded waste" className="w-full h-full object-cover" />
                                            {isAnalyzing && (
                                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                                    <div className="text-center">
                                                        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-2" />
                                                        <p className="text-sm text-white/80">AI Analyzing Waste...</p>
                                                        <p className="text-xs text-white/40">Classifying waste type and hazard level</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {aiDetected && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Zap className="w-4 h-4 text-emerald-400" />
                                                    <span className="text-xs font-semibold text-emerald-400">AI Detection Result</span>
                                                </div>
                                                <p className="text-sm text-white/80">
                                                    Detected: <strong className="text-emerald-300 capitalize">{aiDetected}</strong> waste with{" "}
                                                    <strong className="text-emerald-300">{Math.floor(Math.random() * 15 + 85)}%</strong> confidence
                                                </p>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                                {imagePreview && !isAnalyzing && (
                                    <div className="flex justify-end mt-4">
                                        <Button className="gradient-primary text-white border-0" onClick={() => setStep(2)}>
                                            Continue
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold text-white">Report Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Waste Category */}
                                <div>
                                    <label className="text-xs font-medium text-white/50 mb-3 block">Waste Category</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                        {wasteCategories.map((cat) => (
                                            <button
                                                key={cat.value}
                                                onClick={() => setSelectedCategory(cat.value)}
                                                className={`p-3 rounded-xl border text-center transition-all ${selectedCategory === cat.value
                                                    ? "border-emerald-500/40 bg-emerald-500/10"
                                                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                                                    }`}
                                            >
                                                <span className="text-xl block mb-1">{cat.icon}</span>
                                                <span className="text-xs text-white/70">{cat.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="text-xs font-medium text-white/50 mb-2 block">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <Input
                                            placeholder="Enter location or use GPS"
                                            className="pl-9 bg-white/[0.04] border-white/[0.08] text-sm"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                        <Button size="sm" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-emerald-400 hover:bg-emerald-500/10">
                                            <MapPin className="w-3 h-3 mr-1" /> GPS
                                        </Button>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-xs font-medium text-white/50 mb-2 block">Description</label>
                                    <Textarea
                                        placeholder="Describe the waste you found..."
                                        className="bg-white/[0.04] border-white/[0.08] text-sm min-h-[100px] resize-none"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                {/* Severity */}
                                <div>
                                    <label className="text-xs font-medium text-white/50 mb-3 block">Severity Level</label>
                                    <div className="flex gap-2">
                                        {severityLevels.map((level) => (
                                            <button
                                                key={level.value}
                                                onClick={() => setSeverity(level.value)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all flex-1 ${severity === level.value
                                                    ? "border-white/20 bg-white/[0.06]"
                                                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.03]"
                                                    }`}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${level.color}`} />
                                                <span className="text-xs text-white/70">{level.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <Button variant="outline" className="border-white/[0.08] text-white/50" onClick={() => setStep(1)}>
                                        Back
                                    </Button>
                                    <Button className="gradient-primary text-white border-0" onClick={() => setStep(3)}>
                                        Continue
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold text-white">Review & Submit</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {imagePreview && (
                                        <div className="rounded-xl overflow-hidden h-48">
                                            <img src={imagePreview} alt="Waste" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="space-y-3">
                                        <div className="p-3 rounded-lg bg-white/[0.03]">
                                            <span className="text-[10px] text-white/30 uppercase tracking-wider">Category</span>
                                            <p className="text-sm text-white/80 font-medium capitalize mt-0.5">{selectedCategory || "Not selected"}</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-white/[0.03]">
                                            <span className="text-[10px] text-white/30 uppercase tracking-wider">Location</span>
                                            <p className="text-sm text-white/80 font-medium mt-0.5">Marina Beach, Chennai</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-white/[0.03]">
                                            <span className="text-[10px] text-white/30 uppercase tracking-wider">Severity</span>
                                            <p className="text-sm text-white/80 font-medium capitalize mt-0.5">{severity}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center bg-white/[0.02] border-t border-white/[0.06] p-4">
                                    <Button variant="ghost" className="text-white/40 hover:text-white" onClick={() => setStep(2)}>
                                        Back
                                    </Button>
                                    <Button className="gradient-primary text-white border-0 min-w-[120px]" onClick={handleSubmit} disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                        {isSubmitting ? "Submitting..." : "Submit Report"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
