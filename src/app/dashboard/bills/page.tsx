/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Loader2 } from "lucide-react";
import {DataTableDemo} from "../dataTable"
import { Bill, columns } from "./billColumns"
import useSWR from "swr";
import { fetcher } from "@/app/services/services";

export default function PageBill(){

    let bills: Bill[] = []
    const { data, error } = useSWR("/api/bills", fetcher);
    if(data){
        console.log(data)
        bills = data
    }
    if (!data) return <div className="flex p-6 bg-background rounded-md justify-center items-center mt-2"><Loader2 className="animate-spin"/>Loading Bills ...</div>;
    
    return<div className="bg-background p-8 rounded-lg mt-2">
        <div>
            <div className="text-3xl tracking-tight font-bold">Bills</div>
            <div>
                <DataTableDemo data={bills} columns={columns} id="supplier" name="name"/>
            </div>
        </div>
    </div>
}