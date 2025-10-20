"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, getPayload } from "@/lib/index.lib";
import Image from "next/image";
import LogoutButton from "@/components/logoutButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCurrentUser } from "@/store/features/userSlice";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const payload = getPayload();
    if (payload) dispatch(setCurrentUser(payload));
  }, [router, dispatch]);

  if (!currentUser) return null;

  return (
    <SidebarProvider>
      {/* Sidebar */}
      <AppSidebar role={currentUser.role} />

      <SidebarInset>
        {/* Header */}
        <header className="bg-black text-white flex justify-between items-center px-6 py-4 border-b border-gray-800">
          {/* Left Section: Avatar + Welcome */}
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:text-gray-300" />
            <div className="relative">
              <Image
                unoptimized
                width={48}
                height={48}
                src={currentUser.avatar}
                alt="avatar"
                className="rounded-full border-2 border-gray-300 shadow-md hover:border-green-400 transition-all duration-300"
              />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
            <div>
              <h1 className="text-xl font-light tracking-tight">
                Welcome,{" "}
                <span className="font-medium">{currentUser.firstName}</span>{" "}
                {currentUser.lastName || ""}
              </h1>
            </div>
          </div>

          {/* Right Section: Buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push("/dashboard/leaderboard")}
              type="button"
              aria-label="Leaderboard"
              role="button"
              className="bg-gray-800 hover:bg-gray-600 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 text-white font-medium border border-gray-700 hover:border-gray-500"
            >
              Leaderboard
            </Button>
            <LogoutButton className="bg-gray-800 hover:bg-red-600 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 text-white font-medium border border-gray-700 hover:border-red-500" />
          </div>
        </header>

        {/* Separator under header */}
        <Separator className="bg-gray-800" />

        {/* Main content area */}
        <main className="flex-1 bg-gray-50 min-h-screen">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
