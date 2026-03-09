"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Send, Sparkles, MapPin, BarChart3, TrendingUp, Loader2, Bot, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    chart?: boolean;
};

const suggestedQuestions = [
    "Where is the nearest recycling center?",
    "Which area has the most garbage reports today?",
    "What waste type is most common?",
    "Show me hazardous waste trends",
    "What's the cleanup efficiency rate?",
    "Predict waste generation for next week",
];

const aiResponses: Record<string, string> = {
    "where is the nearest recycling center?": "The nearest recycling center is **Chennai Green Recycling Hub** located at 45 Anna Salai, Mylapore — approximately **1.2 km** from your current location. They accept plastic, glass, and paper waste. Operating hours: 8 AM - 6 PM daily.\n\nAlternatively, **E-Waste Solutions Chennai** at 12 Industrial Estate, Guindy (3.5 km) specializes in electronic waste.",
    "which area has the most garbage reports today?": "Based on today's data, **Mylapore** leads with **42 waste reports**, followed by:\n\n1. 🔴 Mylapore — 42 reports (15 pending)\n2. 🟡 Adyar — 38 reports (12 pending)\n3. 🟡 T. Nagar — 35 reports (8 pending)\n4. 🟢 Velachery — 28 reports (5 pending)\n5. 🟢 Anna Nagar — 22 reports (3 pending)\n\nMylapore has seen a **23% increase** compared to last week, primarily due to market waste accumulation near the tank area.",
    "what waste type is most common?": "**Plastic waste** is the most commonly reported type, accounting for **35%** of all reports:\n\n• 🟢 Plastic — 35% (PET bottles, packaging)\n• 🟡 Organic — 25% (food waste, garden waste)\n• 🔵 Glass — 15% (bottles, containers)\n• 🟣 Electronic — 15% (phones, circuits)\n• 🔴 Hazardous — 10% (chemicals, medical)\n\nPlastic waste has increased by **12%** this month, mainly single-use packaging from commercial areas.",
    "show me hazardous waste trends": "Hazardous waste incidents have shown a **concerning upward trend** over the past 6 months:\n\n📊 Monthly incidents: Jan(15) → Feb(18) → Mar(12) → Apr(22) → May(20) → Jun(25)\n\n**Key findings:**\n• Medical waste from unauthorized disposal is the primary driver (+40%)\n• Chemical containers near industrial zones remain a persistent issue\n• Electronic hazardous components are increasing with e-waste growth\n\n⚠️ **Recommendation:** Increase monitoring in Guindy Industrial and Porur Junction areas.",
    "what's the cleanup efficiency rate?": "Current cleanup efficiency stands at **87%**, which is a **+5% improvement** from last month:\n\n📊 **Metrics:**\n• Average response time: 2.4 hours\n• First-time resolution: 82%\n• Reports resolved within 24h: 91%\n• Citizen satisfaction: 94%\n\n**Top performing teams:**\n1. Team Alpha (Adyar) — 95% efficiency\n2. Team Gamma (T. Nagar) — 92% efficiency\n3. Team Beta (Mylapore) — 88% efficiency",
    "predict waste generation for next week": "Based on AI analysis of historical patterns, weather data, and local events:\n\n📈 **Predicted waste generation for next week:**\n• Monday: ~65 reports (normal)\n• Tuesday: ~58 reports (normal)\n• Wednesday: ~72 reports (+15% — market day)\n• Thursday: ~55 reports (normal)\n• Friday: ~80 reports (+25% — weekend pre-activity)\n• Saturday: ~95 reports (+40% — peak day)\n• Sunday: ~45 reports (-20% — low activity)\n\n**Total predicted: ~470 reports** (vs. 420 this week)\n\n⚠️ Recommend extra cleanup crews for Wednesday and Saturday.",
};

export default function InsightsPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Hello! I'm your AI waste management assistant. Ask me anything about waste reports, recycling centers, trends, or predictions. How can I help you today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (question?: string) => {
        const text = question || input;
        if (!text.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        setTimeout(() => {
            const lowerText = text.toLowerCase().trim();
            let response = aiResponses[lowerText];

            if (!response) {
                const keys = Object.keys(aiResponses);
                const matchKey = keys.find(k => lowerText.includes(k.split(" ").slice(0, 3).join(" ")));
                response = matchKey ? aiResponses[matchKey] : "Based on our current data analysis, I can help you with waste management insights. Try asking about:\n\n• Nearest recycling centers\n• Area-wise waste reports\n• Common waste types\n• Hazardous waste trends\n• Cleanup efficiency\n• Waste predictions\n\nPlease try one of these topics!";
            }

            const botMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: response };
            setMessages((prev) => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl mx-auto"
        >
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    <Brain className="w-7 h-7 text-violet-400" />
                    AI Insights
                </h1>
                <p className="text-sm text-white/40 mt-1">Ask questions and get intelligent waste management insights</p>
            </div>

            {/* Suggested Questions */}
            <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                    <Button
                        key={q}
                        variant="outline"
                        size="sm"
                        className="border-white/[0.08] text-white/50 text-xs hover:border-violet-500/30 hover:text-violet-300 hover:bg-violet-500/5 transition-all"
                        onClick={() => handleSend(q)}
                    >
                        <Sparkles className="w-3 h-3 mr-1.5 text-violet-400" />
                        {q}
                    </Button>
                ))}
            </div>

            {/* Chat Window */}
            <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden">
                <div
                    ref={scrollRef}
                    className="h-[500px] overflow-y-auto scrollbar-thin p-5 space-y-4"
                >
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {msg.role === "assistant" && (
                                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-violet-400" />
                                </div>
                            )}
                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                    ? "bg-emerald-500/15 text-white/90 rounded-tr-md"
                                    : "bg-white/[0.04] text-white/70 rounded-tl-md"
                                }`}>
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            </div>
                            {msg.role === "user" && (
                                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                    {isTyping && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-violet-400" />
                            </div>
                            <div className="p-4 rounded-2xl rounded-tl-md bg-white/[0.04]">
                                <div className="flex gap-1">
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="w-2 h-2 rounded-full bg-violet-400" />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} className="w-2 h-2 rounded-full bg-violet-400" />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} className="w-2 h-2 rounded-full bg-violet-400" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="border-t border-white/[0.06] p-4">
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Ask about waste management, recycling, trends..."
                            className="bg-white/[0.04] border-white/[0.08] text-sm focus-visible:ring-violet-500/30"
                        />
                        <Button
                            className="gradient-accent text-white border-0 px-4"
                            onClick={() => handleSend()}
                            disabled={isTyping}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
