import { PageHeader } from "@/components/shared/page-header";
import { AdvancedAIStats } from "@/components/features/ai-insights/advanced-ai-stats";

export default function AIInsightsPage() {
    return (
        <div className="container py-8">
            <PageHeader
                title="AI Waste Insights"
                description="Leverage advanced AI to determine hazard levels, recycling methods, and environmental impact."
            />
            <AdvancedAIStats />
        </div>
    );
}
