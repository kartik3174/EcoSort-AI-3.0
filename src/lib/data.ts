import type { ChartConfig } from "@/components/ui/chart"

export const citizenStats = [
  { title: "Reports Submitted", value: "142", icon: "FileText" as const },
  { title: "Locations Cleaned", value: "89", icon: "MapPin" as const },
  { title: "Eco Contribution Score", value: "1,280", icon: "Leaf" as const },
  { title: "Pending Reports", value: "12", icon: "Hourglass" as const },
];

export const officialStats = [
  { title: "Total Reports", value: "3,456", icon: "ClipboardList" as const },
  { title: "Pending Cleanup", value: "214", icon: "Trash2" as const },
  { title: "Hazard Alerts", value: "17", icon: "AlertTriangle" as const },
  { title: "Cleaned Locations", value: "2,890", icon: "CheckCircle" as const },
];

export const myReportsData = [
  { id: "REP001", location: "Marina Beach", status: "Cleaned", date: "2024-05-20" },
  { id: "REP002", location: "T. Nagar Market", status: "In Progress", date: "2024-05-22" },
  { id: "REP003", location: "Guindy National Park", status: "Pending", date: "2024-05-23" },
  { id: "REP004", location: "Besant Nagar Beach", status: "Cleaned", date: "2024-05-18" },
  { id: "REP005", location: "Vandalur Zoo Entrance", status: "Pending", date: "2024-05-24" },
];

export type MapReport = {
  id: string;
  location: string;
  status: string;
  date: string;
  lat: number;
  lng: number;
  category: "Still There" | "Cleaned" | "Hazardous" | "Recyclable";
};

export const mapReportsData: MapReport[] = [
  { id: "REP001", location: "Marina Beach", status: "Cleaned", date: "2024-05-20", lat: 13.0545, lng: 80.2828, category: "Cleaned" },
  { id: "REP002", location: "T. Nagar Market", status: "In Progress", date: "2024-05-22", lat: 13.0400, lng: 80.2312, category: "Still There" },
  { id: "REP003", location: "Guindy National Park", status: "Pending", date: "2024-05-23", lat: 13.0075, lng: 80.2100, category: "Hazardous" },
  { id: "REP004", location: "Besant Nagar Beach", status: "Cleaned", date: "2024-05-18", lat: 13.0010, lng: 80.2700, category: "Cleaned" },
  { id: "REP005", location: "Vandalur Zoo Entrance", status: "Pending", date: "2024-05-24", lat: 12.8791, lng: 80.0825, category: "Recyclable" },
  { id: "REP006", location: "Mylapore Tank", status: "Pending", date: "2024-05-25", lat: 13.0335, lng: 80.2697, category: "Still There" },
  { id: "REP007", location: "Velachery Main Road", status: "In Progress", date: "2024-05-25", lat: 12.9791, lng: 80.2181, category: "Hazardous" },
];

export const allReportsData = [
  { id: "REP301", location: "Adyar River Bank", status: "Pending", priority: "High", time: "2 hours ago", image: "https://picsum.photos/seed/adyar/400/250", wasteType: "Hazardous" },
  { id: "REP302", location: "Mylapore Tank", status: "Pending", priority: "Medium", time: "5 hours ago", image: "https://picsum.photos/seed/mylapore/400/250", wasteType: "Recyclable" },
  { id: "REP303", location: "Velachery Main Road", status: "In Progress", priority: "Low", time: "1 day ago", image: "https://picsum.photos/seed/velachery/400/250", wasteType: "General" },
  { id: "REP304", location: "Nungambakkam High Rd", status: "Cleaned", priority: "N/A", time: "2 days ago", image: "https://picsum.photos/seed/nungam/400/250", wasteType: "General" },
];

export const alertsData = [
  { id: "HAZ01", type: "Broken Glass", location: "Adyar River Bank", time: "2 hours ago", severity: "High" },
  { id: "HAZ02", type: "Used Batteries", location: "Ekkaduthangal", time: "8 hours ago", severity: "Medium" },
  { id: "HAZ03", type: "Medical Waste", location: "Porur Junction", time: "1 day ago", severity: "Critical" },
];

export type CleanupTask = {
  id: string;
  reportId: string;
  location: string;
  assignedTo: string;
  status: 'Pending Assignment' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  dateAssigned: string;
};

export const cleanupTasksData: CleanupTask[] = [
  { id: "CLN001", reportId: "REP301", location: "Adyar River Bank", assignedTo: "Team A", status: "In Progress", priority: "High", dateAssigned: "2024-05-25" },
  { id: "CLN002", reportId: "REP302", location: "Mylapore Tank", assignedTo: "Unassigned", status: "Pending Assignment", priority: "Medium", dateAssigned: "2024-05-25" },
  { id: "CLN003", reportId: "REP007", location: "Velachery Main Road", assignedTo: "Team C", status: "Completed", priority: "High", dateAssigned: "2024-05-24" },
  { id: "CLN004", reportId: "REP003", location: "Guindy National Park", assignedTo: "Team B", status: "In Progress", priority: "Medium", dateAssigned: "2024-05-23" },
  { id: "CLN005", reportId: "REP303", location: "Velachery Main Road", assignedTo: "Team C", status: "Completed", priority: "Low", dateAssigned: "2024-05-22" },
];


export const areaChartData = [
  { area: "Adyar", reports: 278, cleaned: 230 },
  { area: "T. Nagar", reports: 189, cleaned: 150 },
  { area: "Mylapore", reports: 320, cleaned: 280 },
  { area: "Velachery", reports: 250, cleaned: 200 },
  { area: "Guindy", reports: 150, cleaned: 120 },
  { area: "Nungambakkam", reports: 210, cleaned: 190 },
];

export const areaChartConfig = {
  reports: {
    label: "Reports",
    color: "hsl(var(--primary))",
  },
  cleaned: {
    label: "Cleaned",
    color: "hsl(var(--secondary-foreground))",
  },
} satisfies ChartConfig

export const trendsChartData = [
  { month: "January", reports: 186, hazardous: 10 },
  { month: "February", reports: 305, hazardous: 15 },
  { month: "March", reports: 237, hazardous: 12 },
  { month: "April", reports: 273, hazardous: 20 },
  { month: "May", reports: 209, hazardous: 18 },
  { month: "June", reports: 214, hazardous: 25 },
];

export const trendsChartConfig = {
  reports: {
    label: "Total Reports",
    color: "hsl(var(--primary))",
  },
  hazardous: {
    label: "Hazardous Reports",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig
