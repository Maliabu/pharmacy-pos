"use client"

import { date } from "@/app/services/services"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export type Stock = {
    createdAt: string
    currency: {
      code: string
    } | null
    description: string
    expiryDate: string
    id: string
    name: string
    orderDate: string
    packaging: {
      unit: string
    }
    paymentMeans: ""
    stockStatus: "active" | "quarantine" | "safety"
    supplier: {
      name: string
    } | null
    unitAmount: number
    unitsPurchased: number
    vendor: {
      name: string
    }
    totalPurchaseAmount: number
  }

  function expired(expiryDate: string){
    const today = new Date();
    const targetDate = new Date(expiryDate);
    const timeDiff = targetDate.getTime() - today.getTime();
    const daysRemaining = Math.floor(timeDiff / (1000 * 3600 * 24)); // Convert time difference to days

    if (daysRemaining < 14) {
      return true
    }
  }

export const columns: ColumnDef<Stock>[] = [
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
    accessorKey: "stockStatus",
    header: "stockStatus",
    cell: ({ row }) => (
      <div className={row.getValue("stockStatus") == "active"?"text-green-600 p-1 rounded-md border border-green-600 flex justify-center":row.getValue("stockStatus")=="safety"?"text-destructive p-1 rounded-md border border-red-600 flex justify-center":row.getValue("stockStatus")=="quarantine"?"text-muted-foreground p-1 rounded-md border border-gray-600 flex justify-center":""}>{row.getValue("stockStatus")}</div>
    ),
  },
  {
    accessorKey: "orderDate",
    header: "orderDate",
    cell: ({ row }) => (
      <div className="capitalize">{date(row.getValue("orderDate"))}</div>
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
    accessorKey: "description",
    header: "description",
    cell: ({ row }) => <div className="lowercase">{row.getValue("description")}</div>,
  },
  {
    accessorKey: "supplier",
    header: "supplier",
    cell: ({row}) => {
      // Custom render for nested address object
      const supplier: {name: string} | null = row.getValue("supplier");
      const names = supplier?.name ?? '';
      return `${names}`;
    },
  },
  {
    accessorKey: "vendor",
    header: "vendor",
    cell: ({row}) => {
      // Custom render for nested address object
      const vendor: {name: string} | null = row.getValue("vendor");
      const names = vendor?.name ?? '';
      return `${names}`;
    },  },
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
    accessorKey: "unitAmount",
    header: () => <div className="text-right">Unit Amount</div>,
    cell: ({ row }) => <div className="text-right font-medium">{row.getValue("unitAmount")}</div>
  },
  {
    accessorKey: "unitsPurchased",
    header: "No. of Units",
    cell: ({ row }) => <div className="lowercase">{row.getValue("unitsPurchased")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "createdAt",
    cell: ({ row }) => <div className="capitalise">{date(row.getValue("createdAt"))}</div>,
  },
  {
    accessorKey: "expiryDate",
    header: "expiryDate",
    cell: ({ row }) => <div className={expired(row.getValue("expiryDate"))==true?"capitalise text-red-600":"capitalise text-green-600"}>{date(row.getValue("expiryDate"))}</div>,
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