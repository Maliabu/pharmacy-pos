/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { date } from "@/app/services/services"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, File, LucideIcon } from "lucide-react"
import Invoice from "./invoice"
import PreviewInvoice from "./previewInvoice"
import { Dialog } from "@radix-ui/react-dialog"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export type Invoice = {
    invoiceItems: [{
      product: number
      total: number
      createdAt: string
    }]
    id: string
    invoiceStatus: "paid" | "pending"
    user: {
      name: string
    }
    paymentMeans: string
    paymentID: string
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
    accessorKey: "id",
    header: "No.",
    cell: ({ row }) => (
      <div>{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "invoiceStatus",
    header: "Status",
    cell: ({ row }) => (
      <div className={row.getValue("invoiceStatus") == "paid"?"text-green-600 p-1 rounded-md border border-green-600 flex justify-center":row.getValue("invoiceStatus")=="pending"?"text-muted-foreground p-1 rounded-md border border-gray-600 flex justify-center":""}>{row.getValue("invoiceStatus")}</div>
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
    cell: ({row}) => <div>
      <Dialog>
        <DialogTrigger>
        <img src="/pdf.png" alt="pdf image" width={25} height={30}/></DialogTrigger>
        <DialogContent className="max-w-fit h-screen overflow-y-auto">
        <DialogHeader className="hidden">
          <DialogTitle>Invoice</DialogTitle>
          <DialogDescription>
            Invoice template
          </DialogDescription>
        </DialogHeader>
        <PreviewInvoice invoiceId={parseInt(row.getValue("id"))}/>
        </DialogContent>
      </Dialog>
      </div>,
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