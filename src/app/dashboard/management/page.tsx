/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import AddUser from "@/app/auth/page"
import {
  Card,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import AddSupplier from "../suppliers/addSupplier"
import AddVendor from "../vendors/addVendor"
import AddStock from "../stock/addStock"
import AddBill from "../bills/addBill"
import AddPackaging from "../packaging/addPackage"
import { Box, Pill, Receipt, Store, Truck, User } from "lucide-react"
import { tokenise } from "@/app/services/services"

export default function Page() {
  return (
    <Tabs defaultValue="stock" className="">
        <div className="text-3xl font-bold tracking-tight sm:my-4 m-4 sm:mx-0">Add</div>
      <TabsList className="grid w-full grid-cols-6">
      {tokenise()[4]=="admin" && <TabsTrigger value="user" className="p-2 border-none"><User size={16} className="mr-2"/>Users</TabsTrigger>}
        <TabsTrigger value="stock" className="p-2 border-none"><Pill size={16} className="mr-2"/>Stock</TabsTrigger>
        <TabsTrigger value="supplier" className="p-2 border-none"><Truck size={16} className="mr-2"/>Supplier</TabsTrigger>
        <TabsTrigger value="vendor" className="p-2 border-none"><Store size={16} className="mr-2"/>Vendor</TabsTrigger>
        <TabsTrigger value="bill" className="p-2 border-none"><Receipt size={16} className="mr-2"/>Bill</TabsTrigger>
        <TabsTrigger value="packaging" className="p-2 border-none"><Box size={16} className="mr-2"/>Packaging & Unit</TabsTrigger>
        </TabsList>
      <TabsContent value="user">
      <Card className="shadow-none border-none">
        <AddUser/>
        </Card>
      </TabsContent>
      <TabsContent value="stock">
        <Card className="shadow-none border-none">
          <AddStock/>
        </Card>
      </TabsContent>
      <TabsContent value="supplier">
        <Card className="shadow-none border-none">
          <AddSupplier/>
        </Card>
      </TabsContent>
      <TabsContent value="vendor">
        <Card className="shadow-none border-none">
          <AddVendor/>
        </Card>
      </TabsContent>
      <TabsContent value="bill">
        <Card className="shadow-none border-none">
          <AddBill/>
        </Card>
      </TabsContent>
      <TabsContent value="packaging">
        <Card className="shadow-none border-none">
          <AddPackaging/>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
