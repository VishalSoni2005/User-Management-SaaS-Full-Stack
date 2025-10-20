"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Label } from "./ui/label";
import Image from "next/image";
import { User } from "@/types";

export function TeamSwitcher({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState();

  if (!activeTeam) {
    return null;
  }
  return (
    <Label className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
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
        <span className="truncate text-xs">{user.role} </span>
      </div>
    </Label>
  );
}
