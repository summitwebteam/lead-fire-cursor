
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ListFilter,
  Settings,
  Users,
  FileText,
  DollarSign,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppTopMenu() {
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Campaigns",
      path: "/campaigns",
      icon: ListFilter,
    },
    {
      title: "Users & Access",
      path: "/users",
      icon: Users,
    },
    {
      title: "Billing",
      path: "/billing",
      icon: DollarSign,
    },
    {
      title: "Reports",
      path: "/reports",
      icon: FileText,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <nav className="absolute top-0 right-0 z-50 flex items-center space-x-2 p-4">
      {menuItems.map((item) => (
        <Link
          key={item.title}
          to={item.path}
          className={cn(
            buttonVariants({ variant: location.pathname === item.path ? "default" : "ghost" }),
            "flex items-center gap-2"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
