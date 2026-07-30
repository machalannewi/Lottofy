import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Trophy,
  Mail,
  Banknote,
} from "lucide-react";

export const adminNavLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/draws", label: "Draws", icon: CalendarClock },
  { href: "/admin/winners", label: "Winners", icon: Trophy },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: Banknote },
  { href: "/admin/email", label: "Broadcast email", icon: Mail },
];
