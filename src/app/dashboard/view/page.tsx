/* eslint-disable @typescript-eslint/no-unused-vars */
import AddUser from "@/app/auth/page"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { DataTableDemo } from "../dataTable"
import { columns, data } from "../stock/dataColumns"
import { columns as invoiceColumns, data as invoiceData } from "../invoice/invoiceColumns"
import { columns as supplyColumns, data as supplyData } from "../suppliers/supplyColumns"
import { columns as authColumns, data as authData } from "@/app/auth/usersColumns"
import { Card } from "@/components/ui/card"
import { File, Pill, Receipt, Store, Truck, User } from "lucide-react"

export default function Page() {
  return (
    <Tabs defaultValue="user" className="">
        <div className="text-3xl font-bold tracking-tight sm:my-4 m-4 sm:mx-0">View</div>
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="user" className="p-2 border-none"><User size={16} className="mr-2"/>Users</TabsTrigger>
        <TabsTrigger value="stock" className="p-2 border-none"><Pill size={16} className="mr-2"/>Stock</TabsTrigger>
        <TabsTrigger value="supplier" className="p-2 border-none"><Truck size={16} className="mr-2"/>Suppliers</TabsTrigger>
        <TabsTrigger value="invoice" className="p-2 border-none"><File size={16} className="mr-2"/>Invoices</TabsTrigger>
        <TabsTrigger value="bill" className="p-2 border-none"><Receipt size={16} className="mr-2"/>Bills</TabsTrigger>
        <TabsTrigger value="vendor" className="p-2 border-none"><Store size={16} className="mr-2"/>Vendors</TabsTrigger>
        </TabsList>
      <TabsContent value="user">
      <Card className="shadow-none border-none p-6">
        <div className="text-2xl font-bold tracking-tight">Users</div>
      <DataTableDemo data={authData} columns={authColumns} id="user"/>
      </Card>
      </TabsContent>
      <TabsContent value="stock">
        <Card className="shadow-none border-none p-6">
        <div className="text-2xl font-bold tracking-tight">Stock</div>
          <DataTableDemo data={data} columns={columns} id="stock"/>
        </Card>
      </TabsContent>
      <TabsContent value="supplier">
        <Card className="shadow-none border-none p-6">
        <div className="text-2xl font-bold tracking-tight">Suppliers</div>
          <DataTableDemo data={supplyData} columns={supplyColumns} id="supplier"/>
        </Card>
      </TabsContent>
      <TabsContent value="invoice">
        <Card className="shadow-none border-none p-6">
        <div className="text-2xl font-bold tracking-tight">Invoices</div>
          <DataTableDemo data={invoiceData} columns={invoiceColumns} id="invoice"/>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
