"use client";

import { PageHeader } from "@/components/shared/page-header";
import { SmartAnalyticsDashboard } from "@/components/features/analytics/smart-analytics-dashboard";
import { PredictiveHotspotWidget } from "@/components/features/predictions/predictive-hotspot";

export default function AnalyticsRootPage() {
    return (
        <div className="container py-8 space-y-8">
            <PageHeader
                title="Smart City Analytics Center"
                description="Comprehensive data intelligence for city-wide waste management operations."
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <SmartAnalyticsDashboard />
                </div>
                <div className="lg:col-span-1">
                    <PredictiveHotspotWidget />
                </div>
            </div>
        </div>
    );
}
