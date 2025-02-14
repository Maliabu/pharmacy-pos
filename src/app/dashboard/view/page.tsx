/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { File, Loader2, Pill, Receipt, Store, Truck, User } from "lucide-react"
import UserPage from "../users/page"
import PageStock from "../stock/page"
import PageSupplier from "../suppliers/page"
import PageBill from "../bills/page"
import PageVendor from "../vendors/page"
import { tokenise } from "@/app/services/services"

export default function Page() {
  return (
    <Tabs defaultValue="stock" className="">
        <div className="text-3xl font-bold tracking-tight sm:my-4 m-4 sm:mx-0">View</div>
      <TabsList className="grid w-full grid-cols-5">
        {tokenise()[4]=="admin" && <TabsTrigger value="user" className="p-2 border-none"><User size={16} className="mr-2"/>Users</TabsTrigger>}
        <TabsTrigger value="stock" className="p-2 border-none"><Pill size={16} className="mr-2"/>Stock</TabsTrigger>
        <TabsTrigger value="supplier" className="p-2 border-none"><Truck size={16} className="mr-2"/>Suppliers</TabsTrigger>
        <TabsTrigger value="bill" className="p-2 border-none"><Receipt size={16} className="mr-2"/>Bills</TabsTrigger>
        <TabsTrigger value="vendor" className="p-2 border-none"><Store size={16} className="mr-2"/>Vendors</TabsTrigger>
        </TabsList>
      <TabsContent value="user">
      <Card className="shadow-none border-none">
        <UserPage/>
      </Card>
      </TabsContent>
      <TabsContent value="stock">
        <Card className="shadow-none border-none">
        <PageStock/>
        </Card>
      </TabsContent>
      <TabsContent value="supplier">
        <Card className="shadow-none border-none">
        <PageSupplier/>
        </Card>
      </TabsContent>
      <TabsContent value="bill">
        <Card className="shadow-none border-none">
        <PageBill/>
        </Card>
      </TabsContent>
      <TabsContent value="vendor">
        <Card className="shadow-none border-none">
        <PageVendor/>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
