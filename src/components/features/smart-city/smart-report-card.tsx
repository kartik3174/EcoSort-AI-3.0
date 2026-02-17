import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PriorityBadge } from "@/components/features/priority/priority-badge";
import { MapPin, Calendar, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import Link from "next/link";

interface SmartReportCardProps {
    id: string;
    location: string;
    status: string;
    priority?: string;
    wasteType?: string;
    confidence?: number;
    image?: string;
    date?: string;
    onViewDetails?: () => void;
}

export function SmartReportCard({
    id,
    location,
    status,
    priority = "Medium",
    wasteType = "General",
    confidence = 0.92,
    image,
    date,
    onViewDetails
}: SmartReportCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/50">
            <div className="relative h-48 w-full bg-muted">
                {image ? (
                    <Image
                        src={image}
                        alt={`Report at ${location}`}
                        fill
                        className="object-cover transition-transform hover:scale-105 duration-500"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <Trash2 className="h-12 w-12 opacity-20" />
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <PriorityBadge level={status === 'Cleaned' ? 'Resolved' : priority} />
                </div>
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
                    <span>{wasteType}</span>
                    <span className="text-emerald-400 font-bold">
                        {Math.round(confidence * 100)}%
                    </span>
                </div>
            </div>

            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold line-clamp-1">{location}</CardTitle>
                </div>
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>ID: {id}</span>
                </div>
            </CardHeader>

            <CardContent className="pb-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{date || "Recently Reported"}</span>
                </div>
            </CardContent>

            <CardFooter className="pt-0">
                <Button variant="outline" className="w-full text-primary hover:text-primary-foreground hover:bg-primary" asChild>
                    <Link href="/ai-insights">
                        View AI Analysis
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
