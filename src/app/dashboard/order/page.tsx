/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import StepWise from "./stepWise";
import { Loader2 } from "lucide-react";
import useSWR from "swr";
import { date, fetcher } from "@/app/services/services";
import PreviewReceipt from "./previewReceipt";

export interface Receipt{
  id: number
  user: number
  receiptItems: {
    product: number
    quantity: number
    createdAt: Date
  }
  createdAt: Date
}
export default function Page(){
  let receipt: Receipt[] = []
  const { data, error } = useSWR("/api/receipt/receipt", fetcher);
  if(data){
      receipt = data
  }
  if (!data) return <div className="flex p-6 bg-background rounded-md justify-center items-center mt-2"><Loader2 className="animate-spin"/>Loading Receipts ...</div>;
    return<div className="bg-background p-8 rounded-lg mt-2">
        <Dialog>
        <DialogTrigger>
        <div className="p-2 bg-primary rounded-md text-sm text-green-100">New Order</div>
        </DialogTrigger>
        <DialogContent className="sm:w-[800px] h-screen overflow-y-auto">
        <DialogHeader className="hidden">
          <DialogTitle>Invoice</DialogTitle>
          <DialogDescription>
            Invoice template
          </DialogDescription>
        </DialogHeader>
        <StepWise/>
        </DialogContent>
      </Dialog>
      <div className="text-2xl font-bold tracking-tight mt-8">Receipts</div>
      <div className="grid grid-cols-3 gap-2 bg-muted rounded-md p-4 mt-4">
      {
        receipt.map(receipt => (
          <div key={receipt.id} className="p-4 bg-background rounded-md mt-1 flex justify-between">
          <div className="text-sm">Receipt No. <span className="text-red-600">{receipt.id}</span><div className="text-sm text-muted-foreground leading-4">{date(receipt.createdAt.toString())}</div></div>
          <div>
          <Dialog>
        <DialogTrigger>
        <img src="/pdf.png" alt="pdf image" width={25} height={30}/></DialogTrigger>
        <DialogContent className="max-w-fit h-screen overflow-y-auto">
        <DialogHeader className="hidden">
          <DialogTitle>Invoice</DialogTitle>
          <DialogDescription>
            Invoice template
          </DialogDescription>
        </DialogHeader>
        <PreviewReceipt receiptId={receipt.id} />
        </DialogContent>
      </Dialog>
          </div>
          </div>
        ))
      }
      </div>
    </div>
}