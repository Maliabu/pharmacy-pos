"use client"
/* eslint-disable @typescript-eslint/no-unused-vars */


import { Bell, Dot, Loader2, Moon, Sun } from "lucide-react";
import Profile from "../auth/profile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { fetcher, setStatus, status, tokenise } from "../services/services";
import useSWR from "swr";
import { User } from "./users/userColumns";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Notify } from "./notifications/page";

export default function Header(){
    const [stat, setStat] = useState('old')
    const [disabled, setDisabled] = useState(false);
    const { setTheme } = useTheme()
    useEffect(() => {
        setStat(status())
    },[])
    let user: User[] = []
    let notes: Notify[] = []

    const logged: User[] = []
    const { data, error } = useSWR("/api/users", fetcher);
    const { data: notifications, error: notError } = useSWR("/api/notifications", fetcher);
    if(data){
        user = data
        user.forEach(user => {
            if(user.isLoggedIn == true){
                logged.push(user)
            }
        })
    }
    if(notifications){
        notes = notifications
    }
    let hasNew = notes?.some((n: Notify) => n.status === "new");

    if (!data) return <div className="flex bg-background rounded-md justify-center items-center mt-2"><Loader2 className="animate-spin"/>Loading Users ...</div>;

    function notify(){
        if(hasNew){
            return "bg-muted dark:text-green-400 text-green-600 animate-bounce rounded-full w-10 h-10 flex justify-center items-center"
        } else {
            return "bg-muted text-gray-400 rounded-full w-10 h-10 flex justify-center items-center"
        }
    }
    const handleClick = async () => {
        hasNew = false;
        const userId = tokenise()[3]
    
        // Mark notifications as read
        await fetch(`/api/notifications/${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });
          
      };
    return <div className="">
        <div className="bg-background rounded-lg grid sm:grid-cols-2 gap-2">
            <div className="sm:col-span-1">
            {tokenise()[4]=="admin" && 
            <div className=" bg-muted py-1 px-4 rounded-md flex justify-between items-center">
                <div className="text-sm">Logged in users: {logged.length}</div>
                <div className="flex">{logged.map(user => (
                    <div key={user.id} className="h-8 w-8 -ml-4 border border-2 border-muted bg-green-600 text-background grid font-bold rounded-full justify-center items-center">{user.name[0].toUpperCase()}</div>
                ))}</div>
            </div>}
            </div>
            <div className="sm:col-span-1">
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
                    <Link href="/dashboard/notifications" className={notify()} onClick={handleClick}>
                    <Bell size={18}/><Dot className="absolute -mt-5 -mr-3" size={40}/></Link></div>
            </div>
        </div>
    </div>
}