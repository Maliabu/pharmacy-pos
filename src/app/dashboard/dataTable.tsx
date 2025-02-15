/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Dot, InfoIcon, MoreHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Stock } from "./stock/dataColumns"
import Invoice from "./invoice/invoice"
import { useToast } from "@/hooks/use-toast"
import InvoiceDialog from "./invoice/dialog"
import StepWise from "./invoice/stepWise"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    id: string
    name: string
}

export function DataTableDemo<TData, TValue>({data, columns, id, name}: DataTableProps<TData, TValue>) {
  const { toast } = useToast()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const Toast = () => {
    toast({
      title: "Scheduled: Catch up",
      description: "Friday, February 10, 2023 at 5:57 PM",
    })
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const selectedRows = table.getSelectedRowModel().rows.map(row=>row.original)

  return (
    <div className="w-full">
        <div className="sm:flex justify-between items-center">
        <div className="sm:flex items-center mt-4 p-2 bg-muted rounded-md justify-between">
            <div className="flex items-center">
            <InfoIcon/>
            <div className="text-sm leading-4 flex text-muted-foreground p-2 justify-center">{id} rows can be sorted <span className="mx-2"><ArrowUpDown size={16}/></span> in asc/desc order</div>
            </div>
        </div>
        <div className="flex gap-1 mt-1 sm:mt-0">
        { id=="product" &&
        <Dialog>
        <DialogTrigger>
        <div 
        className={table.getIsSomeRowsSelected()==true || table.getIsAllRowsSelected()==true?"bg-primary text-sm rounded-md p-2 text-lime-100 hover:bg-lime-600":"bg-muted-foreground hover:bg-muted-foreground hidden p-2 rounded-md"}>New Invoice</div>
        </DialogTrigger>
        <DialogContent className="max-w-fit h-screen overflow-y-auto">
        <DialogHeader className="hidden">
          <DialogTitle>Invoice</DialogTitle>
          <DialogDescription>
            Invoice template
          </DialogDescription>
        </DialogHeader>
        {/* <InvoiceDialog selectedRows={selectedRows as unknown as Stock[]}/> */}
        <StepWise selectedRows={selectedRows as unknown as Stock[]}/>
        </DialogContent>
      </Dialog>}
        {/* { id=="stock" && <Button className={table.getIsSomeRowsSelected() == true?"bg-foreground":"bg-muted-foreground hover:bg-muted-foreground"}>Manage Product</Button>} */}
        { id=="stock" && <Button ><Link href="/dashboard/management#stock">Add new Stock</Link></Button>}
        { id=="user" && <div className=" gap-1 flex">
            <Button ><Link href="/dashboard/management">Add new User</Link></Button>
            <Button className={table.getIsSomeRowsSelected() == true?"bg-foreground":"bg-muted-foreground hover:bg-muted-foreground"}>Deactivate</Button>
            </div>}
            </div>
        </div>
      <div className="flex items-center py-4">
        <Input
          placeholder={"search "+id+"s ..."}
          value={(table.getColumn(name)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(name)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Manage Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="text-sm p-2 rounded-md ml-1 bg-primary text-lime-200">{data.length}</div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {table.getRowModel().rows?.length>0?"Loading data...":"Add some data to your tables"}
                  </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Row 1 of &nbsp;
            {table.getPageCount()}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            Row {table.getPageCount()} of &nbsp;
            {table.getPageCount()}
          </Button>
        </div>
      </div>
      <div className="text-sm p-2 bg-muted rounded-md text-muted-foreground">Display: 10 rows per page</div>
      {
        (id=="stock" || id=="product") && <div className="flex">
          <div className=" flex text-sm items-center text-red-300"><Dot size={40} className="text-red-600"/> Product due for expiry in 2 weeks</div>
          <div className=" flex text-sm items-center text-lime-500 ml-12"><Dot size={40} className="text-primary"/> Product still okay</div>
          </div>
      }
      </div>
  )
}
