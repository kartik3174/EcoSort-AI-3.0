import { getReports } from "@/app/official/reports/actions";
import { mapReportsData, type MapReport } from "@/lib/data";
import MapClient from "./map-client";

export const dynamic = 'force-dynamic';

export default async function MapPage() {
  const firebaseReports = await getReports();

  const mappedReports: MapReport[] = firebaseReports
    .filter(r => r.lat && r.lng) // Only reports with location
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

  // Merge with mock data if firebase is empty/sparse for demo
  const displayReports = [...mappedReports, ...mapReportsData];

  return <MapClient reports={displayReports} />;
}

