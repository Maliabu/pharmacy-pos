"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

type Product = {
    id: string
    status: "active" | "quarantine" | "safety"
    orderDate: string
    name: string
    description: string
    supplierVendor: string
    currency: string
    unitAmount: number
    unitsPurchased: number
    unit: string,
    expiryDate: string
  }
  
export const data: Product[] = [
    {
        id: "1",
        orderDate: "25 feb 2025",
        name: "paracetamol",
        description: "pain killers",
        supplierVendor: "medic pharm",
        currency: "ugx",
        status: "active",
        unitAmount: 2500,
        unitsPurchased: 6,
        unit: "box",
        expiryDate: "25 feb 2027"
    },
    {
        id: "2",
        orderDate: "25 feb 2025",
        name: "vitamin c",
        description: "pain killers",
        supplierVendor: "medic pharm",
        currency: "ugx",
        unitAmount: 2500,
        status: "active",
        unitsPurchased: 6,
        unit: "box",
        expiryDate: "25 feb 2027"
    },
    {
        id: "3",
        orderDate: "25 feb 2025",
        name: "paracetamol",
        description: "pain killers",
        supplierVendor: "medic pharm",
        currency: "ugx",
        unitAmount: 2500,
        unitsPurchased: 6,
        status: "safety",
        unit: "box",
        expiryDate: "25 feb 2027"
    },
    {
        id: "4",
        orderDate: "25 feb 2025",
        name: "mabendazol",
        description: "pain killers",
        supplierVendor: "medic pharm",
        currency: "ugx",
        unitAmount: 2500,
        unitsPurchased: 6,
        status: "quarantine",
        unit: "box",
        expiryDate: "25 feb 2027"
    },
    {
        id: "5",
        orderDate: "25 feb 2025",
        name: "paracetamol",
        description: "pain killers",
        supplierVendor: "medic pharm",
        currency: "ugx",
        unitAmount: 2500,
        unitsPurchased: 6,
        status: "active",
        unit: "box",
        expiryDate: "25 feb 2027"
    },
    {
        id: "6",
        orderDate: "25 feb 2025",
        name: "ampicilin",
        description: "pain killers",
        supplierVendor: "medic pharm",
        currency: "ugx",
        unitAmount: 2500,
        status: "active",
        unitsPurchased: 6,
        unit: "box",
        expiryDate: "25 feb 2027"
    },
    {
        id: "7",
        orderDate: "25 feb 2025",
        name: "charchoal",
        description: "stomach pain killers",
        supplierVendor: "medic pharm",
        currency: "ugx",
        unitAmount: 2500,
        status: "active",
        unitsPurchased: 6,
        unit: "box",
        expiryDate: "25 feb 2027"
    },
    {
        id: "8",
        orderDate: "25 feb 2025",
        name: "magnesium",
        description: "pain killers",
        supplierVendor: "medic pharm",
        currency: "ugx",
        unitAmount: 2500,
        status: "active",
        unitsPurchased: 6,
        unit: "box",
        expiryDate: "25 feb 2027"
    },
    {
        id: "9",
        orderDate: "25 feb 2025",
        name: "chloroquin",
        description: "pain killers",
        supplierVendor: "medic pharm",
        currency: "ugx",
        status: "active",
        unitAmount: 2500,
        unitsPurchased: 6,
        unit: "box",
        expiryDate: "25 feb 2027"
    },
    {
        id: "10",
        orderDate: "25 feb 2025",
        name: "ampicilin",
        description: "pain killers",
        supplierVendor: "medic pharm",
        currency: "ugx",
        unitAmount: 2500,
        status: "active",
        unitsPurchased: 6,
        unit: "box",
        expiryDate: "25 feb 2027"
    },
    {
        id: "11",
        orderDate: "25 feb 2025",
        name: "amoxylin",
        description: "pain killers",
        supplierVendor: "medic pharm",
        currency: "ugx",
        unitAmount: 2500,
        status: "active",
        unitsPurchased: 6,
        unit: "box",
        expiryDate: "25 feb 2027"
    },
]

export const columns: ColumnDef<Product>[] = [
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
      <div className={row.getValue("status") == "active"?"text-lime-600 p-1 rounded-md border border-lime-600 flex justify-center":row.getValue("status")=="safety"?"text-destructive p-1 rounded-md border border-red-600 flex justify-center":row.getValue("status")=="quarantine"?"text-muted-foreground p-1 rounded-md border border-gray-600 flex justify-center":""}>{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "orderDate",
    header: "orderDate",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("orderDate")}</div>
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
    accessorKey: "supplierVendor",
    header: "supplier/vendor",
    cell: ({ row }) => <div className="lowercase">{row.getValue("supplierVendor")}</div>,
  },
  {
    accessorKey: "unitAmount",
    header: () => <div className="text-right">Unit Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("unitAmount"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "UGX",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "unitsPurchased",
    header: "No. of Units",
    cell: ({ row }) => <div className="lowercase">{row.getValue("unitsPurchased")}</div>,
  },
  {
    accessorKey: "unit",
    header: "unit",
    cell: ({ row }) => <div className="lowercase">{row.getValue("unit")}</div>,
  },
  {
    accessorKey: "expiryDate",
    header: "expiryDate",
    cell: ({ row }) => <div className="lowercase">{row.getValue("expiryDate")}</div>,
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