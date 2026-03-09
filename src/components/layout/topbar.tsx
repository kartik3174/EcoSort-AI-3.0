"use client";

import { Bell, Search, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { notificationsData } from "@/lib/data";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { useAuth } from "@/hooks/use-auth";

export function TopBar() {
    const { user, role } = useAuth();
    const [darkMode, setDarkMode] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const unreadCount = notificationsData.filter(n => !n.read).length;

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };

    return (
        <header className="sticky top-0 z-30 h-16 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                {/* Search */}
                <div className="flex-1 max-w-md ml-12 lg:ml-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search reports, locations, waste types..."
                            className="pl-9 h-9 bg-white/[0.04] border-white/[0.08] text-sm focus-visible:ring-emerald-500/30 placeholder:text-white/25"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-white/5"
                        onClick={toggleDarkMode}
                    >
                        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </Button>

                    {/* Notifications */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-white/5 relative"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <Bell className="w-4 h-4" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            )}
                        </Button>

                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="absolute right-0 top-11 w-80 bg-[hsl(220,20%,12%)] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden"
                            >
                                <div className="p-3 border-b border-white/[0.06]">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold text-white">Notifications</h4>
                                        <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-400">
                                            {unreadCount} new
                                        </Badge>
                                    </div>
                                </div>
                                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                                    {notificationsData.slice(0, 5).map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`p-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer ${!notif.read ? "bg-emerald-500/[0.03]" : ""
                                                }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                {!notif.read && (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-white/90 truncate">{notif.title}</p>
                                                    <p className="text-[11px] text-white/40 mt-0.5 line-clamp-2">{notif.message}</p>
                                                    <p className="text-[10px] text-white/25 mt-1">{notif.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-2 border-t border-white/[0.06]">
                                    <Button variant="ghost" className="w-full h-8 text-xs text-emerald-400 hover:bg-emerald-500/10">
                                        View all notifications
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="w-px h-6 bg-white/[0.08] mx-1" />

                    <div className="flex items-center gap-2">
                        {user ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white/40 hidden sm:block">{user.displayName}</span>
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName || "User"} className="w-8 h-8 rounded-full border border-emerald-500/20" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                                        {user.displayName?.charAt(0) || "U"}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 text-xs font-bold">
                                ?
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
