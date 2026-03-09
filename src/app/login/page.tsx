"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2, ShieldCheck, User as UserIcon, Building2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

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
            // For now, since manual login isn't fully set up with backend, 
            // we'll simulate success or use a demo bypass if credentials match a pattern
            // In a real app, you'd use signInWithEmailAndPassword(auth, email, password)
            if (email && password) {
                // Simulate delay - in real app, obtain user from auth result
                setTimeout(() => {
                    // We can't easily get the UID here without real auth, but for demo:
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

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[hsl(220,20%,10%)]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
                    <p className="text-lg font-medium text-white/60">Initializing EcoSort AI...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[hsl(220,20%,10%)] p-4 relative overflow-hidden">
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-xl z-10"
            >
                <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 gradient-primary opacity-50" />

                    <CardHeader className="text-center pb-8 pt-10">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-lg shadow-emerald-500/20"
                        >
                            <ShieldCheck className="h-8 w-8 text-white" />
                        </motion.div>
                        <CardTitle className="text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {step === "role" ? "Identify Yourself" : `Login as ${role === "official" ? "Official" : "Citizen"}`}
                        </CardTitle>
                        <CardDescription className="text-white/40 mt-2 text-base">
                            {step === "role"
                                ? "Select your access level to continue"
                                : step === "method"
                                    ? "Choose your preferred login method"
                                    : "Enter your credentials to access your account"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-8 pb-10">
                        <AnimatePresence mode="wait">
                            {step === "role" && (
                                <motion.div
                                    key="role-step"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-2 gap-4"
                                >
                                    <button
                                        onClick={() => handleRoleSelect("citizen")}
                                        className="relative p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all duration-300 text-left group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                            <UserIcon className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-bold text-lg text-white">Citizen Login</h3>
                                        <p className="text-xs text-white/30 mt-2">Report waste and earn rewards</p>
                                    </button>

                                    <button
                                        onClick={() => handleRoleSelect("official")}
                                        className="relative p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-violet-500/5 hover:border-violet-500/20 transition-all duration-300 text-left group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4 group-hover:bg-violet-500 group-hover:text-white transition-all">
                                            <Building2 className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-bold text-lg text-white">Official Login</h3>
                                        <p className="text-xs text-white/30 mt-2">Manage city operations</p>
                                    </button>
                                </motion.div>
                            )}

                            {step === "method" && (
                                <motion.div
                                    key="method-step"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <Button
                                        size="lg"
                                        className="w-full h-14 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] text-white flex items-center justify-start px-6 gap-4 group"
                                        onClick={() => setStep("manual")}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                            <UserIcon className="h-4 w-4" />
                                        </div>
                                        <span className="flex-1 text-left">Login as Manually</span>
                                        <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white" />
                                    </Button>

                                    <Button
                                        size="lg"
                                        className="w-full h-14 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] text-white flex items-center justify-start px-6 gap-4 group"
                                        onClick={handleGoogleLogin}
                                        disabled={isLoggingIn}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                        </div>
                                        <span className="flex-1 text-left">Login with Google Login</span>
                                        <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        className="w-full text-white/30 hover:text-white"
                                        onClick={() => setStep("role")}
                                    >
                                        ← Back to selection
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
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/60 ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            className="w-full h-12 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-white/60 ml-1">Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full h-12 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className={`w-full h-12 mt-4 ${role === "official" ? "bg-violet-600 hover:bg-violet-700" : "bg-emerald-600 hover:bg-emerald-700"} text-white border-0`}
                                        disabled={isLoggingIn}
                                    >
                                        {isLoggingIn ? <Loader2 className="animate-spin h-5 w-5" /> : `Log in as ${role}`}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        type="button"
                                        className="w-full text-white/30 hover:text-white"
                                        onClick={() => setStep("method")}
                                    >
                                        ← Back to methods
                                    </Button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        {errorMsg && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs"
                            >
                                {errorMsg}
                            </motion.div>
                        )}

                        <p className="text-center text-[10px] text-white/20 mt-8">
                            By signing in, you agree to our Terms of Service and Privacy Policy.
                            Secure, AI-powered waste management infrastructure.
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}


export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-[hsl(220,20%,10%)]">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
