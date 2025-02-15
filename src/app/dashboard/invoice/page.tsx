/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Loader2 } from "lucide-react";
import {DataTableDemo} from "../dataTable"
import { Invoice, columns } from "./invoiceColumns"
import useSWR from "swr";
import { fetcher } from "@/app/services/services";

export default function PageBill(){

    let invoices: Invoice[] = []
    const { data, error } = useSWR("/api/invoice", fetcher);
    if(data){
        invoices = data
    }
    if (!data) return <div className="flex p-6 bg-background rounded-md justify-center items-center mt-2"><Loader2 className="animate-spin"/>Loading Invoices ...</div>;
    
    return<div className="bg-background p-8 rounded-lg mt-2">
        <div>
            <div className="text-3xl tracking-tight font-bold">Invoices</div>
            <div>
                <DataTableDemo data={invoices} columns={columns} id="invoice" name="user"/>
            </div>
        </div>
    </div>
}