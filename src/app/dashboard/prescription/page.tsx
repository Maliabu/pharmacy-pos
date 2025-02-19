/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import StepWise from "./stepWise";
import { Loader2 } from "lucide-react";
import useSWR from "swr";
import { date, fetcher } from "@/app/services/services";
import { DataTableDemo } from "../dataTable";
import { Prescription, columns } from "./prescriptionColumns";


export default function Page(){
  let prescription: Prescription[] = []
  const { data, error } = useSWR("/api/prescriptions", fetcher);
  if(data){
      prescription = data
  }
  if (!data) return <div className="flex p-6 bg-background rounded-md justify-center items-center mt-2"><Loader2 className="animate-spin"/>Loading Prescriptions ...</div>;
    return<div className="bg-background p-8 rounded-lg mt-2">
        <Dialog>
        <DialogTrigger>
        <div className="p-2 bg-primary rounded-md text-sm text-green-100">New Prescriprion</div>
        </DialogTrigger>
        <DialogContent className="max-w-fit h-screen overflow-y-auto sm:w[800px]">
        <DialogHeader className="hidden">
          <DialogTitle>Prescriptions</DialogTitle>
          <DialogDescription>
            Prescription template
          </DialogDescription>
        </DialogHeader>
        <StepWise/>
        </DialogContent>
      </Dialog>
        <div className="mt-6">
            <div className="text-3xl tracking-tight font-bold">Prescriptions</div>
            <div>
                <DataTableDemo data={prescription} columns={columns} id="prescription" name="name"/>
            </div>
        </div>
    </div>
}