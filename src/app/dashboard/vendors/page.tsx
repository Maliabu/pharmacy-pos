/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Loader2 } from "lucide-react";
import {DataTableDemo} from "../dataTable"
import { Vendor, columns } from "./vendorColumns"
import useSWR from "swr";
import { fetcher } from "@/app/services/services";

export default function PageVendor(){

    let vendor: Vendor[] = []
    const { data, error } = useSWR("/api/vendor", fetcher);
    if(data){
        console.log(data)
        vendor = data
    }
    if (!data) return <div className="flex p-6 bg-background rounded-md justify-center items-center mt-2"><Loader2 className="animate-spin"/>Loading Vendors ...</div>;
    
    return<div className="bg-background p-8 rounded-lg mt-2">
        <div>
            <div className="text-3xl tracking-tight font-bold">Vendors</div>
            <div>
                <DataTableDemo data={vendor} columns={columns} id="supplier"/>
            </div>
        </div>
    </div>
}