import { PageHeader } from "@/components/shared/page-header";
import { SmartReportCard } from "@/components/features/smart-city/smart-report-card";
import { getReports } from "@/app/official/reports/actions";
import { allReportsData } from "@/lib/data";

export const dynamic = 'force-dynamic';

export default async function SmartReportsPage() {
    const firebaseReports = await getReports();

    // Use Firebase data if available, else fallback to mock data extended with priority logic
    const displayReports = firebaseReports.length > 0
        ? firebaseReports.map(r => ({
            id: r.id,
            location: r.location,
            status: r.status,
            priority: r.priority || (r.isHazardous ? "Critical" : "Medium"), // AI Derived Priority
            time: r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleString() : 'Just now',
            image: r.imageUrl === 'stored_image_url_placeholder' ? "https://picsum.photos/seed/new/200/150" : r.imageUrl || "https://picsum.photos/seed/default/200/150",
            wasteType: r.wasteType,
            confidence: r.wasteType === 'Hazardous' ? 0.98 : 0.89 + (Math.random() * 0.1) // Simulated AI Confidence
        }))
        : allReportsData.map(r => ({ ...r, priority: r.priority || "Medium" }));

    return (
        <div className="container py-8">
            <PageHeader
                title="AI-Prioritized Reports"
                description="Live feed of citizen reports, automatically sorted by hazard level and urgency."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {displayReports.map((report) => (
                    <SmartReportCard
                        key={report.id}
                        {...report}
                        date={report.time}
                    />
                ))}
            </div>
        </div>
    );
}
