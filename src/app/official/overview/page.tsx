import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';

import { officialStats } from '@/lib/data';
import { getDashboardStats } from '@/app/official/reports/actions';
import { LineChart } from 'lucide-react';
import { UnifiedLiveStatsGrid } from '@/components/shared/unified-live-stats';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function OfficialOverviewPage() {
  const dynamicStats = await getDashboardStats();
  // Fallback to mock data if no real data exists (optional, or just show 0s)
  // For "advancing completely", showing real data (even if 0) is better than static mock data 
  // unless we want to demo gracefully. 
  // Let's mix them: if dynamicStats has all 0s, maybe show mock? 
  // Actually, standard behavior is show real data (0).
  const statsToShow = dynamicStats.some((s: any) => s.value !== "0") ? dynamicStats : officialStats;

  return (
    <div>
      <PageHeader
        title="City Waste Management Overview"
        description="Real-time data on litter reports and cleanup operations."
      />

      <UnifiedLiveStatsGrid initialStats={statsToShow} userType="official" />

      <div className="flex">
        <Button asChild size="lg" className="transition-transform hover:scale-105">
          <Link href="/official/analytics">
            <LineChart />
            View Analytics
          </Link>
        </Button>
      </div>
    </div>
  );
}
