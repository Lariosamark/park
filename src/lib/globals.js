import { Car, File, PieChartIcon, QrCode, User, Kanban, Logs, OctagonAlert, ChartLine, TriangleAlert,FilePlus2, ScanLine, Users } from "lucide-react";

export const userLinks = [
  { tag: "Dashboard", href: "/dashboard", icon: PieChartIcon },
  { tag: "Profile", href: "/dashboard/Profile", icon: User },
  { tag: "My Permit", href: "/dashboard/mypermit", icon: File },
  { tag: "Parking", href: "/dashboard/parking", icon: Car },
  { tag: "Report", href: "/dashboard/ReportViolationPage", icon: TriangleAlert },
];

export const adminLinks = [
  { tag: "Dashboard", href: "/dashboard", icon: PieChartIcon },
  { tag: "ManageUser", href: "/dashboard/ManageUser", icon: Kanban},
  { tag: "Profile", href: "/dashboard/Profile", icon: User },
  { tag: "Permits", href: "/dashboard/permits", icon: File },
  { tag: "Viewlogs", href: "/dashboard/ViewLogs", icon: Logs },
  { tag: "Violations", href: "/dashboard/ViolationPage", icon: OctagonAlert },
  { tag: "Analytics", href: "/dashboard/AnalyticsPage", icon: ChartLine },

  
];

export const securityLinks = [
  { tag: "Dashboard", href: "/dashboard", icon: PieChartIcon },
  { tag: "Profile", href: "/dashboard/Profile", icon: User },
  { tag: "Parkings", href: "/dashboard/parking", icon: Car },
  { tag: "Viewlogs", href: "/dashboard/ViewLogs", icon: Logs },
  { tag: "Scanner", href: "/dashboard/Scanner", icon: ScanLine },
  { tag: "Analytics", href: "/dashboard/AnalyticsPage", icon: ChartLine },
  { tag: "Visitors", href: "/dashboard/Visitors", icon: Users},

];


export const vipLinks = [
  { tag: "Dashboard", href: "/dashboard", icon: PieChartIcon },
  { tag: "Profile", href: "/dashboard/Profile", icon: User },
  { tag: "Parkings", href: "/dashboard/parking", icon: Car },
  { tag: "Violations", href: "/dashboard/ViolationPage", icon: OctagonAlert },
];


export const formatTimestamp = (timestamp) => {
  const date = timestamp.toDate(); // Convert to JavaScript Date
  return date.toLocaleString(); // Format as locale string (e.g., 'MM/DD/YYYY, HH:MM:SS')
};
