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
    <div className="bg-muted">
    {mounted && <SidebarProvider>
      <AppSidebar />
      <main className=" sm:p-6 w-full">
        <div className="sm:grid sm:grid-cols-12 bg-background p-2 rounded-lg">
          <div className="sm:col-span-2">
          <SidebarTrigger /></div>
          <div className="sm:col-span-10">
          <Header/></div></div>
        {children}
      </main>
    </SidebarProvider>}
    </div>
  )
}
