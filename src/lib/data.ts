import type { ChartConfig } from "@/components/ui/chart"

// ============================================
// DASHBOARD DATA
// ============================================
export const dashboardStats = [
  { title: "Total Reports Today", value: "247", change: "+12%", icon: "FileText" as const, color: "emerald" as const },
  { title: "Hazardous Alerts", value: "13", change: "-3%", icon: "AlertTriangle" as const, color: "rose" as const },
  { title: "Active Citizens", value: "1,842", change: "+8%", icon: "Users" as const, color: "violet" as const },
  { title: "Eco Impact Score", value: "94.2", change: "+5%", icon: "Leaf" as const, color: "teal" as const },
];

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

// ============================================
// MAP DATA
// ============================================
export type MapReport = {
  id: string;
  location: string;
  status: string;
  date: string;
  lat: number;
  lng: number;
  category: "Plastic" | "Organic" | "Glass" | "Electronic" | "Hazardous";
  severity: "Low" | "Medium" | "High" | "Critical";
  reporter: string;
  description: string;
  image?: string;
};

export const mapReportsData: MapReport[] = [
  { id: "REP001", location: "Marina Beach", status: "Cleaned", date: "2024-05-20", lat: 13.0545, lng: 80.2828, category: "Plastic", severity: "Medium", reporter: "Arun K.", description: "Large plastic waste accumulation near shore", image: "https://picsum.photos/seed/marina/400/250" },
  { id: "REP002", location: "T. Nagar Market", status: "In Progress", date: "2024-05-22", lat: 13.0400, lng: 80.2312, category: "Organic", severity: "Low", reporter: "Priya S.", description: "Food waste from market vendors", image: "https://picsum.photos/seed/tnagar/400/250" },
  { id: "REP003", location: "Guindy National Park", status: "Pending", date: "2024-05-23", lat: 13.0075, lng: 80.2100, category: "Hazardous", severity: "Critical", reporter: "Raj M.", description: "Chemical waste containers found near entrance", image: "https://picsum.photos/seed/guindy/400/250" },
  { id: "REP004", location: "Besant Nagar Beach", status: "Cleaned", date: "2024-05-18", lat: 13.0010, lng: 80.2700, category: "Glass", severity: "High", reporter: "Kavitha R.", description: "Broken glass bottles scattered on beach", image: "https://picsum.photos/seed/besant/400/250" },
  { id: "REP005", location: "Vandalur Zoo Entrance", status: "Pending", date: "2024-05-24", lat: 12.8791, lng: 80.0825, category: "Electronic", severity: "Medium", reporter: "Suresh L.", description: "E-waste dumping near zoo entrance", image: "https://picsum.photos/seed/vandalur/400/250" },
  { id: "REP006", location: "Mylapore Tank", status: "Pending", date: "2024-05-25", lat: 13.0335, lng: 80.2697, category: "Plastic", severity: "High", reporter: "Deepa V.", description: "Plastic bags and bottles floating in tank", image: "https://picsum.photos/seed/mylapore/400/250" },
  { id: "REP007", location: "Velachery Main Road", status: "In Progress", date: "2024-05-25", lat: 12.9791, lng: 80.2181, category: "Hazardous", severity: "Critical", reporter: "Kumar N.", description: "Medical waste found in open drain", image: "https://picsum.photos/seed/velachery/400/250" },
  { id: "REP008", location: "Anna Nagar Tower", status: "Pending", date: "2024-05-26", lat: 13.0850, lng: 80.2101, category: "Organic", severity: "Low", reporter: "Sita P.", description: "Garden waste piled near park", image: "https://picsum.photos/seed/annanagar/400/250" },
  { id: "REP009", location: "Adyar Bridge", status: "In Progress", date: "2024-05-26", lat: 13.0063, lng: 80.2573, category: "Plastic", severity: "High", reporter: "Ganesh T.", description: "Large dump of plastic packaging", image: "https://picsum.photos/seed/adyar/400/250" },
  { id: "REP010", location: "Chromepet Railway", status: "Pending", date: "2024-05-27", lat: 12.9516, lng: 80.1387, category: "Electronic", severity: "Medium", reporter: "Meera J.", description: "Old electronics dumped near tracks", image: "https://picsum.photos/seed/chromepet/400/250" },
];

// ============================================
// REPORTS DATA
// ============================================
export const myReportsData = [
  { id: "REP001", location: "Marina Beach", status: "Cleaned", date: "2024-05-20" },
  { id: "REP002", location: "T. Nagar Market", status: "In Progress", date: "2024-05-22" },
  { id: "REP003", location: "Guindy National Park", status: "Pending", date: "2024-05-23" },
  { id: "REP004", location: "Besant Nagar Beach", status: "Cleaned", date: "2024-05-18" },
  { id: "REP005", location: "Vandalur Zoo Entrance", status: "Pending", date: "2024-05-24" },
];

export const allReportsData = [
  { id: "REP301", location: "Adyar River Bank", status: "Pending", priority: "High", time: "2 hours ago", image: "https://picsum.photos/seed/adyar2/400/250", wasteType: "Hazardous" },
  { id: "REP302", location: "Mylapore Tank", status: "Pending", priority: "Medium", time: "5 hours ago", image: "https://picsum.photos/seed/mylapore2/400/250", wasteType: "Plastic" },
  { id: "REP303", location: "Velachery Main Road", status: "In Progress", priority: "Low", time: "1 day ago", image: "https://picsum.photos/seed/velachery2/400/250", wasteType: "Organic" },
  { id: "REP304", location: "Nungambakkam High Rd", status: "Cleaned", priority: "N/A", time: "2 days ago", image: "https://picsum.photos/seed/nungam2/400/250", wasteType: "Glass" },
  { id: "REP305", location: "Porur Lake", status: "Pending", priority: "Critical", time: "30 min ago", image: "https://picsum.photos/seed/porur/400/250", wasteType: "Hazardous" },
  { id: "REP306", location: "Sholinganallur IT Park", status: "In Progress", priority: "Medium", time: "3 hours ago", image: "https://picsum.photos/seed/sholinganallur/400/250", wasteType: "Electronic" },
];

// ============================================
// ALERTS DATA
// ============================================
export const alertsData = [
  { id: "HAZ01", type: "Broken Glass", location: "Adyar River Bank", time: "2 hours ago", severity: "High" },
  { id: "HAZ02", type: "Used Batteries", location: "Ekkaduthangal", time: "8 hours ago", severity: "Medium" },
  { id: "HAZ03", type: "Medical Waste", location: "Porur Junction", time: "1 day ago", severity: "Critical" },
  { id: "HAZ04", type: "Chemical Containers", location: "Guindy Industrial", time: "3 hours ago", severity: "Critical" },
  { id: "HAZ05", type: "Asbestos Debris", location: "Perambur", time: "5 hours ago", severity: "High" },
];

// ============================================
// CLEANUP DATA
// ============================================
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

// ============================================
// ANALYTICS DATA
// ============================================
export const wasteTypeDistribution = [
  { name: "Plastic", value: 35, fill: "hsl(152, 68%, 50%)" },
  { name: "Organic", value: 25, fill: "hsl(30, 95%, 55%)" },
  { name: "Glass", value: 15, fill: "hsl(200, 80%, 55%)" },
  { name: "Electronic", value: 15, fill: "hsl(262, 68%, 60%)" },
  { name: "Hazardous", value: 10, fill: "hsl(0, 72%, 51%)" },
];

export const dailyReportsData = [
  { date: "Mon", reports: 45, resolved: 38 },
  { date: "Tue", reports: 52, resolved: 44 },
  { date: "Wed", reports: 49, resolved: 41 },
  { date: "Thu", reports: 63, resolved: 55 },
  { date: "Fri", reports: 58, resolved: 48 },
  { date: "Sat", reports: 72, resolved: 60 },
  { date: "Sun", reports: 38, resolved: 32 },
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
    color: "hsl(var(--chart-1))",
  },
  cleaned: {
    label: "Cleaned",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export const trendsChartData = [
  { month: "January", reports: 186, hazardous: 10 },
  { month: "February", reports: 305, hazardous: 15 },
  { month: "March", reports: 237, hazardous: 12 },
  { month: "April", reports: 273, hazardous: 20 },
  { month: "May", reports: 209, hazardous: 18 },
  { month: "June", reports: 214, hazardous: 25 },
  { month: "July", reports: 298, hazardous: 22 },
  { month: "August", reports: 340, hazardous: 28 },
  { month: "September", reports: 280, hazardous: 19 },
  { month: "October", reports: 310, hazardous: 24 },
  { month: "November", reports: 265, hazardous: 16 },
  { month: "December", reports: 320, hazardous: 30 },
];

export const trendsChartConfig = {
  reports: {
    label: "Total Reports",
    color: "hsl(var(--chart-1))",
  },
  hazardous: {
    label: "Hazardous Reports",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig

export const monthlyWasteTrends = [
  { month: "Jan", plastic: 120, organic: 80, glass: 45, electronic: 30, hazardous: 15 },
  { month: "Feb", plastic: 135, organic: 90, glass: 50, electronic: 35, hazardous: 18 },
  { month: "Mar", plastic: 110, organic: 85, glass: 40, electronic: 28, hazardous: 12 },
  { month: "Apr", plastic: 145, organic: 95, glass: 55, electronic: 40, hazardous: 22 },
  { month: "May", plastic: 130, organic: 88, glass: 48, electronic: 32, hazardous: 20 },
  { month: "Jun", plastic: 155, organic: 100, glass: 60, electronic: 45, hazardous: 25 },
];

export const hazardousIncidents = [
  { month: "Jan", chemical: 3, medical: 5, electronic: 2, other: 5 },
  { month: "Feb", chemical: 4, medical: 6, electronic: 3, other: 2 },
  { month: "Mar", chemical: 2, medical: 4, electronic: 4, other: 2 },
  { month: "Apr", chemical: 5, medical: 8, electronic: 3, other: 4 },
  { month: "May", chemical: 3, medical: 7, electronic: 5, other: 3 },
  { month: "Jun", chemical: 6, medical: 9, electronic: 4, other: 6 },
];

// ============================================
// LEADERBOARD DATA
// ============================================
export const leaderboardData = [
  { rank: 1, username: "EcoWarrior_Arun", reports: 342, ecoPoints: 8450, avatar: "https://picsum.photos/seed/avatar1/100/100", badge: "Eco Hero" },
  { rank: 2, username: "GreenCity_Priya", reports: 298, ecoPoints: 7620, avatar: "https://picsum.photos/seed/avatar2/100/100", badge: "Plastic Warrior" },
  { rank: 3, username: "CleanBeach_Raj", reports: 276, ecoPoints: 7100, avatar: "https://picsum.photos/seed/avatar3/100/100", badge: "Clean City Champion" },
  { rank: 4, username: "RecycleKing_Kumar", reports: 251, ecoPoints: 6540, avatar: "https://picsum.photos/seed/avatar4/100/100", badge: "Top Reporter" },
  { rank: 5, username: "ZeroWaste_Meera", reports: 234, ecoPoints: 6120, avatar: "https://picsum.photos/seed/avatar5/100/100", badge: "Eco Hero" },
  { rank: 6, username: "NatureFirst_Sita", reports: 212, ecoPoints: 5680, avatar: "https://picsum.photos/seed/avatar6/100/100", badge: "Plastic Warrior" },
  { rank: 7, username: "EarthGuard_Deepa", reports: 198, ecoPoints: 5230, avatar: "https://picsum.photos/seed/avatar7/100/100", badge: "Clean City Champion" },
  { rank: 8, username: "GreenLeaf_Ganesh", reports: 187, ecoPoints: 4890, avatar: "https://picsum.photos/seed/avatar8/100/100", badge: "Top Reporter" },
  { rank: 9, username: "WasteNot_Kavitha", reports: 175, ecoPoints: 4560, avatar: "https://picsum.photos/seed/avatar9/100/100", badge: "Eco Hero" },
  { rank: 10, username: "PlanetSave_Suresh", reports: 163, ecoPoints: 4220, avatar: "https://picsum.photos/seed/avatar10/100/100", badge: "Plastic Warrior" },
];

// ============================================
// COMMUNITY DATA
// ============================================
export const communityEvents = [
  { id: "EVT001", title: "Beach Cleanup Drive", date: "2024-06-15", time: "7:00 AM", location: "Marina Beach", participants: 85, maxParticipants: 150, status: "Upcoming" },
  { id: "EVT002", title: "Park Restoration Project", date: "2024-06-20", time: "8:00 AM", location: "Guindy National Park", participants: 42, maxParticipants: 80, status: "Upcoming" },
  { id: "EVT003", title: "River Bank Cleanup", date: "2024-06-10", time: "6:30 AM", location: "Adyar River", participants: 120, maxParticipants: 120, status: "Completed" },
  { id: "EVT004", title: "E-Waste Collection Drive", date: "2024-06-25", time: "9:00 AM", location: "T. Nagar Community Hall", participants: 30, maxParticipants: 100, status: "Upcoming" },
];

export const ecoChallenges = [
  { id: "CH001", title: "Zero Plastic Week", description: "Report 10 plastic waste items in a week", progress: 70, reward: 500, deadline: "3 days left", participants: 324 },
  { id: "CH002", title: "Neighborhood Hero", description: "Clean up 5 reported waste locations", progress: 40, reward: 750, deadline: "5 days left", participants: 189 },
  { id: "CH003", title: "Hazard Hunter", description: "Report 3 hazardous waste items", progress: 100, reward: 1000, deadline: "Completed", participants: 456 },
  { id: "CH004", title: "Recycling Champion", description: "Submit 20 verified recyclable waste reports", progress: 55, reward: 800, deadline: "1 week left", participants: 267 },
];

// ============================================
// REWARDS DATA
// ============================================
export const badges = [
  { id: "B001", name: "Eco Hero", description: "Submit 100+ verified waste reports", icon: "Shield", earned: true, color: "emerald" },
  { id: "B002", name: "Plastic Warrior", description: "Report 50+ plastic waste items", icon: "Sword", earned: true, color: "blue" },
  { id: "B003", name: "Clean City Champion", description: "Participate in 10+ cleanup events", icon: "Trophy", earned: false, color: "amber" },
  { id: "B004", name: "Top Reporter", description: "Be in top 10 leaderboard for a month", icon: "Crown", earned: true, color: "violet" },
  { id: "B005", name: "Hazard Guardian", description: "Report 20+ hazardous waste items", icon: "AlertTriangle", earned: false, color: "rose" },
  { id: "B006", name: "Community Leader", description: "Organize 5+ cleanup events", icon: "Users", earned: false, color: "teal" },
];

export const rewardsHistory = [
  { date: "2024-05-25", action: "Reported waste at Marina Beach", points: 50 },
  { date: "2024-05-24", action: "Participated in Beach Cleanup Drive", points: 200 },
  { date: "2024-05-23", action: "Verified report accepted", points: 75 },
  { date: "2024-05-22", action: "Completed Hazard Hunter challenge", points: 1000 },
  { date: "2024-05-21", action: "Reported 3 waste items", points: 150 },
  { date: "2024-05-20", action: "Reached Eco Hero badge", points: 500 },
];

// ============================================
// IMPACT DATA
// ============================================
export const impactMetrics = [
  { label: "Waste Collected", value: "12.4", unit: "Tons", progress: 78, icon: "Trash2", color: "emerald" },
  { label: "Plastic Recycled", value: "4.2", unit: "Tons", progress: 65, icon: "Recycle", color: "blue" },
  { label: "CO₂ Prevented", value: "8.7", unit: "Tons", progress: 82, icon: "Wind", color: "teal" },
  { label: "Community Participation", value: "1,842", unit: "Citizens", progress: 91, icon: "Users", color: "violet" },
];

export const impactOverTime = [
  { month: "Jan", wasteCollected: 1.2, plasticRecycled: 0.4, co2Prevented: 0.8 },
  { month: "Feb", wasteCollected: 1.5, plasticRecycled: 0.5, co2Prevented: 1.0 },
  { month: "Mar", wasteCollected: 1.8, plasticRecycled: 0.6, co2Prevented: 1.2 },
  { month: "Apr", wasteCollected: 2.1, plasticRecycled: 0.7, co2Prevented: 1.4 },
  { month: "May", wasteCollected: 2.5, plasticRecycled: 0.8, co2Prevented: 1.6 },
  { month: "Jun", wasteCollected: 3.3, plasticRecycled: 1.2, co2Prevented: 2.7 },
];

// ============================================
// NOTIFICATION DATA
// ============================================
export const notificationsData = [
  { id: "N001", type: "hazard", title: "Hazardous waste detected nearby", message: "Chemical containers found at Guindy Industrial, 2km from your location.", time: "5 min ago", read: false },
  { id: "N002", type: "event", title: "Cleanup drive scheduled", message: "Beach Cleanup Drive at Marina Beach on June 15th. Join now!", time: "1 hour ago", read: false },
  { id: "N003", type: "reward", title: "Eco points earned", message: "You earned 50 Eco Points for your recent waste report.", time: "3 hours ago", read: true },
  { id: "N004", type: "verified", title: "Report verified", message: "Your report REP001 at Marina Beach has been verified and cleaned.", time: "5 hours ago", read: true },
  { id: "N005", type: "badge", title: "New badge unlocked!", message: "Congratulations! You've earned the 'Eco Hero' badge.", time: "1 day ago", read: true },
  { id: "N006", type: "alert", title: "High waste density alert", message: "Mylapore area is showing increased waste reports. Extra collection scheduled.", time: "2 days ago", read: true },
];

// ============================================
// AI SCANNER MOCK RESULTS
// ============================================
export const scannerResults = {
  wasteType: "Plastic",
  confidence: 94,
  hazardLevel: "Low",
  recyclability: 85,
  disposalMethod: "Separate into recyclable plastic bin. Remove any labels and rinse if possible before disposal.",
  nearestRecyclingCenter: { name: "Chennai Green Recycling Hub", distance: "1.2 km", address: "45 Anna Salai, Mylapore" },
  nearestWasteBin: { type: "Recyclable", distance: "200m", direction: "East on Main Road" },
};

// ============================================
// ADMIN DATA
// ============================================
export const activeTeams = [
  { id: "T001", name: "Team Alpha", members: 8, activeArea: "Adyar", status: "On Field", tasksCompleted: 12 },
  { id: "T002", name: "Team Beta", members: 6, activeArea: "Mylapore", status: "On Field", tasksCompleted: 9 },
  { id: "T003", name: "Team Gamma", members: 7, activeArea: "T. Nagar", status: "Standby", tasksCompleted: 15 },
  { id: "T004", name: "Team Delta", members: 5, activeArea: "Velachery", status: "On Field", tasksCompleted: 11 },
  { id: "T005", name: "Team Epsilon", members: 8, activeArea: "Anna Nagar", status: "Off Duty", tasksCompleted: 8 },
];

export const wasteCollectionSchedule = [
  { id: "SCH001", area: "Adyar", day: "Mon, Wed, Fri", time: "6:00 AM", team: "Team Alpha", type: "General" },
  { id: "SCH002", area: "Mylapore", day: "Tue, Thu, Sat", time: "6:30 AM", team: "Team Beta", type: "General" },
  { id: "SCH003", area: "T. Nagar", day: "Mon, Wed, Fri", time: "7:00 AM", team: "Team Gamma", type: "Recyclable" },
  { id: "SCH004", area: "Velachery", day: "Tue, Thu, Sat", time: "6:00 AM", team: "Team Delta", type: "Hazardous" },
  { id: "SCH005", area: "Anna Nagar", day: "Mon, Wed, Fri", time: "5:30 AM", team: "Team Epsilon", type: "General" },
];

// ============================================
// AI PREDICTIONS DATA
// ============================================
export const predictedWasteZones = [
  { area: "Marina Beach", predictedIncrease: 35, currentLoad: "High", riskLevel: "Critical", lat: 13.0545, lng: 80.2828 },
  { area: "T. Nagar Market", predictedIncrease: 22, currentLoad: "Medium", riskLevel: "High", lat: 13.0400, lng: 80.2312 },
  { area: "Mylapore", predictedIncrease: 18, currentLoad: "High", riskLevel: "High", lat: 13.0335, lng: 80.2697 },
  { area: "Velachery", predictedIncrease: 28, currentLoad: "Medium", riskLevel: "Medium", lat: 12.9791, lng: 80.2181 },
  { area: "Anna Nagar", predictedIncrease: 12, currentLoad: "Low", riskLevel: "Low", lat: 13.0850, lng: 80.2101 },
];

export const futureWasteProjection = [
  { week: "Week 1", actual: 450, predicted: 460 },
  { week: "Week 2", actual: 480, predicted: 475 },
  { week: "Week 3", actual: 510, predicted: 520 },
  { week: "Week 4", actual: null, predicted: 545 },
  { week: "Week 5", actual: null, predicted: 570 },
  { week: "Week 6", actual: null, predicted: 590 },
];
