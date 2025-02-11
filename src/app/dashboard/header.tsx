"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */


import { Bell, Moon, Sun } from "lucide-react";
import Profile from "../auth/profile";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { search } from "@/schema/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function Header(){
    const { setTheme } = useTheme()
    const form = useForm<z.infer<typeof search>>({
    resolver: zodResolver(search),
      defaultValues: {
        search: '',
    },
  })
  const searchParam = form.getValues("search")
  const searchCriteria = [
    {
        "name": "Events & News",
        "description": "News & Events",
        "tab": "/events"
    },
    {
        "name": "services",
        "description": "services",
        "tab": "/offers"
    },
    {
        "name": "classes",
        "description": "courses, enrollments",
        "tab": "/offers#classes"
    },
    {
        "name": "community",
        "description": "our community",
        "tab": "/contact"
    }
  ]
  const criteria = {}
  function searchResults(){
    if(searchParam === ""){
      return (
          <div>
              <p className="small text-start">0 search results found</p>
          </div>
      )
    } else {
      const SearchFilter = searchCriteria.filter((item)=>{ if(item.name.toLowerCase().includes(searchParam.toLowerCase())){return <p key={item.tab}>{item.name}</p>}})
      const myFinalSearch = SearchFilter.map((item) => {return <div key={item.tab} className="grid grid-cols-1 p-4 bg-muted rounded-md mt-1"><p>{item.name}</p><Link href={item.tab}>{item.description}</Link></div>})
      return(
          <div className="pt-4">{myFinalSearch}</div>
      )
    }
  }
    return <div className="">
        <div className="bg-background rounded-lg grid grid-cols-1 gap-2">
            <div className="col-span-2 hidden">
            <Form {...form}>
                <form>
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                      <FormItem>
                      <FormControl>
                      <Input id="search" placeholder="search here..." {...field}/>
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}/>
                </form>
            </Form>
            </div>
            <div className="col-span-1">
                <div className="flex items-center justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <div className="flex justify-center border-none items-center">
                        <Sun className="h-[1.2rem] w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="mr-3 h-[1.2rem] w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="">Toggle theme</span></div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="mx-3">
                    <Profile/></div>
                <Bell/></div>
            </div>
        </div>
    </div>
}