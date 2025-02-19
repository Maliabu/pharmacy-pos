/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { date } from "@/app/services/services"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, File, LucideIcon } from "lucide-react"
import { Dialog } from "@radix-ui/react-dialog"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import PreviewPrescription from "./previewPrescription"

export type Prescription = {
    id: number
    physicalAddress: string,
    name: string,
    userId: string,
    age: string,
    sex: string,
    testsDone: string,
    prescription: string,
    diagnosis: string,
    createdAt: string
}

export const columns: ColumnDef<Prescription>[] = [
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
    accessorKey: "name",
    header: "Patient",
    cell: ({ row }) => (
      <div>{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "physicalAddress",
    header: "Address",
    cell: ({ row }) => (
      <div>{row.getValue("physicalAddress")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "createdAt",
    cell: ({ row }) => <div className="lowercase">{date(row.getValue("createdAt"))}</div>,
  },
  {
    accessorKey: "prescription",
    header: "prescription",
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
        <PreviewPrescription prescriptionId={parseInt(row.getValue("id"))}/>
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