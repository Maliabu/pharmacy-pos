/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { BarChart, ChartBar, ChartBarIcon, File, LineChart, ListChecks, PenToolIcon, Pill, Plus, Receipt, Settings2, ShoppingBasket, Store, StoreIcon, Sun, Tag, TruckIcon, User, View, Wallet } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import LogoutAdmin from "../auth/logoutAdmin"
import Logged from "../auth/user"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Sales",
      url: "/dashboard/salesChart",
      icon: ShoppingBasket,
      isActive: true,
      items: [
        {
          title: "Overview",
          icon: LineChart,
          url: "/dashboard/salesChart",
        },
        {
          title: "Invoices",
          icon: File,
          url: "/dashboard/invoice",
        },
        {
          title: "Products",
          icon: Tag,
          url: "/dashboard/products",
        },
      ],
    },
    {
      title: "Inventory",
      url: "#",
      icon: ListChecks,
      isActive: false,
      items: [
        {
          title: "Overview",
          icon: BarChart,
          url: "/dashboard/inventoryChart",
        },
        {
          title: "Stock",
          icon: Pill,
          url: "/dashboard/stock",
        },
        {
          title: "Suppliers",
          icon: TruckIcon,
          url: "/dashboard/suppliers",
        },
      ],
    },
    {
      title: "Expenses",
      url: "#",
      icon: Wallet,
      isActive: false,
      items: [
        {
          title: "Bills",
          icon: Receipt,
          url: "/dashboard/bills",
        },
        {
          title: "Vendors",
          icon: StoreIcon,
          url: "/dashboard/vendors",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      isActive: false,
      items: [
        {
          title: "Account",
          icon: User,
          url: "/dashboard/account",
        },
      ],
    },
    {
      title: "Manage",
      url: "#",
      icon: PenToolIcon,
      isActive: false,
      items: [
        {
          title: "Add",
          icon: Plus,
          url: "/dashboard/management",
        },
        {
          title: "View",
          icon: View,
          url: "/dashboard/view",
        }
      ],
    },
  ]
}

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex justify-between items-center p-3 rounded-lg bg-primary text-muted">
          <Pill/>
          <div className="text-2xl font-bold tracking-tight">Medic Pharm</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
      <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <Logged/>
        <LogoutAdmin/>
      </SidebarFooter>
    </Sidebar>
  )
}

