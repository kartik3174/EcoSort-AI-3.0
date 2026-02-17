import { PageHeader } from "@/components/shared/page-header";
import { ReportCard } from "@/components/official/report-card";
import { allReportsData } from "@/lib/data";
import { getReports } from "./actions";

// Force dynamic rendering to ensure we get the latest reports
export const dynamic = 'force-dynamic';

export default async function ReportsManagementPage() {
  const firebaseReports = await getReports();

  // Combine or fallback to mock data if firebase is empty (for demo purposes)
  // In a real app, you might just show firebaseReports
  const displayReports = firebaseReports.length > 0
    ? firebaseReports.map(r => ({
      id: r.id,
      location: r.location,
      status: r.status,
      priority: r.priority,
      time: r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleString() : 'Just now',
      image: r.imageUrl === 'stored_image_url_placeholder' ? "https://picsum.photos/seed/new/200/150" : r.imageUrl || "https://picsum.photos/seed/default/200/150",
      wasteType: r.wasteType
    }))
    : allReportsData;

  return (
    <div>
      <PageHeader
        title="Incoming Reports"
        description="Manage and take action on new citizen submissions."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayReports.map((report) => (
          <ReportCard key={report.id} {...report} />
        ))}
      </div>
    </div>
  );
}

