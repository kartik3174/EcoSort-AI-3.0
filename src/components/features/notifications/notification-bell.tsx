"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

type Notification = {
    id: number;
    title: string;
    message: string;
    time: string;
    read: boolean;
};

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 1, title: "Report Update", message: "Your report #1234 has been marked as Cleaned!", time: "2m ago", read: false },
        { id: 2, title: "Hazard Alert", message: "High severity waste detected near your area.", time: "1h ago", read: false },
        { id: 3, title: "Achievement Unlocked", message: "You earned the 'Green Warrior' badge.", time: "1d ago", read: true },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <Popover onOpenChange={(open) => {
            if (open) markAsRead();
        }}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b bg-muted/50">
                    <h4 className="font-semibold leading-none">Notifications</h4>
                    <p className="text-xs text-muted-foreground mt-1">You have {unreadCount} unread messages.</p>
                </div>
                <ScrollArea className="h-[300px]">
                    <div className="grid gap-1">
                        {notifications.map((notification) => (
                            <div key={notification.id} className={`p-4 border-b last:border-0 hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-sm">{notification.title}</span>
                                    <span className="text-[10px] text-muted-foreground">{notification.time}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {notification.message}
                                </p>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-2 border-t text-center">
                    <Button variant="ghost" size="sm" className="w-full text-xs h-8">
                        View All History
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
