"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Truck, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type ReportCardProps = {
  id: string;
  location: string;
  status: string;
  priority: string;
  time: string;
  image: string;
  wasteType: string;
};

export function ReportCard({ id, location, status, priority, time, image, wasteType }: ReportCardProps) {
  const [imgSrc, setImgSrc] = useState(image);

  const getPriorityClass = (p: string) => {
    if (p === 'High') return 'bg-red-500 text-white';
    if (p === 'Medium') return 'bg-yellow-500 text-black';
    return 'bg-gray-400 text-white';
  };

  const getStatusVariant = (s: string): "default" | "secondary" | "destructive" => {
    switch (s) {
      case "Cleaned": return "default";
      case "In Progress": return "secondary";
      default: return "destructive";
    }
  }

  return (
    <Card className="overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{location}</CardTitle>
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" /> {time}
            </div>
          </div>
          <Badge variant={getStatusVariant(status)}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative aspect-video">
        <Image
          src={imgSrc}
          alt={`Litter at ${location}`}
          layout="fill"
          objectFit="cover"
          onError={() => setImgSrc("https://picsum.photos/seed/fallback/400/250")}
        />
        <div className="absolute top-2 left-2 flex gap-1">
          {priority !== "N/A" && <Badge className={cn("pointer-events-none", getPriorityClass(priority))}>{priority} Priority</Badge>}
          <Badge variant="outline">{wasteType}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-2 bg-muted/50 grid grid-cols-3 gap-1">
        <Button size="sm" variant="ghost" disabled><Truck /> Assign</Button>
        <Button size="sm" variant="ghost" disabled><CheckCircle /> Cleaned</Button>
        <Button size="sm" variant="ghost" disabled><MapPin /> View</Button>
      </CardFooter>
    </Card>
  );
}
