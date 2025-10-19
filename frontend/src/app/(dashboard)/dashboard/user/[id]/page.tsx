/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { cookies } from "next/headers";
import UserCard from "@/components/UserCard";
import NotFound from "@/components/NotFoundError";

export default async function UserPage({ params }: { params: { id: string } }) {
  try {
    // Get the cookie store (server-side)
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      throw new Error("No access token found in cookies");
    }

    // Axios request (server-side)
    const res = await axios.get(`http://localhost:4000/users/${params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      throw new Error("Unauthorized: Invalid token");
    }

    const user = res.data;
    console.log('user', user);
    

    if (!user) {
      throw new Error("User not found");
    }

    return <UserCard user={user} />;
  } catch (error: any) {
    console.log("Error fetching user:", error.message);

    return (
      <div className="min-h-screen min-w-screen flex justify-center items-center bg-black ">
        <NotFound />
      </div>
    );
  }
}
