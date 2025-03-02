"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { date, fetcher } from "@/app/services/services";
import useSWR from "swr";
import Image from "next/image";


export interface ReceiptItems{
    id: number
    quantity: number
    product: {
        name: string
        description: string
        unitAmount: number
        orderDate: Date
    },
    user:{
        name: string
    }
    createdAt: Date
  }
  interface Receipt1{
    id: number
    user:{
        name: string
    }
    createdAt: Date
  }

export default function PreviewReceipt(props: {receiptId: number}){
    const { data: data1, error: error1 } = useSWR(
        props.receiptId ? `/api/receipt/${props.receiptId}` : null, // Conditional key
        fetcher
    );
    const { data: data2, error: error2 } = useSWR(
        props.receiptId ? `/api/receipts/${props.receiptId}` : null, // Conditional key
        fetcher
    );

    let receipts: Receipt1[] = []
    if (error1) return <div className="sm:w-[300px]">Error loading receipt data</div>;
    if (!data1) return <div className="sm:w-[300px]">Loading items...</div>;
    if(data1){receipts = data1}

    let receipt: ReceiptItems[] = []
    if (error2) return <div className="sm:w-[300px]">Error loading receipt items data</div>;
    if (!data2) return <div className="sm:w-[300px]">Loading the receipt...</div>;
    if(data2){receipt = data2}

    const total = () => {
        let total = 0
      receipt.forEach((receipt) => {
        total+=receipt.quantity * receipt.product.unitAmount
      })
      return total
    };

    // Calculate the overall total for the table
    const calculateOverallTotal = () => {
        let grandTotal = 0
      receipts.forEach(() => {
        grandTotal+=total()
      })
      return grandTotal
    };

    return(
        <div className="sm:p-4 rounded-md sm:w-[400px]">
            <div className="pb-6 flex flex-col items-center justify-center text-center">
            <Image src="https://res.cloudinary.com/dwklt6k9c/image/upload/v1739947271/logo_filskw.png" alt="logo" width={200} height={100} unoptimized/>
            </div>
            <div className="flex justify-end">
                <div className="flex flex-col text-sm mt-8 w-[100px]">
                    <p><span className="font-bold">Date: </span>{date(receipts[0].createdAt.toString())}</p>
                </div>
            </div>
            <div>
                <div className="mt-8 text-sm font-bold">Purchase</div>
                <Table>
                <TableHeader>
                    <TableRow >
                    <TableHead >No.</TableHead>
                    <TableHead >Item</TableHead>
                    <TableHead >Unit</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {receipt.map((row, index) => (
                    <TableRow key={row.id}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{row.product.name}</TableCell>
                        <TableCell className="font-medium">{row.product.unitAmount}</TableCell>
                        <TableCell>{row.quantity}</TableCell>
                        <TableCell className="text-right">{row.quantity * row.product.unitAmount}</TableCell>
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
                <div className="p-6 text-sm text-center">Prepared By: {receipts.map(user=>user.user.name)}</div>
                </div>
        </div>
    )
}