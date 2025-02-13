/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { avatar, date } from "@/app/services/services"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Circle, CircleAlertIcon, Dot, File, LucideIcon } from "lucide-react"

export type Vendor = {
    id: string
    isActive: boolean
    name: string
    email: string
    phone: number
    physicalAddress: string
    createdAt: string
  }

export const columns: ColumnDef<Vendor>[] = [
  {
    id: "select",
    // header: ({ table }) => (
    //   <Checkbox
    //     checked={
    //       table.getIsAllPageRowsSelected() ||
    //       (table.getIsSomePageRowsSelected() && "indeterminate")
    //     }
    //     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //     aria-label="Select all"
    //   />
    // ),
    // cell: ({ row }) => (
    //   <Checkbox
    //     checked={row.getIsSelected()}
    //     onCheckedChange={(value) => row.toggleSelected(!!value)}
    //     aria-label="Select row"
    //   />
    // ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "isActive",
    header: "isActive",
    cell: ({ row }) => (
      <div className={row.getValue("isActive") == true?"text-lime-400 p-1 rounded-full":row.getValue("isActive")==false?"text-red-600 p-1":""}><Dot size={40}/></div>
    ),
  },
  {
    accessorKey: "profile",
    header: "profile",
    cell: ({ row }) => <div className="h-10 w-10 rounded-full bg-primary text-muted flex items-center justify-center">{avatar(row.getValue("name"))}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
        Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "phone",
    cell: ({ row }) => <div className="lowercase">{row.getValue("phone")}</div>,
  },
  {
    accessorKey: "physicalAddress",
    header: "address",
    cell: ({ row }) => <div className="capitalise">{row.getValue("physicalAddress")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "created",
    cell: ({ row }) => <div className="capitalise">{date(row.getValue("createdAt"))}</div>,
  },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const payment = row.original

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(payment.id)}
//             >
//               Copy payment ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View customer</DropdownMenuItem>
//             <DropdownMenuItem>View payment details</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
]