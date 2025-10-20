import { LeaderboardUser } from "@/types";
import { Label } from "@radix-ui/react-label";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Trophy } from "lucide-react";

export const columns: ColumnDef<LeaderboardUser>[] = [
  {
    accessorKey: "rank",
    header: () => (
      <Label htmlFor="rank" className="text-white font-medium">
        Rank
      </Label>
    ),
    cell: ({ row }) => {
      const rank = row.original.rank;
      let icon = null;

      if (rank === 1)
        icon = <Trophy className="text-yellow-400 h-5 w-5 inline-block mr-2" />;
      else if (rank === 2)
        icon = <Trophy className="text-gray-300 h-5 w-5 inline-block mr-2" />;
      else if (rank === 3)
        icon = <Trophy className="text-amber-600 h-5 w-5 inline-block mr-2" />;

      return (
        <div className="flex items-center font-semibold">
          {icon}
          <span>{rank}</span>
        </div>
      );
    },
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
    header: () => (
      <Label htmlFor="email" className="text-white font-medium">
        Email
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

// import { User } from "@/types";
// import { Label } from "@radix-ui/react-label";
// import { ColumnDef } from "@tanstack/react-table";
// import Image from "next/image";
// import { Trophy } from "lucide-react";

// export const columns: ColumnDef<User>[] = [
//   {
//     id: "rank",
//     header: () => (
//       <Label htmlFor="rank" className="text-white font-medium">
//         Rank
//       </Label>
//     ),
//     cell: ({ row }) => {
//       let icon = null;
//       if (row.index + 1 === 1)
//         icon = <Trophy className="text-yellow-400 h-5 w-5 inline-block mr-2" />;
//       else if (row.index + 1 === 2)
//         icon = <Trophy className="text-gray-300 h-5 w-5 inline-block mr-2" />;
//       else if (row.index + 1 === 3)
//         icon = <Trophy className="text-amber-600 h-5 w-5 inline-block mr-2" />;

//       return (
//         <div className="flex items-center font-semibold">
//           {icon}
//           <span>{row.index + 1}</span>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "avatar",
//     header: () => (
//       <Label htmlFor="avatar" className="text-white font-medium">
//         Avatar
//       </Label>
//     ),
//     cell: ({ row }) => {
//       const avatar = row.getValue("avatar") as string;
//       return (
//         <div className="flex justify-center items-center">
//           <Image
//             unoptimized
//             src={avatar}
//             alt="User Avatar"
//             width={40}
//             height={40}
//             className="rounded-full border border-gray-700 object-cover"
//           />
//         </div>
//       );
//     },
//     enableSorting: false,
//   },
//   {
//     accessorKey: "firstName",
//     header: () => (
//       <Label htmlFor="firstName" className="text-white font-medium">
//         First Name
//       </Label>
//     ),
//     cell: ({ row }) => (
//       <div className="uppercase font-medium text-gray-100">
//         {row.getValue("firstName")}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "email",
//     header: ({ column }) => (
//       <Label
//         className="text-white hover:bg-gray-800"
//         // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Email
//         {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
//       </Label>
//     ),
//     cell: ({ row }) => (
//       <div className="lowercase text-gray-300">{row.getValue("email")}</div>
//     ),
//   },
//   {
//     accessorKey: "totalPoints",
//     header: () => (
//       <div className="text-right text-white font-medium">Total Points</div>
//     ),
//     cell: ({ row }) => {
//       const totalPoints = Number(row.getValue("totalPoints"));
//       return (
//         <div className="text-right font-semibold text-gray-100">
//           {totalPoints.toLocaleString()}
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "createdAt",
//     header: () => (
//       <div className="text-right text-white font-medium">Joined At</div>
//     ),
//     cell: ({ row }) => {
//       const createdAt = new Date(row.getValue("createdAt") as string);
//       return (
//         <div className="text-right text-gray-300">
//           {createdAt.toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//           })}
//         </div>
//       );
//     },
//   },
// ];

// // export default columns;
