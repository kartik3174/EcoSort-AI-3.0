"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot } from "lucide-react";

type Message = {
    id: number;
    text: string;
    sender: 'user' | 'bot';
};

export function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Greetings! I am your Eco-Learning Assistant. I am here to provide comprehensive education on environmental science, waste management, and sustainable practices. What topic would you like to explore today?", sender: 'bot' }
    ]);

    const handleSend = () => {
        if (!input.trim()) return;

        const newUserMsg: Message = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, newUserMsg]);
        const currentInput = input;
        setInput("");

        // Simulate Educational Bot Response
        setTimeout(() => {
            let botResponse = "That's an interesting topic! To provide a comprehensive overview, environmental science emphasizes the 'Circular Economy' model—a system aimed at eliminating waste and the continual use of resources. Could you specify if you're interested in material science, waste mitigation, or ecological impacts?";
            const lowerInput = currentInput.toLowerCase();

            if (lowerInput.includes("plastic")) {
                botResponse = "Plastic pollution is a significant global challenge. Most synthetic plastics are derived from petrochemicals and take 450 to 1,000 years to decompose. Polyethylene Terephthalate (#1 PET) and High-Density Polyethylene (#2 HDPE) have the highest recyclability rates. However, the emergence of 'Microplastics' (particles <5mm) is particularly concerning as they enter the food chain via marine life. Transitioning to 'Bioplastics' made from corn starch or sugarcane offers a potential, though complex, alternative.";
            } else if (lowerInput.includes("battery") || lowerInput.includes("electronic") || lowerInput.includes("e-waste")) {
                botResponse = "Electronic waste, or E-waste, is the fastest-growing waste stream globally. Batteries, especially Lithium-ion and Lead-acid, contain heavy metals like Cobalt, Nickel, and Lead. If disposed of in landfills, these can cause 'Leachate'—a toxic liquid that permeates soil and groundwater. Formal recycling facilities use 'Pyrometallurgy' or 'Hydrometallurgy' to safely extract precious metals and neutralize toxins, supporting a sustainable mineral supply chain.";
            } else if (lowerInput.includes("compost") || lowerInput.includes("organic")) {
                botResponse = "Composting is the controlled aerobic biological decomposition of organic materials. This process transforms food scraps and yard waste into 'Humus,' a nutrient-rich soil amendment. In a typical home compost system, Nitrogens (Greens) and Carbons (Browns) should be balanced at a roughly 1:3 ratio. This not only reduces methane emissions from landfills but also improves soil structure and water retention, closing the biological nutrient cycle.";
            } else if (lowerInput.includes("recycling") || lowerInput.includes("process")) {
                botResponse = "The recycling process involves three major stages: Collection, Processing, and Remanufacturing. Material Recovery Facilities (MRFs) use optical sorters and eddy current separators to organize waste. It's crucial to avoid 'Wish-cycling'—the act of putting non-recyclable items into bins—as it contaminates batches. For instance, a single greasy pizza box can ruin an entire load of paper recycling because the oils cannot be separated from the wood fibers during the pulping process.";
            } else if (lowerInput.includes("global warming") || lowerInput.includes("climate") || lowerInput.includes("environment")) {
                botResponse = "Climate change is primarily driven by the 'Greenhouse Effect,' where gases like CO2, Methane, and Nitrous Oxide trap solar thermal energy. Waste management contributes to this through landfill-generated methane, which is 25 times more potent than CO2 over a 100-year period. Sustainable urban development focuses on 'Net Zero' targets, emphasizing renewable energy integration and reforestation as carbon sinks to stabilize the Earth's average temperature.";
            } else if (lowerInput.includes("thank")) {
                botResponse = "You are very welcome! Investing time in environmental education is the first step toward planetary stewardship. Do you have any other questions regarding ecological sustainability or resource management?";
            }

            const newBotMsg: Message = { id: Date.now() + 1, text: botResponse, sender: 'bot' };
            setMessages(prev => [...prev, newBotMsg]);
        }, 800);
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 z-50 transition-all hover:scale-110"
            >
                <MessageCircle className="h-6 w-6 text-white" />
            </Button>
        );
    }

    return (
        <Card className="fixed bottom-6 right-6 w-[350px] md:w-[400px] h-[500px] shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
            <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between rounded-t-lg">
                <CardTitle className="text-base flex items-center gap-2">
                    <Bot className="h-5 w-5" /> EcoBot Assistant
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20">
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden bg-muted/30">
                <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${msg.sender === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                        : 'bg-background border shadow-sm rounded-tl-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-3 bg-background border-t">
                <div className="flex w-full gap-2">
                    <Input
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button size="icon" onClick={handleSend}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
