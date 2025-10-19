"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, getPayload } from "@/lib/index.lib";
import Image from "next/image";
import LogoutButton from "@/components/logoutButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setCurrentUser } from "@/store/features/userSlice";
import UserCard from "@/components/UserCard";

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
    console.log("payload", payload);

    if (payload) dispatch(setCurrentUser(payload));
  }, [router, dispatch]);

  // Show nothing or a loading placeholder while user is not ready
  if (!currentUser) return null;

  const avatarUrl = currentUser.avatar;

  if (currentUser.role !== "ADMIN") {
    return <UserCard user={currentUser} />;
  } else
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
        {/* Header */}
        <header className="bg-slate-950 text-white flex justify-between items-center px-8 py-4 shadow-md border-b border-green-900">
          <h1 className="text-2xl font-semibold">
            Welcome, {currentUser.firstName} {currentUser.lastName || ""}
          </h1>
          <div className="flex items-center space-x-4">
            <Image
              unoptimized
              width={40}
              height={40}
              src={avatarUrl}
              alt="avatar"
              className="rounded-full border-2 border-white"
            />
            <LogoutButton className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition" />
          </div>
        </header>

        {/* Main content */}
        <main>{children}</main>
      </div>
    );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { getAccessToken, getPayload } from "@/lib/index.lib";
// // import { useDispatch } from "react-redux";
// // import { AppDispatch } from "@/store";
// // import { fetchAllUsers } from "@/store/userSlice";
// import Image from "next/image";
// import { User } from "@/types";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const [user, setUser] = useState<User | null>(null);
//   // const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     const token = getAccessToken();
//     if (!token) {
//       router.replace("/login");
//       return;
//     }
//     console.log("token", token);

//     // ✅ Get user payload from localStorage or JWT
//     const payload = getPayload();
//     if (payload) setUser(payload);

//     console.log("payload is ", payload);

//     // Optional: Fetch any global data
//     // dispatch(fetchAllUsers({ limit: 5, page: 1 }));
//   }, [router]);

//   if (!user) return null; // or loading screen
//   const avatarUrl = user.avatar;
//   console.log('avatar url', avatarUrl);

//   return (
//     <div className="bg-gray-950">
//       <header className="flex justify-between items-center p-4 border-b">
//         <h1 className="ml-10 text-xl font-bold">
//           👋 Hello, {user.firstName} {user.lastName || ""}
//         </h1>
//         <Image
//           unoptimized
//           width={10}
//           height={10}
//           src={avatarUrl}
//           alt="avatar"
//           className="w-10 h-10 rounded-full mr-10"
//         />
//       </header>

//       <main className="p-4">{children}</main>
//     </div>
//   );
// }
