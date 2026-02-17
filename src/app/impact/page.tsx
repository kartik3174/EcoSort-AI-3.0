import { PageHeader } from "@/components/shared/page-header";
import { ImpactMetricsCard, DetailedImpactAnalysis } from "@/components/features/impact/impact-dashboard";

export default function ImpactPage() {
    return (
        <div className="container py-8">
            <PageHeader
                title="Environmental Impact Dashboard"
                description="Real-time metrics on how our collective efforts are saving the planet."
            />
            <ImpactMetricsCard />
            <DetailedImpactAnalysis />
        </div>
    );
}
