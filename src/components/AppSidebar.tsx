
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ListFilter,
  Settings,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Dashboard",
      path: "/",
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
      title: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed top-0 right-0 z-50 flex items-center space-x-2 p-4 bg-white/80 backdrop-blur-sm rounded-bl-lg shadow-sm">
      {menuItems.map((item) => (
        <Link
          key={item.title}
          to={item.path}
          className={cn(
            buttonVariants({ variant: location.pathname === item.path ? "default" : "ghost", size: "sm" }),
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
