"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { fetchAllUsers, deleteUser } from "../../../store/features/userSlice";
import { getAccessToken } from "@/lib/auth";
import LogoutButton from "../../../components/logoutButton";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { users, total, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    dispatch(fetchAllUsers({ limit, page }));
  }, [dispatch, router, page]);

  const handleDelete = (userId: string) => dispatch(deleteUser(userId));

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500 mt-8">{error}</p>;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <LogoutButton />
      </div>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100 text-black">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">First Name</th>
            <th className="border p-2">Last Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Created At</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.id.slice(9, 12)}...</td>
              <td className="border p-2">{user.firstName}</td>
              <td className="border p-2">{user.lastName || "-"}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">
                {new Date(user.createdAt).toLocaleString()}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => router.push(`/dashboard/edit/${user.id}`)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 gap-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
