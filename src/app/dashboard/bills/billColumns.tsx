/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { avatar, date } from "@/app/services/services"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Circle, CircleAlertIcon, Dot, File, LucideIcon } from "lucide-react"

export type Bill = {
    id: string
    status: string
    name: string
    description: string
    amount: number
    currency: {
        code: string
    }
    createdAt: string
  }

export const columns: ColumnDef<Bill>[] = [
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className={row.getValue("status") == "paid"?"text-green-600 p-1 rounded-md border border-green-600 flex justify-center":row.getValue("status")=="pending"?"text-muted-foreground p-1 rounded-md border border-gray-600 flex justify-center":""}>{row.getValue("status")}</div>
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
        Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "description",
    cell: ({ row }) => <div className="lowercase">{row.getValue("description")}</div>,
  },
  {
    accessorKey: "currency",
    header: "currency",
    cell: ({row}) => {
      // Custom render for nested address object
      const currency: {code: string} = row.getValue("currency");
      return `${currency.code}`;
    }, 
  },
  {
    accessorKey: "amount",
    header: "amount",
    cell: ({ row }) => <div className="lowercase">{row.getValue("amount")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "createdAt",
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