"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { NotificationBell } from "@/components/features/notifications/notification-bell";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { LogOut, User as UserIcon } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "@firebase/auth";
import { useRouter } from "next/navigation";

export function CitizenHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/citizen/dashboard" },
    { name: "Tag Litter", href: "/citizen/tag-litter" },
    { name: "Map", href: "/citizen/map" },
    { name: "My Reports", href: "/citizen/my-reports" },
    { name: "Rewards", href: "/rewards" },
    { name: "AI Insights", href: "/ai-insights" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <div className="mr-8 flex items-center">
          <Link href="/citizen/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-headline">EcoSort AI</span>
          </Link>
        </div>
        <nav className="hidden md:flex flex-1 items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80 whitespace-nowrap",
                pathname === item.href ? "text-foreground" : "text-foreground/60"
              )}
            >
              {item.name}
            </Link>
          ))}

        </nav>
        <div className="flex items-center gap-2 ml-auto">
          <NotificationBell />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/citizen/profile">
              <UserIcon className="mr-2 h-4 w-4" /> Profile
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-primary hover:text-primary hover:bg-primary/10">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
