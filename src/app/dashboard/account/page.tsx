/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { fetcher, tokenise } from "@/app/services/services";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { date } from "@/app/services/services";

export default function Page(){
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    const [userType, setUserType] = useState("")
    useEffect(() => {
        setEmail(tokenise()[2])
        setUsername(tokenise()[1])
        setName(tokenise()[0])
        setUserType(tokenise()[4])
    }, [])
        const { data, error } = useSWR("/api/activity", fetcher);
        const act: any[] = []
        if(data){
            act.push(data)
        } else return []

    return<div className="bg-background p-8 rounded-lg mt-2">
        <div className="grid sm:grid-cols-3 gap-2">
            <div className="p-6 col-span-1 text-3xl font-bold tracking-tight">
                Account <div className="text-sm font-medium text-muted-foreground">This is your login account to access this dashboard. User accounts can only be created and updated by an admin account.</div>
            </div>
            <div className="p-4 bg-muted rounded-md">
                <div className="text-sm">Name: <div className="text-muted-foreground text-sm font-medium">{name}</div></div>
                <div className="mt-3 text-sm">Email: <div className="text-muted-foreground text-sm font-medium">{email}</div></div>
                <div className="mt-3 text-sm">Username: <div className="text-muted-foreground text-sm font-medium">{username}</div></div>
            </div>
            <div className="flex justify-center items-center">
                <div className="h-20 w-20 bg-primary text-muted text-5xl rounded-full flex justify-center items-center ">{name[0]?name[0].toUpperCase():name[0]}</div>
            </div>
        </div>
        {userType=="admin" &&
        <div className="mt-4 sm:p-8 p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold tracking-tight">User Activity / Timeline (Logging)</div>
            <div className="text-sm font-medium text-muted-foreground">Logging user activities on the platform, visible only to the administrator</div>
            <div className="bg-background p-6 mt-6 rounded-md overflow-auto h-[300px]">
                <div className="text-sm flex justify-between text-muted-foreground my-4 p-2 bg-muted rounded-md">
                    <p>User</p>
                    <p>Activities</p>
                    <p>Date of activity</p>
                </div>
                {data.map((activity:{activity: string, createdAt: string, id:number, users: {name: string}}) => (
                    <div className="text-sm py-2 border-b grid grid-cols-3" key={activity.id}>
                         <p>{activity.users.name}</p>
                         <p className="text-left">{activity.activity}</p>
                        <p className="text-right">{date(activity.createdAt)}</p>
                    </div>
                ))}
            </div>
        </div>}
    </div>
}