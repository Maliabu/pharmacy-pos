/* eslint-disable @next/next/no-img-element */
"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { date, fetcher, tokenise } from "@/app/services/services";
import useSWR from "swr";
import { Invoice } from "./invoiceColumns";
import { Button } from "@/components/ui/button";
import { pendingToPaid } from "@/server/fetch.actions";
import { useEffect, useState } from "react";


interface InvoiceItems{
    id: number
    product: {
        name: string
        description: string
        unitAmount: number
        orderDate: Date
    },
    invoice: number
    total: number
    quantity: number
}

export default function PreviewInvoice(props: {invoiceId: number}){
    const [userid, setUserId] = useState('')
    useEffect(() => {
        setUserId(tokenise()[3])
    }, [])
    const { data: data1, error: error1 } = useSWR(
        props.invoiceId ? `/api/invoiceItems/${props.invoiceId}` : null, // Conditional key
        fetcher
    );
    const { data: data2, error: error2 } = useSWR(
        props.invoiceId ? `/api/invoice/${props.invoiceId}` : null, // Conditional key
        fetcher
    );

    let invoices: InvoiceItems[] = []
    if (error1) return <div className="sm:w-[800px]">Error loading invoice items data</div>;
    if (!data1) return <div className="sm:w-[800px]">Loading items...</div>;
    if(data1){invoices = data1}

    let invoice: Invoice[] = []
    if (error2) return <div className="sm:w-[800px]">Error loading invoice items data</div>;
    if (!data2) return <div className="sm:w-[800px]">Loading the invoice...</div>;
    if(data2){invoice = data2}

    async function paid(){
        const app = document.getElementById('paid');
        const text = 'processing';
        if(app !== null){
          app.innerHTML = text;
        }
        const data = await pendingToPaid(props.invoiceId, userid)
        if(data.error == false){
            const app = document.getElementById('submit');
            const text = 'successful';
            if(app !== null){
          app.innerHTML = text;
        }
            window.location.reload()
        } else {
            console.log(data.error)
        }
    }

    // Calculate the overall total for the table
    const calculateOverallTotal = () => {
        let total = 0
      invoices.forEach((invoice) => {
        total+=invoice.total
      })
      return total
    };

    return(
        <div className="sm:p-12 rounded-md sm:w-[800px]">
            <div className="flex justify-between border-b pb-6">
            <img src="https://newfeelventures.com/logo.png" alt="logo" width={200} height={100}/>
            <div className="text-3xl font-bold tracking-tight">INVOICE</div>
            </div>
            <div className="flex justify-between">
                <div className="flex flex-col text-sm mt-8">
                    <p className="font-bold">Billed To:</p>
                    <p>{invoice[0].address}</p>
                </div>
                <div className="flex flex-col text-sm mt-8 w-[100px]">
                    <p>Invoice No. <span className="text-red-600">{props.invoiceId}</span></p>
                    <p>{date(Date())}</p>
                </div>
            </div>
            <div>
                <div className="mt-8 text-sm font-bold">Purchase</div>
                <Table>
                <TableHeader>
                    <TableRow >
                    <TableHead >No.</TableHead>
                    <TableHead >OrderDate</TableHead>
                    <TableHead >Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">UnitPrice</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((row, index) => (
                    <TableRow key={row.id}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{date(row.product.orderDate.toString())}</TableCell>
                        <TableCell className="font-medium">{row.product.name}</TableCell>
                        <TableCell>{row.product.description}</TableCell>
                        <TableCell className="text-right">{row.product.unitAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{row.quantity}</TableCell>
                        <TableCell className="text-right">{row.total}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
                <div className="text-sm">
                    <div className="grid grid-cols-4 bg-muted p-2">
                    <div className=" text-right font-bold col-span-3">Total </div>
                    <div className="text-right col-span-1"><span className="mr-1">UGX</span>{calculateOverallTotal()}</div>
                    </div>
                </div>
                </div>
                <div className="flex flex-col py-4 text-sm border-t mt-12">
                    <p className="font-bold">Payment Details</p>
                    <p>{invoice[0].paymentID}</p>
                    <p>{invoice[0].paymentMeans}</p>
                </div>
                {invoice[0].invoiceStatus == "pending" && <Button id="paid" onClick={() => paid()} className="mt-6">Mark this invoice as paid</Button>}
        </div>
    )
}