/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Trash2,
  Edit2,
  Search,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAllUsers } from "@/store/features/userSlice";

const columnHelper = createColumnHelper<any>();

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();

  const currentUsre = useSelector((state: RootState) => state.user.currentUser);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const data = useSelector((state: RootState) => state.user.users);

  const router = useRouter();

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => (
        <span className="text-zinc-400">{info.getValue().slice(5, 11)}</span>
      ),
    }),
    columnHelper.accessor("firstName", {
      header: "First Name",
      cell: (info) => (
        <span className="text-white font-medium">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("lastName", {
      header: "Last Name",
      cell: (info) => <span className="text-white">{info.getValue()}</span>,
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => (
        <span className="text-zinc-300 text-sm">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: (info) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            info.getValue() === "Admin"
              ? "bg-red-900 text-red-200"
              : info.getValue() === "Moderator"
              ? "bg-blue-900 text-blue-200"
              : "bg-zinc-800 text-zinc-300"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Joined Date",
      cell: (info) => (
        <span className="text-zinc-400 text-sm">
          {new Date(info.getValue()).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex gap-2">
          
          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-red-400 hover:text-red-300">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  useEffect(() => {
    dispatch(fetchAllUsers({ limit: 20, page: 1 }));
  }, [dispatch]);

  return (
    <div className="min-h-screen min-w-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Console Dashboard
          </h1>
          <h2 className="text-1xl font-bold text-zinc-300 mb-2 ">
            Admin Name: {`  ${currentUsre?.firstName} `}
          </h2>
          <p className="text-zinc-400">Manage all users in your system</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-zinc-500" size={20} />
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="border-b border-zinc-800 bg-zinc-800/50"
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider"
                      >
                        <div
                          className={
                            header.column.getCanSort()
                              ? "flex items-center gap-2 cursor-pointer select-none hover:text-white transition-colors"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <span className="text-zinc-500">
                              {header.column.getIsSorted() === "desc" ? (
                                <ChevronDown size={16} />
                              ) : header.column.getIsSorted() === "asc" ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronsUpDown size={16} />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              {/* Table Body */}
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => router.push(`/dashboard/user/${row.original.id}`)}
                    className="border-b cursor-pointer border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {table.getRowModel().rows.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-zinc-400">
                No users found. Try adjusting your search.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-zinc-400">
            Showing{" "}
            <span className="font-semibold text-white">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-white">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-white">
              {table.getFilteredRowModel().rows.length}
            </span>{" "}
            users
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: table.getPageCount() }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => table.setPageIndex(i)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    table.getState().pagination.pageIndex === i
                      ? "bg-white text-black"
                      : "bg-zinc-800 text-white hover:bg-zinc-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSelector, useDispatch } from "react-redux";
// import { AppDispatch, RootState } from "../../../store/store";
// import { fetchAllUsers, deleteUser } from "../../../store/features/userSlice";
// import { getAccessToken } from "@/lib/auth";
// import LogoutButton from "../../../components/logoutButton";
// import CustomSortSelect from "@/components/CustomSortSelect";

// export default function DashboardPage() {
// const router = useRouter();
// const dispatch = useDispatch<AppDispatch>();
// const { users, total, loading, error } = useSelector(
//   (state: RootState) => state.user
// );
// const [page, setPage] = useState(1);
// const limit = 5;

// useEffect(() => {
//   const token = getAccessToken();
//   if (!token) {
//     router.replace("/login");
//     return;
//   }
//   dispatch(fetchAllUsers({ limit, page }));
// }, [dispatch, router, page]);

//   const handleDelete = (userId: string) => dispatch(deleteUser(userId));

//   if (loading) return <p>Loading users...</p>;
//   // if (error) return <p className="text-red-500 mt-8">{error}</p>;
//   if (error) router.push("/login");

//   const totalPages = Math.ceil(total / limit);

//   return (
//     <div className="p-6">
//       <div className="flex justify-between">
//         <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
//         <CustomSortSelect />
//         <LogoutButton />
//       </div>

//       <table className="w-full border border-gray-300">
//         <thead className="bg-gray-100 text-black">
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
//           {users.map((user) => (
//             <tr key={user.id}>
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
//                   onClick={() => router.push(`/dashboard/edit/${user.id}`)}
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

//       {/* Pagination Controls */}
//       <div className="flex justify-center items-center mt-4 gap-4">
//         <button
//           onClick={() => setPage((p) => Math.max(p - 1, 1))}
//           disabled={page === 1}
//           className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
//           disabled={page === totalPages}
//           className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }
