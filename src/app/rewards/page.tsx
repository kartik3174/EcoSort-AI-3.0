import { PageHeader } from "@/components/shared/page-header";
import { GamificationSystem } from "@/components/features/gamification/gamification-system";

export default function RewardsPage() {
    return (
        <div className="container py-8">
            <PageHeader
                title="EcoRewards & Leaderboard"
                description="Track your impact, earn badges, and compete with other eco-warriors."
            />
            <GamificationSystem />
        </div>
    );
}
