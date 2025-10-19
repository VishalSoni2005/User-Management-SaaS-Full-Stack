import { User } from "@/types";
import { Label } from "@radix-ui/react-label";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import custom_data from "@/Test_Date/custom-users";

export const data: User[] = custom_data;

export const columns: ColumnDef<User>[] = [
  {
    id: "rank",
    header: () => (
      <Label htmlFor="rank" className="text-white font-medium">
        Rank
      </Label>
    ),
    cell: ({ row }) => (
      <div className="text-white font-semibold">{row.index + 1}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "avatar",
    header: () => (
      <Label htmlFor="avatar" className="text-white font-medium">
        Avatar
      </Label>
    ),
    cell: ({ row }) => {
      const avatar = row.getValue("avatar") as string;
      return (
        <div className="flex justify-center items-center">
          <Image
            unoptimized
            src={avatar}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full border border-gray-700 object-cover"
          />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "firstName",
    header: () => (
      <Label htmlFor="firstName" className="text-white font-medium">
        First Name
      </Label>
    ),
    cell: ({ row }) => (
      <div className="uppercase font-medium text-gray-100">
        {row.getValue("firstName")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Label
        className="text-white hover:bg-gray-800"
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
      </Label>
    ),
    cell: ({ row }) => (
      <div className="lowercase text-gray-300">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "totalPoints",
    header: () => (
      <div className="text-right text-white font-medium">Total Points</div>
    ),
    cell: ({ row }) => {



      const totalPoints = Number(row.getValue("totalPoints"));
      return (
        <div className="text-right font-semibold text-gray-100">
          {totalPoints.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="text-right text-white font-medium">Joined At</div>
    ),
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt") as string);
      return (
        <div className="text-right text-gray-300">
          {createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
];

// export default columns;
