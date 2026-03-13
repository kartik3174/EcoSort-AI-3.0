"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { citizenStats } from '@/lib/data';
import { Camera, Map as MapIcon } from 'lucide-react';
import { UnifiedLiveStatsGrid } from '@/components/shared/unified-live-stats';
import { motion, Variants } from 'framer-motion';

export default function CitizenDashboardPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Welcome, Citizen!"
          description="Here's your contribution to a cleaner city at a glance."
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <UnifiedLiveStatsGrid initialStats={citizenStats} userType="citizen" />
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mt-8">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none">
            <Button asChild size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
            <Link href="/citizen/tag-litter">
                <Camera className="mr-2" />
                Tag New Litter
            </Link>
            </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-none">
            <Button asChild size="lg" variant="secondary" className="w-full shadow-lg shadow-white/5 border border-white/10">
            <Link href="/citizen/map">
                <MapIcon className="mr-2" />
                View Litter Map
            </Link>
            </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
