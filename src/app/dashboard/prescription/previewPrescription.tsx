/* eslint-disable @next/next/no-img-element */
"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { date, fetcher } from "@/app/services/services";
import useSWR from "swr";
import { Prescription } from "./prescriptionColumns";

export default function PreviewPrescription(props: {prescriptionId: number}){
    const { data: data2, error: error2 } = useSWR(
        props.prescriptionId ? `/api/prescriptions/${props.prescriptionId}` : null, // Conditional key
        fetcher
    );

    let prescription: Prescription[] = []
    if (error2) return <div className="sm:w-[800px]">Error loading prescriptions</div>;
    if (!data2) return <div className="sm:w-[800px]">Loading prescriptions...</div>;
    if(data2){prescription = data2}

    return(
        <div className="sm:p-12 rounded-md sm:w-[800px]">
            <div className="flex justify-between border-b pb-6">
            <img src="https://newfeelventures.com/logo.png" alt="logo" width={200} height={100}/>
            </div>
            <div className="flex justify-between">
                <div className="flex flex-col text-sm mt-8">
                    <p className="font-bold">Billed To:</p>
                    <p>{prescription[0].physicalAddress}</p>
                </div>
                <div className="flex flex-col text-sm mt-8 w-[100px]">
                    <p>Prescription No. <span className="text-red-600">{props.prescriptionId}</span></p>
                    <p>{date(prescription[0].createdAt.toString())}</p>
                </div>
            </div>
            <div>
                <div className="mt-8 text-sm font-bold">Purchase</div>
                <Table className="border border-gray-300">
                <TableHeader>
                    <TableRow className="bg-muted">
                    <TableHead className="border border-gray-300">Tests</TableHead>
                    <TableHead >Diagnosis</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {prescription.map((row) => (
                    <TableRow key={row.id}>
                        <TableCell className="font-medium boreder border-gray-300">{row.testsDone}</TableCell>
                        <TableCell>{row.diagnosis}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
                <div className="text-sm mt-6">
                    <p className="font-bold">Prescription</p>
                    <p>{prescription[0].prescription}</p>
                </div>
                </div>
        </div>
    )
}