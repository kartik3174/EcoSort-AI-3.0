"use client";

import { AppSidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <AppSidebar />
            <div className="lg:pl-[260px] transition-all duration-300">
                <TopBar />
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
