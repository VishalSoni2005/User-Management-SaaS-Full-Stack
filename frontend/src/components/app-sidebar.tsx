"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Label } from "./ui/label";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Car,
  BookOpen,
  IndianRupeeIcon,
  SquareTerminal,
  Users,
  Activity,
  BarChart3,
} from "lucide-react";

export const adminNavMain = {
  navMain: [
    {
      title: "Admin Dashboard",
      url: "http://localhost:3000/dashboard/admin",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "System Overview",
          url: "http://localhost:3000/dashboard/admin/overview",
        },
        {
          title: "User Analytics",
          url: "http://localhost:3000/dashboard/admin/analytics",
        },
        {
          title: "Activity Logs",
          url: "http://localhost:3000/dashboard/admin/activity-logs",
        },
        {
          title: "Platform Settings",
          url: "http://localhost:3000/dashboard/admin/settings",
        },
      ],
    },
    {
      title: "User Management",
      url: "http://localhost:3000/dashboard/admin/users",
      icon: Users,
      items: [
        {
          title: "View All Users",
          url: "http://localhost:3000/dashboard/admin/users/view-all",
        },
        {
          title: "Add New User",
          url: "http://localhost:3000/dashboard/admin/users/add",
        },
        {
          title: "User Activity",
          url: "http://localhost:3000/dashboard/admin/users/activity",
        },
        {
          title: "User Subscriptions",
          url: "http://localhost:3000/dashboard/admin/users/subscriptions",
        },
      ],
    },
    {
      title: "Trip Management",
      url: "http://localhost:3000/dashboard/admin/trips",
      icon: Car,
      items: [
        {
          title: "All User Trips",
          url: "http://localhost:3000/dashboard/admin/trips/all",
        },
        {
          title: "Create New Trip",
          url: "http://localhost:3000/dashboard/admin/trips/create",
        },
        {
          title: "Trip Reports",
          url: "http://localhost:3000/dashboard/admin/trips/reports",
        },
      ],
    },
    {
      title: "Billing & Subscriptions",
      url: "http://localhost:3000/dashboard/admin/billing",
      icon: IndianRupeeIcon,
      items: [
        {
          title: "All Transactions",
          url: "http://localhost:3000/dashboard/admin/billing/transactions",
        },
        {
          title: "Manage Subscriptions",
          url: "http://localhost:3000/dashboard/admin/billing/manage",
        },
        {
          title: "Revenue Insights",
          url: "http://localhost:3000/dashboard/admin/billing/revenue",
        },
      ],
    },
  ],
};

export const userNavMain = {
  navMain: [
    {
      title: "Trip Management",
      url: "http://localhost:3000/dashboard/trips",
      icon: Car,
      items: [
        {
          title: "Create New Trip",
          url: "http://localhost:3000/dashboard/trips/create-trip",
        },
        {
          title: "View All Trips",
          url: "http://localhost:3000/dashboard/trips/view-all-trips",
        },
        {
          title: "Trip Settings",
          url: "http://localhost:3000/dashboard/trips/trip-settings",
        },
      ],
    },
    {
      title: "Dashboard",
      url: "http://localhost:3000/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "LeaderBoard",
          url: "http://localhost:3000/dashboard/leaderboard",
        },
        {
          title: "Activity Overview",
          url: "http://localhost:3000/dashboard/activity-overview",
        },
        {
          title: "Recent Actions",
          url: "http://localhost:3000/dashboard/recent-actions",
        },
        {
          title: "Profile Settings",
          url: "http://localhost:3000/dashboard/profile-settings",
        },
      ],
    },
    {
      title: "Rewards & Purchases",
      url: "http://localhost:3000/dashboard/rewards",
      icon: BookOpen,
      items: [
        {
          title: "View Reward Points",
          url: "http://localhost:3000/dashboard/rewards/points",
        },
        {
          title: "Purchase History",
          url: "http://localhost:3000/dashboard/rewards/history",
        },
        {
          title: "Available Rewards",
          url: "http://localhost:3000/dashboard/rewards/available",
        },
        {
          title: "Redeem Reward",
          url: "http://localhost:3000/dashboard/rewards/redeem",
        },
      ],
    },
    {
      title: "Subscriptions & Billing",
      url: "http://localhost:3000/dashboard/subscription",
      icon: IndianRupeeIcon,
      items: [
        {
          title: "Billing Information",
          url: "http://localhost:3000/dashboard/subscription/billing",
        },
        {
          title: "Usage Limits",
          url: "http://localhost:3000/dashboard/subscription/limits",
        },
        {
          title: "My Subscriptions",
          url: "http://localhost:3000/dashboard/subscription/my-subscriptions",
        },
        {
          title: "Subscription Settings",
          url: "http://localhost:3000/dashboard/subscription/settings",
        },
      ],
    },
  ],
};

// projects: [
//   {
//     name: "Design Engineering",
//     url: "#",
//     icon: Frame,
//   },
//   {
//     name: "Sales & Marketing",
//     url: "#",
//     icon: PieChart,
//   },
//   {
//     name: "Travel",
//     url: "#",
//     icon: Map,
//   },

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  if (!currentUser) return null;

  const data = currentUser.role === "ADMIN" ? adminNavMain : userNavMain;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher user={data.teams} /> */}

        <Label className="data-[state=open]:bg-sidebar-accent pt-6 data-[state=open]:text-sidebar-accent-foreground">
          <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Image
              src="/attento-logo.png"
              className="w-full"
              width={20}
              height={20}
              alt="logo"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Attento Technologies</span>
            <span className="truncate text-xs">{currentUser.role} </span>
          </div>
        </Label>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
