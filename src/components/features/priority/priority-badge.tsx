import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Activity, CheckCircle2 } from "lucide-react";

type PriorityLevel = "Critical" | "High" | "Medium" | "Low" | "Resolved";

interface PriorityBadgeProps {
    level: PriorityLevel | string;
}

export function PriorityBadge({ level }: PriorityBadgeProps) {
    let colorClass = "bg-gray-500 hover:bg-gray-600";
    let Icon = Activity;
    let label = level;

    switch (level.toLowerCase()) {
        case "critical":
        case "hazardous":
            colorClass = "bg-red-600 hover:bg-red-700 animate-pulse";
            Icon = AlertTriangle;
            label = "Critical Hazard";
            break;
        case "high":
            colorClass = "bg-orange-500 hover:bg-orange-600";
            Icon = AlertTriangle;
            label = "High Priority";
            break;
        case "medium":
            colorClass = "bg-yellow-500 hover:bg-yellow-600 text-black";
            Icon = Clock;
            label = "Medium Priority";
            break;
        case "low":
        case "normal":
            colorClass = "bg-blue-500 hover:bg-blue-600";
            Icon = Activity;
            label = "Low Priority";
            break;
        case "resolved":
        case "cleaned":
            colorClass = "bg-green-500 hover:bg-green-600";
            Icon = CheckCircle2;
            label = "Resolved";
            break;
    }

    return (
        <Badge className={`${colorClass} flex items-center gap-1 px-2 py-1`}>
            <Icon className="h-3 w-3" />
            <span>{label}</span>
        </Badge>
    );
}
