import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { citizenStats } from '@/lib/data';
import { Camera, Map as MapIcon } from 'lucide-react';
import { UnifiedLiveStatsGrid } from '@/components/shared/unified-live-stats';

export default function CitizenDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Welcome, Citizen!"
        description="Here's your contribution to a cleaner city at a glance."
      />

      <UnifiedLiveStatsGrid initialStats={citizenStats} userType="citizen" />

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="transition-transform hover:scale-105">
          <Link href="/citizen/tag-litter">
            <Camera />
            Tag New Litter
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary" className="transition-transform hover:scale-105">
          <Link href="/citizen/map">
            <MapIcon />
            View Litter Map
          </Link>
        </Button>
      </div>
    </div>
  );
}
