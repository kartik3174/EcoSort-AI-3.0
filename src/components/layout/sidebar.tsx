"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Map,
    FileText,
    ScanLine,
    Brain,
    BarChart3,
    Users,
    Trophy,
    Gift,
    Leaf,
    Settings,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    Recycle,
    LogOut,
    Bell,
    X,
    Menu,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Smart Waste Map", href: "/dashboard/map", icon: Map },
    { name: "Report Waste", href: "/dashboard/report", icon: FileText },
    { name: "AI Waste Scanner", href: "/dashboard/scanner", icon: ScanLine },
    { name: "AI Insights", href: "/dashboard/insights", icon: Brain },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Community", href: "/dashboard/community", icon: Users },
    { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
    { name: "Rewards", href: "/dashboard/rewards", icon: Gift },
    { name: "Impact", href: "/dashboard/impact", icon: Leaf },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Admin Panel", href: "/dashboard/admin", icon: ShieldCheck, admin: true },
];

export function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, role, loading } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    // Filter navigation items based on role
    const filteredNavItems = navItems.filter(item => {
        // Admin Panel should only be visible to officials
        if (item.admin && role !== "official") return false;

        // Report Waste and AI Waste Scanner should only be visible to citizens
        if (role === "official") {
            if (item.href === "/dashboard/report" || item.href === "/dashboard/scanner") {
                return false;
            }
        }

        return true;
    });

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]", collapsed && "justify-center px-2")}>
                <div className="relative flex-shrink-0">
                    <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Recycle className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[hsl(220,20%,12%)] animate-pulse" />
                </div>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <span className="font-bold text-base text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            EcoSort AI
                        </span>
                        <span className="text-[10px] text-emerald-400/70 font-medium tracking-wider uppercase">
                            Smart Waste Platform
                        </span>
                    </motion.div>
                )}
            </div>

            {/* Nav Items */}
            <ScrollArea className="flex-1 py-3">
                <nav className="px-2 space-y-0.5">
                    {filteredNavItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative",
                                    active
                                        ? "bg-emerald-500/15 text-emerald-400"
                                        : "text-white/50 hover:text-white/90 hover:bg-white/[0.04]",
                                    collapsed && "justify-center px-2",
                                    item.admin && "mt-4 border-t border-white/[0.06] pt-4"
                                )}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-400 rounded-r-full"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <item.icon className={cn(
                                    "w-[18px] h-[18px] flex-shrink-0 transition-colors",
                                    active ? "text-emerald-400" : "text-white/40 group-hover:text-white/70"
                                )} />
                                {!collapsed && (
                                    <span className="truncate">{item.name}</span>
                                )}
                                {!collapsed && item.admin && (
                                    <Badge variant="outline" className="ml-auto text-[10px] border-violet-500/30 text-violet-400 bg-violet-500/10">
                                        Admin
                                    </Badge>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>

            {/* User Section */}
            {!collapsed && user && (
                <div className="p-3 border-t border-white/[0.06]">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03]">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName || "User"} className="w-8 h-8 rounded-full border border-emerald-500/20" />
                        ) : (
                            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold leading-none">
                                {user.displayName?.charAt(0) || "U"}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white/90 truncate">{user.displayName || "User"}</p>
                            <p className="text-[10px] text-white/40">{role === 'official' ? 'Official Account' : 'Citizen Account'}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Collapse Button (Desktop) */}
            <div className="hidden lg:flex p-2 border-t border-white/[0.06] justify-center">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="h-7 w-7 text-white/30 hover:text-white/60 hover:bg-white/5"
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed top-3 left-3 z-50 lg:hidden h-9 w-9 bg-[hsl(220,20%,12%)] border border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed left-0 top-0 bottom-0 w-[260px] bg-[hsl(220,20%,10%)] border-r border-white/[0.06] z-50 lg:hidden"
                    >
                        <SidebarContent />
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 68 : 260 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-[hsl(220,20%,10%)] border-r border-white/[0.06] z-40"
            >
                <SidebarContent />
            </motion.aside>
        </>
    );
}
