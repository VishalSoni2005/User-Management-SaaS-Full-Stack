/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import UserCard from "@/components/UserCard";
import NotFound from "@/components/NotFoundError";

export default function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params); // ✅ unwrap the Promise
  const { id } = unwrappedParams; // extract the id safely

  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No token found");

        const res = await axios.get(`http://localhost:4000/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        // console.log("user", res.data);
      } catch (err: any) {
        console.error("Error fetching user:", err.message);
        setError(err.message);
      }
    };

    fetchUser();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen min-w-screen flex justify-center items-center bg-black">
        <NotFound />
      </div>
    );
  }

  return user ? <UserCard user={user} /> : <p>Loading...</p>;
}
