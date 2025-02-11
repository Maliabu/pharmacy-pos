"use client"
import { tokenise } from "@/app/services/services";
import { useEffect, useState } from "react";

export default function Page(){
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    useEffect(() => {
        setEmail(tokenise()[2])
        setUsername(tokenise()[1])
        setName(tokenise()[0])
    }, [])
    return<div className="bg-background p-8 rounded-lg mt-2">
        <div className="grid sm:grid-cols-3 gap-2">
            <div className="p-6 col-span-1 text-3xl font-bold tracking-tight">
                Account <div className="text-sm font-medium text-muted-foreground">This is your login account to access this dashboard. User accounts can only be created and updated by an admin account.</div>
            </div>
            <div className="p-6 border-l">
                <div className="font-bold">Name: <div className="text-muted-foreground text-sm font-medium">{name}</div></div>
                <div className="mt-3 font-bold">Email: <div className="text-muted-foreground text-sm font-medium">{email}</div></div>
                <div className="mt-3 font-bold">Username: <div className="text-muted-foreground text-sm font-medium">{username}</div></div>
            </div>
            <div>
                <div className="h-20 w-20 bg-primary text-muted text-5xl rounded-full flex justify-center items-center">{name[0]}</div>
            </div>
        </div>
        <div className="mt-4 p-2 rounded-lg border">
            <div className="text-3xl font-bold tracking-tight">User Activity / Timeline (Logging)</div>
            <div className="text-sm font-medium text-muted-foreground">Logging user login times and activities regarding invoicing and sales operations for this user</div>
        </div>
    </div>
}