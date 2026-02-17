"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, type User } from "@firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get("redirect") || "/citizen/dashboard";
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
            await signInWithPopup(auth, provider);
            // onAuthStateChanged will handle the redirect
        } catch (error: any) {
            console.error("Login failed", error);
            setIsLoggingIn(false);
            if (error.code === 'auth/configuration-not-found') {
                setErrorMsg("Firebase Configuration Error: Please enable the 'Google' sign-in provider in your Firebase Console (Build > Authentication > Sign-in method).");
            } else {
                setErrorMsg(error.message || "An unexpected error occurred.");
            }
        }
    };

    const handleDemoBypass = () => {
        // Simulate successful login by just redirecting
        router.push(redirectPath);
    };

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-lg font-medium text-muted-foreground">Checking session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
            <Card className="w-full max-w-md border-primary/20 bg-card/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                <CardHeader className="text-center pb-8">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                        Secure Authentication
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mt-2">
                        Sign in to EcoSort AI to continue to your dashboard
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {errorMsg && (
                        <div className="p-3 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs mb-4">
                            {errorMsg}
                        </div>
                    )}

                    <Button
                        size="lg"
                        className="w-full relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
                        onClick={handleGoogleLogin}
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <Mail className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                        )}
                        {isLoggingIn ? "Connecting..." : "Sign in with Google"}
                    </Button>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted/20"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
                    </div>

                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full border-primary/20 hover:bg-primary/5 transition-all"
                        onClick={handleDemoBypass}
                    >
                        Enter as Guest (Demo Mode)
                    </Button>

                    <p className="text-center text-xs text-muted-foreground px-4">
                        By signing in, you agree to our Terms of Service and Privacy Policy.
                        Your data is encrypted and secure.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
