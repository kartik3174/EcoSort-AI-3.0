"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, ShieldCheck, Mail, Building, Briefcase, Award, ExternalLink, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "@firebase/auth";

export default function OfficialProfilePage() {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Close Button */}
            <div className="flex justify-end">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10 border bg-background/50 backdrop-blur hover:bg-destructive/10 hover:text-destructive transition-all"
                    onClick={() => router.back()}
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Official Info */}
                <Card className="md:col-span-1 border-primary/20 bg-card/50 backdrop-blur shadow-xl overflow-hidden self-start">
                    <div className="h-2 bg-primary/40" />
                    <CardHeader className="text-center pt-8">
                        <div className="mx-auto h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-4 border-background shadow-lg overflow-hidden border-double">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <Building className="h-14 w-14 text-primary" />
                            )}
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight">{user?.displayName || "City Official"}</CardTitle>
                        <CardDescription className="text-primary/70 font-medium">Department Head</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 text-sm border border-primary/10">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-primary">System Administrator</span>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30 text-xs space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Officer ID:</span>
                                <span className="font-mono font-bold uppercase">{user?.uid.slice(0, 8) || "ECO-7742"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Access:</span>
                                <span className="text-green-500 font-bold">Level 5 (Full)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Administrative Dashboard Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-primary/20 bg-card/50 backdrop-blur shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-primary" />
                                Official Responsibilities
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-4">
                            <Link href="/official/cleanup" className="p-4 rounded-xl border bg-background/50 hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer block">
                                <h4 className="font-bold group-hover:text-primary transition-colors">Cleanup Oversight</h4>
                                <p className="text-sm text-muted-foreground mt-1">Responsible for assigning and verifying cleanup tasks across Sector 4.</p>
                                <div className="mt-4 flex items-center justify-between text-xs text-primary font-bold">
                                    <span>Active Tasks: 12</span>
                                    <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                            <Link href="/official/reports" className="p-4 rounded-xl border bg-background/50 hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer block">
                                <h4 className="font-bold group-hover:text-primary transition-colors">Citizen Rewards</h4>
                                <p className="text-sm text-muted-foreground mt-1">Approval authority for badge distribution and reward point redemptions.</p>
                                <div className="mt-4 flex items-center justify-between text-xs text-primary font-bold">
                                    <span>Pending Approvals: 5</span>
                                    <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5 shadow-inner">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10 text-primary">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold">Administrative Contact</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Your official email <strong>{user?.email || "official@city.gov"}</strong> is used for all system notifications and verification requests.
                                    </p>
                                    <Button variant="link" className="p-0 h-auto text-primary font-bold text-xs">
                                        Update Contact Preferences
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
