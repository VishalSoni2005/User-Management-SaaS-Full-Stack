"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../lib/store/store";
import {
  fetchAllUsers,
  deleteUser,
} from "../../../lib/store/features/userSlice";
import { getAccessToken } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    const token: string | null = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    console.log("Token are : ", token);

    dispatch(fetchAllUsers());
  }, [dispatch, router]);

  const handleDelete = (userId: string) => {
    dispatch(deleteUser(userId));
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500 mt-8">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
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
    </div>
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { getAccessToken } from "@/lib/auth";

// interface User {
//   id: string;
//   firstName: string;
//   lastName?: string;
//   email: string;
//   role: string;
//   createdAt: string;
// }

// export default function DashboardPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [users, setUsers] = useState<User[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const token = getAccessToken();
//     if (!token) {
//       router.replace("/login");
//       return;
//     }

//     console.log("Token found ==>> ", token);

//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get("http://localhost:4000/users", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUsers(res.data); // assuming backend returns array of users
//       } catch (err: any) {
//         console.error(err);
//         setError("Failed to fetch users. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [router]);

//   const handleDelete = async (userId: string) => {
//     const token = getAccessToken();
//     if (!token) {
//       setError("You must be logged in to perform this action.");
//       return;
//     }

//     try {
//       // console.log(" deleting user ", userId);

//       await axios.delete(`http://localhost:4000/users/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setUsers(users.filter((user) => user.id !== userId));
//     } catch (err) {
//       console.error(err);
//       setError("Failed to delete user. Please try again.");
//     }
//   };

//   const handleEdit = (userId: string) => {
//     router.push(`/dashboard/edit/${userId}`);
//   };

//   if (loading) return <p>Loading users...</p>;
//   if (error) return <p className="text-red-500 mt-8">{error}</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
//       <table className="w-full border border-gray-300">
//         <thead className="bg-gray-100  text-black">
//           <tr>
//             <th className="border p-2">ID</th>
//             <th className="border p-2">First Name</th>
//             <th className="border p-2">Last Name</th>
//             <th className="border p-2">Email</th>
//             <th className="border p-2">Role</th>
//             <th className="border p-2">Created At</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user, index) => (
//             <tr key={index}>
//               <td className="border p-2">{user.id.slice(9, 12)}...</td>
//               <td className="border p-2">{user.firstName}</td>
//               <td className="border p-2">{user.lastName || "-"}</td>
//               <td className="border p-2">{user.email}</td>
//               <td className="border p-2">{user.role}</td>
//               <td className="border p-2">
//                 {new Date(user.createdAt).toLocaleString()}
//               </td>
//               <td className="border p-2">
//                 <button
//                   onClick={() => handleEdit(user.id)}
//                   className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(user.id)}
//                   className="bg-red-500 text-white px-2 py-1 rounded"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { getAccessToken } from "@/lib/auth";

// export default function DashboardPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = getAccessToken();
//     if (!token) {
//       router.replace("/login");
//     } else {
//       setLoading(false);
//     }
//   }, [router]);

//   if (loading) return <p>Checking authentication...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold">Dashboard</h1>
//       <p>Welcome back! You’re authenticated.</p>
//     </div>
//   );
// }
