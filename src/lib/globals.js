import { Car, File, PieChartIcon, QrCode, User } from "lucide-react";

export const userLinks = [
    {tag: "Dashboard", href: "/dashboard", icon: PieChartIcon},
    {tag: "Profile", href:"/dashboard/profile", icon: User},
    {tag: "My Permit", href: "/dashboard/mypermit", icon: File},
    {tag: "Parking", href:"/dashboard/parking", icon: Car}
]

export const adminLinks = [
    { tag: "Dashboard", href: "/dashboard", icon: PieChartIcon },
    { tag: "Profile", href: "/profile", icon: User },
    { tag: "Permits", href: "/mypermit", icon: File },
    { tag: "Parking", href: "/parking", icon: Car },
  ];
  
  export const securityLinks = [
    { tag: "Dashboard", href: "/dashboard", icon: PieChartIcon },
    { tag: "Profile", href: "/profile", icon: User },
    { tag: "Parking", href: "/parking", icon: Car },
    { tag: "QR", href: "/scanner", icon: QrCode },
  ];