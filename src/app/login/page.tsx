"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2, ShieldCheck, User as UserIcon, Building2, ChevronRight, Fingerprint, Lock, Mail, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [role, setRole] = useState<"citizen" | "official" | null>(null);
    const [step, setStep] = useState<"role" | "method" | "manual">("role");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const redirectPath = searchParams.get("redirect") || (role === "official" ? "/dashboard/admin" : "/dashboard");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
            if (user) {
                router.push(redirectPath);
            } else {
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router, redirectPath]);

    const handleGoogleLogin = async () => {
        setIsLoggingIn(true);
        setErrorMsg(null);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        try {
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                localStorage.setItem(`role_${result.user.uid}`, role || "citizen");
            }
        } catch (error: any) {
            console.error("Login failed", error);
            setIsLoggingIn(false);
            setErrorMsg(error.message || "An unexpected error occurred.");
        }
    };

    const handleManualLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setErrorMsg(null);
        try {
            if (email && password) {
                setTimeout(() => {
                    localStorage.setItem(`role_demo`, role || "citizen");
                    router.push(redirectPath);
                }, 1500);
            } else {
                throw new Error("Please enter both email and password.");
            }
        } catch (error: any) {
            setErrorMsg(error.message);
            setIsLoggingIn(false);
        }
    };

    const handleRoleSelect = (selectedRole: "citizen" | "official") => {
        setRole(selectedRole);
        setStep("method");
    };

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    if (isLoading) {
        return (
            <div className="flex bg-[#050B14] h-screen w-full items-center justify-center relative overflow-hidden">
                <div className="flex flex-col items-center gap-6 z-10">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="relative w-16 h-16 flex items-center justify-center rounded-full border-t-2 border-r-2 border-emerald-400 border-opacity-80"
                    >
                        <Bot className="w-8 h-8 text-blue-400 absolute animate-pulse" />
                    </motion.div>
                    <p className="text-xl font-mono text-emerald-400 tracking-widest uppercase animate-pulse">Initializing Core...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#050B14] p-4 relative overflow-hidden">
            
            {/* TSParticles Background for Neural Network Effect */}
            <Particles
                id="tsparticles"
                init={particlesInit}
                className="absolute inset-0 pointer-events-auto"
                options={{
                    fullScreen: { enable: false },
                    background: { color: { value: "transparent" } },
                    fpsLimit: 60,
                    interactivity: {
                        events: {
                            onHover: { enable: true, mode: "grab" },
                        },
                        modes: {
                            grab: { distance: 150, links: { opacity: 0.5 } },
                        },
                    },
                    particles: {
                        color: { value: ["#10b981", "#3b82f6"] },
                        links: {
                            color: "#3b82f6",
                            distance: 120,
                            enable: true,
                            opacity: 0.2,
                            width: 1,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outModes: { default: "bounce" },
                            random: false,
                            speed: 1,
                            straight: false,
                        },
                        number: { density: { enable: true, area: 800 }, value: 80 },
                        opacity: { value: 0.5 },
                        shape: { type: "circle" },
                        size: { value: { min: 1, max: 3 } },
                    },
                    detectRetina: true,
                }}
            />

            {/* Glowing Ambient Background Orbs */}
            <motion.div 
                animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, 20, 0] }} 
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" 
            />
            <motion.div 
                animate={{ scale: [1, 1.3, 1], x: [0, -30, 0], y: [0, -40, 0] }} 
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[10%] right-[20%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" 
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-lg z-10"
            >
                {/* Floating Animation for Login Card */}
                <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-full h-full"
                >
                    <Card className="border border-white/5 bg-[#0a1325]/60 backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.05)_inset,0_20px_40px_rgba(0,0,0,0.5)] relative overflow-hidden rounded-3xl group">
                        
                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-blue-500/5 opacity-50" />
                        
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50" />

                        <CardHeader className="text-center pb-6 pt-12 relative z-10">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                                className="mx-auto mb-6 flex h-[84px] w-[84px] items-center justify-center rounded-2xl bg-[#0d1b2a] shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-emerald-500/30 relative"
                            >
                                <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl animate-ping opacity-30 blur-sm" />
                                <ShieldCheck className="h-10 w-10 text-emerald-400 animate-pulse" />
                            </motion.div>
                            <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 pb-2 drop-shadow-sm tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                EcoSort AI
                            </CardTitle>
                            <CardDescription className="text-blue-200/50 text-sm font-medium tracking-widest uppercase">
                                Smart Waste Detection System
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="px-8 pb-12 relative z-10">
                            <AnimatePresence mode="wait">
                                {step === "role" && (
                                    <motion.div
                                        key="role-step"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2"
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.03, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleRoleSelect("citizen")}
                                            className="relative p-6 rounded-2xl border border-blue-500/20 bg-blue-950/20 hover:bg-blue-900/40 hover:border-emerald-500/50 transition-all duration-300 text-left overflow-hidden group shadow-[0_0_15px_rgba(59,130,246,0.05)_inset]"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                                <UserIcon className="h-6 w-6" />
                                            </div>
                                            <h3 className="font-bold text-lg text-white font-mono tracking-wide">Citizen</h3>
                                            <p className="text-xs text-blue-200/50 mt-2">Connect to Grid</p>
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.03, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleRoleSelect("official")}
                                            className="relative p-6 rounded-2xl border border-blue-500/20 bg-blue-950/20 hover:bg-blue-900/40 hover:border-blue-400/50 transition-all duration-300 text-left overflow-hidden group shadow-[0_0_15px_rgba(59,130,246,0.05)_inset]"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                                <Building2 className="h-6 w-6" />
                                            </div>
                                            <h3 className="font-bold text-lg text-white font-mono tracking-wide">Official</h3>
                                            <p className="text-xs text-blue-200/50 mt-2">Admin Terminal</p>
                                        </motion.button>
                                    </motion.div>
                                )}

                                {step === "method" && (
                                    <motion.div
                                        key="method-step"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-4 mt-2"
                                    >
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                size="lg"
                                                className="w-full h-14 bg-[#0a1526]/50 border border-blue-500/30 hover:bg-[#0f1f38] hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] text-white flex items-center justify-start px-6 gap-4 group transition-all rounded-xl"
                                                onClick={() => setStep("manual")}
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:border-emerald-500/50 transition-all">
                                                    <Fingerprint className="h-4 w-4 text-emerald-400" />
                                                </div>
                                                <span className="flex-1 text-left font-mono text-sm tracking-wide">Manual Authentication</span>
                                                <ChevronRight className="h-4 w-4 text-blue-400/50 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                            </Button>
                                        </motion.div>

                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button
                                                size="lg"
                                                className="w-full h-14 bg-[#0a1526]/50 border border-blue-500/30 hover:bg-[#0f1f38] hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] text-white flex items-center justify-start px-6 gap-4 group transition-all rounded-xl"
                                                onClick={handleGoogleLogin}
                                                disabled={isLoggingIn}
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all">
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                    </svg>
                                                </div>
                                                <span className="flex-1 text-left font-mono text-sm tracking-wide">Google Authorization</span>
                                                <ChevronRight className="h-4 w-4 text-blue-400/50 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                            </Button>
                                        </motion.div>

                                        <Button
                                            variant="ghost"
                                            className="w-full text-blue-300/40 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors font-mono text-xs uppercase mt-2 h-10"
                                            onClick={() => setStep("role")}
                                        >
                                            ← Return to Selection
                                        </Button>
                                    </motion.div>
                                )}

                                {step === "manual" && (
                                    <motion.form
                                        key="manual-step"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onSubmit={handleManualLogin}
                                        className="space-y-5 mt-2"
                                    >
                                        <div className="space-y-2 relative group">
                                            <label className="text-xs font-mono text-emerald-400/70 ml-1 uppercase tracking-wider block">Access Identity</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-4 w-4 text-blue-400/50 group-focus-within:text-emerald-400 transition-colors" />
                                                </div>
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="SYS_USER_ID"
                                                    className="w-full h-12 bg-[#050B14]/80 border border-blue-500/30 rounded-xl pl-10 pr-4 text-emerald-100 placeholder:text-blue-400/20 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 focus:bg-[#0a172a] transition-all font-mono text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 relative group">
                                            <label className="text-xs font-mono text-emerald-400/70 ml-1 uppercase tracking-wider block">Security Token</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock className="h-4 w-4 text-blue-400/50 group-focus-within:text-emerald-400 transition-colors" />
                                                </div>
                                                <input
                                                    type="password"
                                                    required
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full h-12 bg-[#050B14]/80 border border-blue-500/30 rounded-xl pl-10 pr-4 text-emerald-100 placeholder:text-blue-400/20 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 focus:bg-[#0a172a] transition-all font-mono text-sm tracking-widest"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                disabled={isLoggingIn}
                                                className={`relative w-full h-12 rounded-xl overflow-hidden group ${role === "official" ? "bg-blue-600" : "bg-emerald-600"}`}
                                            >
                                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md ${role === "official" ? "bg-blue-400" : "bg-emerald-400"}`} />
                                                
                                                <div className="relative flex items-center justify-center h-full text-white font-mono text-sm font-bold tracking-widest uppercase shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
                                                    {isLoggingIn ? <Loader2 className="animate-spin h-5 w-5" /> : `Initiate Protocol: ${role}`}
                                                </div>
                                            </motion.button>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            type="button"
                                            className="w-full text-blue-300/40 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors font-mono text-xs uppercase mt-2 h-10"
                                            onClick={() => setStep("method")}
                                        >
                                            ← Abort Protocol
                                        </Button>
                                    </motion.form>
                                )}
                            </AnimatePresence>

                            {errorMsg && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="mt-6 p-3 rounded-lg bg-red-950/40 border border-red-500/50 text-red-400 text-xs font-mono text-center tracking-wide shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                                >
                                    {">"} ERROR: {errorMsg}
                                </motion.div>
                            )}
                        </CardContent>

                        {/* bottom scan line effect */}
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                    </Card>
                </motion.div>
                
                <p className="text-center text-[10px] text-blue-300/30 mt-8 font-mono tracking-widest uppercase">
                    v3.0.4 // Global Waste Grid Interface // Secure Connection
                </p>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex bg-[#050B14] h-screen w-full items-center justify-center relative overflow-hidden">
                <div className="flex flex-col items-center gap-6 z-10">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="relative w-16 h-16 flex items-center justify-center rounded-full border-t-2 border-r-2 border-emerald-400 border-opacity-80"
                    >
                        <Bot className="w-8 h-8 text-blue-400 absolute animate-pulse" />
                    </motion.div>
                    <p className="text-xl font-mono text-emerald-400 tracking-widest uppercase animate-pulse">Initializing Core...</p>
                </div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
