/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:4000/users/${id}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-lg font-medium text-gray-500">
        Loading user data...
      </div>
    );

  if (!user)
    return (
      <div className="flex h-screen items-center justify-center text-lg text-red-500">
        User not found.
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Edit User Details
        </h1>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">User ID:</span>
            <span className="text-gray-900 truncate max-w-[180px]">
              {user.id}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">First Name:</span>
            <span className="text-gray-900">{user.firstName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Last Name:</span>
            <span className="text-gray-900">{user.lastName}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Email:</span>
            <span className="text-gray-900">{user.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Role:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                user.role === "ADMIN"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {user.role}
            </span>
          </div>
        </div>

        <button
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow transition duration-200"
          onClick={() => alert("Edit functionality coming soon!")}
        >
          Edit User
        </button>
      </div>
    </div>
  );
}
