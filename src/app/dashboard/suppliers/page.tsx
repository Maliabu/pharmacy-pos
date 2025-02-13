/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Loader2 } from "lucide-react";
import {DataTableDemo} from "../dataTable"
import { Supplier, columns } from "./supplyColumns"
import useSWR from "swr";
import { fetcher } from "@/app/services/services";

export default function PageSupplier(){

    let supplier: Supplier[] = []
    const { data, error } = useSWR("/api/supplier", fetcher);
    if(data){
        console.log(data)
        supplier = data
    }
    if (!data) return <div className="flex p-6 bg-background rounded-md justify-center items-center mt-2"><Loader2 className="animate-spin"/>Loading Suppliers ...</div>;
    
    return<div className="bg-background p-8 rounded-lg mt-2">
        <div>
            <div className="text-3xl tracking-tight font-bold">Suppliers</div>
            <div>
                <DataTableDemo data={supplier} columns={columns} id="supplier"/>
            </div>
        </div>
    </div>
}