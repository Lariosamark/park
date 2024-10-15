import { Car, File, PieChartIcon, QrCode, User } from "lucide-react";

export const userLinks = [
  { tag: "Dashboard", href: "/dashboard", icon: PieChartIcon },
  { tag: "Profile", href: "/dashboard/profile", icon: User },
  { tag: "My Permit", href: "/dashboard/mypermit", icon: File },
  { tag: "Parking", href: "/dashboard/parking", icon: Car },
];

export const adminLinks = [
  { tag: "Dashboard", href: "/dashboard", icon: PieChartIcon },
  { tag: "Profile", href: "/dashboard/profile", icon: User },
  { tag: "Permits", href: "/dashboard/permits", icon: File },
  { tag: "Parkings", href: "/dashboard/parkings", icon: Car },
];

export const securityLinks = [
  { tag: "Dashboard", href: "/dashboard", icon: PieChartIcon },
  { tag: "Profile", href: "/profile", icon: User },
  { tag: "Parkings", href: "/parkings", icon: Car },
  { tag: "QR", href: "/scanner", icon: QrCode },
];

export const formatTimestamp = (timestamp) => {
  const date = timestamp.toDate(); // Convert to JavaScript Date
  return date.toLocaleString(); // Format as locale string (e.g., 'MM/DD/YYYY, HH:MM:SS')
};
