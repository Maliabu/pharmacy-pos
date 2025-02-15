/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { date } from "@/app/services/services"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, File, LucideIcon } from "lucide-react"

export type Invoice = {
    invoiceItems: [{
      product: number
      total: number
      createdAt: string
    }]
    id: string
    status: "paid" | "pending"
    user: {
      name: string
    }
    createdAt: string
    invoice: LucideIcon
    address: string
  }

export const columns: ColumnDef<Invoice>[] = [
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
    accessorKey: "invoiceStatus",
    header: "Status",
    cell: ({ row }) => (
      <div className={row.getValue("invoiceStatus") == "paid"?"text-lime-600 p-1 rounded-md border border-lime-600 flex justify-center":row.getValue("invoiceStatus")=="pending"?"text-muted-foreground p-1 rounded-md border border-gray-600 flex justify-center":""}>{row.getValue("invoiceStatus")}</div>
    ),
  },
  {
    accessorKey: "address",
    header: "BilledTo",
    cell: ({ row }) => (
      <div>{row.getValue("address")}</div>
    ),
  },
  {
    accessorKey: "user",
    header: "user",
    cell: ({row}) => {
      // Custom render for nested address object
      const user: {name: string} = row.getValue("user");
      return `${user.name}`;
    },  
  },
  {
    accessorKey: "createdAt",
    header: "createdAt",
    cell: ({ row }) => <div className="lowercase">{date(row.getValue("createdAt"))}</div>,
  },
  {
    accessorKey: "invoice",
    header: "invoice",
    cell: () => <div><File/></div>,
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