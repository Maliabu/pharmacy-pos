/* eslint-disable @next/next/no-img-element */
"use client"

import { date, fetcher } from "@/app/services/services";
import useSWR from "swr";
import { Prescription } from "./prescriptionColumns";
import parse from 'html-react-parser'

export default function PreviewPrescription(props: {prescriptionId: number}){
    const { data: data2, error: error2 } = useSWR(
        props.prescriptionId ? `/api/prescriptions/${props.prescriptionId}` : null, // Conditional key
        fetcher
    );

    let prescription: Prescription[] = []
    if (error2) return <div className="sm:w-[800px]">Error loading prescriptions</div>;
    if (!data2) return <div className="sm:w-[800px]">Loading prescriptions...</div>;
    if(data2){prescription = data2}
    console.log(prescription)

    return(
        <div className="sm:p-12 rounded-md sm:w-[800px]">
            <div className="flex justify-between border-b pb-6">
            <img src="https://newfeelventures.com/logo.png" alt="logo" width={200} height={100}/>
            </div>
            <div className="flex justify-between">
                <div className="flex flex-col text-sm mt-8">
                <p>{prescription[0].name}</p>
                    <p>{prescription[0].age} - {prescription[0].sex}</p>
                    <p>{prescription[0].physicalAddress}</p>
                    <p>{prescription[0].phone}</p>

                </div>
                <div className="flex flex-col text-sm mt-8">
                    <p>{prescription[0].users.name}</p>
                    <p>{date(prescription[0].createdAt.toString())}</p>
                </div>
            </div>
            <div>
                    <div className="font-bold mt-12">TESTS DONE</div>
                    <p className="text-sm">{prescription[0].testsDone}</p>
                    <div className="font-bold mt-6">DIAGNOSIS</div>
                    <div className="text-sm">{prescription[0].diagnosis}</div>
                <div className="text-sm mt-6">
                    <p className="font-bold">PRESCRIPTION</p>
                    <div>{parse(prescription[0].prescription)}</div>
                </div>
                </div>
        </div>
    )
}