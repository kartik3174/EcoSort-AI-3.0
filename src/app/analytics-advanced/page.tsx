import { PageHeader } from "@/components/shared/page-header";
import { SmartAnalyticsDashboard } from "@/components/features/analytics/smart-analytics-dashboard";

export default function AdvancedAnalyticsPage() {
    return (
        <div className="container py-8">
            <PageHeader
                title="Smart Analytics Suite"
                description="Deep dive into cleanup performance, waste composition, and community impact."
            />
            <SmartAnalyticsDashboard />
        </div>
    );
}
