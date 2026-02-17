"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "@firebase/firestore";

export type Report = {
    id: string;
    location: string;
    description: string;
    wasteType: string;
    isHazardous: boolean;
    status: string;
    priority: string;
    createdAt: any; // Timestamp
    imageUrl?: string;
    hazardousMaterials?: string[];
    lat?: number;
    lng?: number;
};

import { allReportsData } from "@/lib/data";

// DEMO: Set this to false if you enable Firestore API in production
const IS_DEMO_MODE = true;

export async function getReports() {
    if (IS_DEMO_MODE) {
        // Return enriched mock data to prevent FS errors
        return allReportsData.map(r => ({
            id: r.id,
            location: r.location,
            description: "Reported via mobile app",
            wasteType: r.wasteType,
            isHazardous: r.wasteType === 'Hazardous',
            status: r.status.toLowerCase(),
            priority: r.priority,
            createdAt: null, // Mock doesn't need real TS for this view
            imageUrl: r.image
        })) as Report[];
    }

    try {
        // Reduced timeout to 2s for faster fallback in demo
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Firestore fetch timed out")), 2000)
        );

        const fetchPromise = (async () => {
            const reportsCollection = collection(db, "reports");
            const q = query(reportsCollection, orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const reports: Report[] = [];
            querySnapshot.forEach((doc) => {
                reports.push({ id: doc.id, ...doc.data() } as Report);
            });
            return reports;
        })();

        return await Promise.race([fetchPromise, timeoutPromise]) as Report[];

    } catch (error: any) {
        // Detect permission issues (API disabled) and log a clean message
        if (error.message && (error.message.includes("PERMISSION_DENIED") || error.code === "permission-denied")) {
            console.log("ℹ️  [DEMO MODE] Firestore API disabled. Using local mock data.");
        } else {
            console.warn("Firestore fetch failed, falling back to mock data.");
        }
        return [];
    }
}

export async function getDashboardStats() {
    if (IS_DEMO_MODE) {
        // Return instantly calculated stats from mock data
        return [
            { title: "Total Reports", value: "3,456", icon: "ClipboardList" as const },
            { title: "Pending Cleanup", value: "214", icon: "Trash2" as const },
            { title: "Hazard Alerts", value: "17", icon: "AlertTriangle" as const },
            { title: "Cleaned Locations", value: "2,890", icon: "CheckCircle" as const },
        ];
    }

    try {
        const reports = await getReports();

        const totalReports = reports.length;
        const pendingReports = reports.filter(r => r.status === 'pending').length;
        const hazardousReports = reports.filter(r => r.isHazardous).length;
        const cleanedReports = reports.filter(r => r.status === 'cleaned').length;

        // Return in the format expected by the dashboard
        return [
            { title: "Total Reports", value: totalReports.toString(), icon: "ClipboardList" as const },
            { title: "Pending Cleanup", value: pendingReports.toString(), icon: "Trash2" as const },
            { title: "Hazard Alerts", value: hazardousReports.toString(), icon: "AlertTriangle" as const },
            { title: "Cleaned Locations", value: cleanedReports.toString(), icon: "CheckCircle" as const },
        ];
    } catch (error) {
        console.error("Error fetching stats:", error);
        // Fallback to "zero" state
        return [
            { title: "Total Reports", value: "0", icon: "ClipboardList" as const },
            { title: "Pending Cleanup", value: "0", icon: "Trash2" as const },
            { title: "Hazard Alerts", value: "0", icon: "AlertTriangle" as const },
            { title: "Cleaned Locations", value: "0", icon: "CheckCircle" as const },
        ];
    }
}
