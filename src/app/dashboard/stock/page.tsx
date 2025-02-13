/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import useSWR from "swr"
import {DataTableDemo} from "../dataTable"
import { Stock, columns } from "./dataColumns"
import { fetcher } from "@/app/services/services"
import { Loader2 } from "lucide-react"

export default function Page(){

    let stock: Stock[] = []
    const { data, error } = useSWR("/api/stock", fetcher);
    if(data){
        console.log(data)
        stock = data
    }
    if (!data) return <div className="flex p-6 bg-background rounded-md justify-center items-center mt-2"><Loader2 className="animate-spin"/>Loading Stock ...</div>;
    
    return<div className="bg-background p-8 rounded-lg mt-2">
        <div>
            <div className="text-3xl tracking-tight font-bold">Stock</div>
            <div>
                <DataTableDemo data={stock} columns={columns} id="stock"/>
            </div>
        </div>
    </div>
}