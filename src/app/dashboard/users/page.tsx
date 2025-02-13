/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Loader2 } from "lucide-react";
import {DataTableDemo} from "../dataTable"
import { User, columns } from "./userColumns"
import useSWR from "swr";
import { fetcher } from "@/app/services/services";

export default function UserPage(){

    let user: User[] = []
    const { data, error } = useSWR("/api/users", fetcher);
    if(data){
        console.log(data)
        user = data
    }
    if (!data) return <div className="flex p-6 bg-background rounded-md justify-center items-center mt-2"><Loader2 className="animate-spin"/>Loading Users ...</div>;
    
    return<div className="bg-background p-8 rounded-lg mt-2">
        <div>
            <div className="text-3xl tracking-tight font-bold">Users</div>
            <div>
                <DataTableDemo data={user} columns={columns} id="supplier"/>
            </div>
        </div>
    </div>
}