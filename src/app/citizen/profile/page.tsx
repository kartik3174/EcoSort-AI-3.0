"use client";

import { useRouter } from "next/navigation";
import { X, Award, Medal, Download, Shield, Trophy, User, Mail, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "@firebase/auth";

export default function CitizenProfilePage() {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });
        return () => unsubscribe();
    }, []);

    const handleDownloadCertificate = () => {
        // In a real app, this might generate a PDF or open a new window with a printable view
        alert("Preparing your Eco-Champion Certificate for download...");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Minimalist Close Button */}
            <div className="flex justify-end">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10 border bg-background/50 backdrop-blur hover:bg-destructive/10 hover:text-destructive transition-all shadow-sm"
                    onClick={() => router.back()}
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: User Info */}
                <Card className="md:col-span-1 border-primary/20 bg-card/50 backdrop-blur shadow-xl overflow-hidden self-start">
                    <div className="h-2 bg-primary" />
                    <CardHeader className="text-center pt-8">
                        <div className="mx-auto h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-4 border-background shadow-lg overflow-hidden group">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                            ) : (
                                <User className="h-14 w-14 text-primary" />
                            )}
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight">{user?.displayName || "Citizen Member"}</CardTitle>
                        <CardDescription>{user?.email || "Eco Enthusiast"}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 text-sm">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="font-medium">Active Member</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5 text-sm text-amber-600 dark:text-amber-400">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-medium">Top 5% Contributor</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Achievements & Certificate */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-primary/20 bg-card/50 backdrop-blur shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-500" />
                                Your Achievements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-4">
                            <div className="flex flex-col p-4 rounded-xl bg-background/50 border border-border/50 transition-all hover:border-primary/30 group">
                                <Award className="h-8 w-8 text-primary mb-2 transition-transform group-hover:scale-110" />
                                <h4 className="font-bold text-lg">Eco-Warrior</h4>
                                <p className="text-xs text-muted-foreground mt-1">Successfully reported 50+ litter items.</p>
                                <div className="mt-4 h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[85%]" />
                                </div>
                                <span className="text-[10px] text-right mt-1 font-mono">85% Complete</span>
                            </div>
                            <div className="flex flex-col p-4 rounded-xl bg-background/50 border border-border/50 transition-all hover:border-primary/30 group">
                                <Medal className="h-8 w-8 text-blue-500 mb-2 transition-transform group-hover:scale-110" />
                                <h4 className="font-bold text-lg">Green Elite</h4>
                                <p className="text-xs text-muted-foreground mt-1">Ranked in top 100 city contributors.</p>
                                <div className="mt-4 h-1.5 w-full bg-blue-500/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-full" />
                                </div>
                                <span className="text-[10px] text-right mt-1 font-mono text-blue-500 uppercase tracking-tighter">Unlocked</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Certificate Preview Card */}
                    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-background shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-grid-white/5 mask-image-linear-gradient" />
                        <CardContent className="p-8 relative">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="space-y-4 text-center sm:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest shadow-lg">
                                        Verified Achievement
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black text-foreground drop-shadow-sm">Eco-Champion 2026</h3>
                                        <p className="text-muted-foreground max-w-sm">
                                            This certificate honors your outstanding dedication to urban sustainability and waste reduction.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleDownloadCertificate}
                                        size="lg"
                                        className="rounded-full px-8 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group/btn"
                                    >
                                        <Download className="mr-2 h-5 w-5 transition-transform group-hover/btn:translate-y-1" />
                                        Download Certificate
                                    </Button>
                                </div>

                                {/* Certificate Visual Placeholder */}
                                <div className="hidden sm:block w-48 h-64 bg-background border-4 border-double border-primary/30 rounded shadow-2xl skew-x-3 -rotate-3 transition-transform group-hover:rotate-0 group-hover:skew-x-0 group-hover:scale-110 duration-500 p-4 font-serif text-[6px] text-center space-y-2">
                                    <div className="w-10 h-10 border border-primary/20 rounded-full mx-auto" />
                                    <h5 className="text-[10px] text-primary">EcoSort AI</h5>
                                    <div className="w-full h-px bg-primary/10" />
                                    <p className="italic">Awarded to</p>
                                    <p className="font-bold text-[8px]">{user?.displayName || "Citizen"}</p>
                                    <p>For excellence in citizenship</p>
                                    <div className="mt-8 pt-4 border-t border-primary/10 flex justify-between">
                                        <span>Signature</span>
                                        <span>Seal</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
