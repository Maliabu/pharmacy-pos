"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Dot } from "lucide-react"
import { avatar } from "../services/services"

type User = {
    id: string
    status: "active" | "inactive"
    name: string
    type: "admin" | "non-admin"
    username: string
    email: string
    token: string
    isLoggedIn: boolean
    lastLogin: string
    created: string
    updated: string
  }
  
export const data: User[] = [
    {
        id: "1",
        status: "active",
        name: "Admin",
        type: "admin",
        username: "admin@123",
        email: "admin@pharmacy.com",
        token: "ajfgyuguygurg",
        isLoggedIn: true,
        lastLogin: "25 feb 2025",
        created: "25 jan 2025",
        updated: "20 feb 2025"
    }
]

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className={row.getValue("status") == "active"?"text-green-600 p-1 rounded-md border border-green-600 flex justify-center":row.getValue("status")=="inactive"?"text-muted-foreground p-1 rounded-md border border-gray-600 flex justify-center":""}>{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "profile",
    header: "profile",
    cell: ({ row }) => <div className="h-10 w-10 rounded-full bg-primary text-muted flex items-center justify-center">{avatar(row.getValue("name"))}</div>,
  },
  {
    accessorKey: "type",
    header: "User Type",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          name
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
    accessorKey: "isLoggedIn",
    header: "Logged In",
    cell: ({ row }) => <div className={row.getValue("isLoggedIn") == true?"text-green-400 p-1 rounded-full":row.getValue("isLoggedIn")==false?"text-red-600 p-1":""}><Dot size={40}/></div>,
  },
  {
    accessorKey: "created",
    header: "created",
    cell: ({ row }) => <div className="lowercase">{row.getValue("created")}</div>,
  },
  {
    accessorKey: "updated",
    header: "updated",
    cell: ({ row }) => <div className="lowercase">{row.getValue("updated")}</div>,
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