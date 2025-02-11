"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Header from "./header"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  useEffect(() => {
    const token = window.localStorage.getItem("token")
    if(token == "") return router.push("/")
    setMounted(true)
  },[router])
  return (
    <div>
    {mounted && <SidebarProvider>
      <AppSidebar />
      <main className=" sm:p-6 w-full">
        <div className="grid grid-cols-2 bg-background p-2 rounded-lg">
        <SidebarTrigger />
        <Header/></div>
        {children}
      </main>
    </SidebarProvider>}
    </div>
  )
}
