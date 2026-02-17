import { getReports } from "@/app/official/reports/actions";
import { mapReportsData, type MapReport } from "@/lib/data";
import LiveMapClient from "./live-map-client";

export const dynamic = 'force-dynamic';

export default async function LiveMapPage() {
  const firebaseReports = await getReports();

  const mappedReports: MapReport[] = firebaseReports
    .filter(r => r.lat && r.lng)
    .map(r => {
      let category: MapReport['category'] = "Still There";
      if (r.status === 'cleaned') category = "Cleaned";
      else if (r.isHazardous) category = "Hazardous";
      else if (r.wasteType.toLowerCase().includes('recycl')) category = "Recyclable";

      return {
        id: r.id,
        location: r.location,
        status: r.status,
        date: r.createdAt ? new Date(r.createdAt.seconds * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        lat: r.lat!,
        lng: r.lng!,
        category: category
      };
    });

  const displayReports = [...mappedReports, ...mapReportsData];

  return <LiveMapClient reports={displayReports} />;
}

