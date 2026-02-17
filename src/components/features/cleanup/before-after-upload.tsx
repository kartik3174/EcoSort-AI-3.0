"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Upload, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

export function BeforeAfterUpload() {
    const router = useRouter();
    const [beforeImage, setBeforeImage] = useState<string | null>(null);
    const [afterImage, setAfterImage] = useState<string | null>(null);
    const [sliderValue, setSliderValue] = useState(50);
    const [isUploaded, setIsUploaded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (type === 'before') setBeforeImage(event.target?.result as string);
                else setAfterImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        setIsProcessing(true);

        // Simulate processing and AI verification
        setTimeout(() => {
            if (!beforeImage) setBeforeImage("https://picsum.photos/seed/dirty/800/600");
            if (!afterImage) setAfterImage("https://picsum.photos/seed/clean/800/600");

            setIsUploaded(true);
            setIsProcessing(false);

            toast({
                title: "Verification Complete",
                description: "AI has successfully verified the cleanup. 150 impact points awarded.",
            });
        }, 1500);
    };

    return (
        <Card className="max-w-4xl mx-auto border-primary/20 bg-card/50 backdrop-blur shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-500 to-primary animate-pulse" />
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    Cleanup Evidence Logger
                </CardTitle>
                <CardDescription>Upload before and after photos to certify cleanup requests and earn EcoRewards.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {!isUploaded ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="aspect-video relative bg-background/50 rounded-xl flex items-center justify-center border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all hover:bg-primary/5 group/upload cursor-pointer overflow-hidden">
                                {beforeImage ? (
                                    <Image src={beforeImage} alt="Before" fill className="object-cover transition-transform group-hover/upload:scale-110" />
                                ) : (
                                    <div className="text-center">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover/upload:scale-110 transition-transform">
                                            <Upload className="h-6 w-6 text-primary" />
                                        </div>
                                        <span className="text-sm font-bold text-muted-foreground">Original State</span>
                                        <p className="text-[10px] text-muted-foreground/60 uppercase mt-1 tracking-tighter">Click to upload or drag</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-50 w-full h-full"
                                    onChange={(e) => handleImageUpload(e, 'before')}
                                    accept="image/*"
                                />
                            </div>
                            <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">
                                <span className="h-[1px] w-4 bg-muted-foreground/20"></span>
                                BEFORE PHOTO
                                <span className="h-[1px] w-4 bg-muted-foreground/20"></span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="aspect-video relative bg-background/50 rounded-xl flex items-center justify-center border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 transition-all hover:bg-emerald-500/5 group/upload cursor-pointer overflow-hidden">
                                {afterImage ? (
                                    <Image src={afterImage} alt="After" fill className="object-cover transition-transform group-hover/upload:scale-110" />
                                ) : (
                                    <div className="text-center">
                                        <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3 group-hover/upload:scale-110 transition-transform">
                                            <Upload className="h-6 w-6 text-emerald-500" />
                                        </div>
                                        <span className="text-sm font-bold text-muted-foreground">Cleaned State</span>
                                        <p className="text-[10px] text-muted-foreground/60 uppercase mt-1 tracking-tighter">Click to upload or drag</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-50 w-full h-full"
                                    onChange={(e) => handleImageUpload(e, 'after')}
                                    accept="image/*"
                                />
                            </div>
                            <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-emerald-600/60 tracking-widest">
                                <span className="h-[1px] w-4 bg-emerald-600/20"></span>
                                AFTER PHOTO
                                <span className="h-[1px] w-4 bg-emerald-600/20"></span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-4 border-emerald-500 shadow-2xl group/slider">
                            {/* Comparison Slider Implementation */}
                            <div className="absolute inset-0 z-0">
                                <Image src={afterImage!} alt="After" fill className="object-cover" />
                            </div>
                            <div
                                className="absolute inset-0 z-10 overflow-hidden"
                                style={{ width: `${sliderValue}%` }}
                            >
                                <Image src={beforeImage!} alt="Before" fill className="object-cover" />
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.8)] z-30 flex items-center justify-center">
                                    <div className="h-8 w-8 rounded-full bg-white shadow-xl flex items-center justify-center -mr-0.5">
                                        <div className="flex gap-0.5">
                                            <div className="w-0.5 h-3 bg-primary rounded-full" />
                                            <div className="w-0.5 h-3 bg-primary rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute inset-x-0 bottom-6 z-20 px-12">
                                <Slider
                                    defaultValue={[50]}
                                    max={100}
                                    step={1}
                                    value={[sliderValue]}
                                    onValueChange={(val) => setSliderValue(val[0])}
                                    className="cursor-ew-resize py-4"
                                />
                                <div className="flex justify-between text-white font-black text-xs mt-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-widest bg-black/20 backdrop-blur-sm px-4 py-1 rounded-full border border-white/20">
                                    <span>BEFORE (WASTE DETECTED)</span>
                                    <span>AFTER (ENVIRONMENT RESTORED)</span>
                                </div>
                            </div>

                            <div className="absolute top-4 right-4 z-20 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-2 animate-bounce">
                                <Check className="h-3 w-3" /> AI VERIFIED CLEANUP
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    {!isUploaded ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={isProcessing}
                            className="bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-xl font-bold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    AI ANALYZING SITE...
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4" /> VERIFY & AWARD POINTS
                                </>
                            )}
                        </Button>
                    ) : (
                        <div className="flex gap-3">
                            <Button variant="outline" className="rounded-xl h-12" onClick={() => setIsUploaded(false)}>
                                Reset Photos
                            </Button>
                            <Button
                                onClick={() => router.push('/official/overview')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 rounded-xl font-bold shadow-lg transition-all hover:scale-105"
                            >
                                <Check className="mr-2 h-4 w-4" /> FINISH & CLOSE TASK
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
