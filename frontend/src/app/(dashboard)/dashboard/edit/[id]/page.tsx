/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateUser } from "@/store/features/userSlice";
import { getAccessToken } from "@/lib/auth";


export default function EditPage() {
  // const { id } = useParams<EditPageParams>();
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getAccessToken();
        const response = await fetch(`http://localhost:4000/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          role: data.role || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(updateUser({ id: id as string, data: formData }));
      alert("User updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Try again!");
    }
  };

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
    <div className="min-h-auto flex items-center justify-center py-12 px-6 bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-gray-300 rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow text-black duration-300"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Edit User Details
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow transition duration-200"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
